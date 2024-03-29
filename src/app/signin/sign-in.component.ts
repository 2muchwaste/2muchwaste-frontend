import {Component, OnInit} from '@angular/core'
import {FormControl, Validators} from '@angular/forms'
import {MatDialog} from '@angular/material/dialog'
import {AuthenticationService} from "../services/backendcalls/authenticationservice"
// import {WebsiteRole} from "../models/role"
import {Router} from "@angular/router"
import {CustomerService} from "../services/backendcalls/customerservice"
import {OperatorService} from "../services/backendcalls/operatorservice"
import {UserInformationService} from "../services/userinformationservice"
import {OperatorInformationService} from '../services/operatorinformationservice'
import {SocketService} from "../services/notificationsservice"
import {Subscription} from "rxjs"
import {LocalStorageService} from "../services/localstorageservice"
import {RoleService} from "../services/backendcalls/roleservice";
import {WebsiteRole} from "../models/role";

/**
 * @title Input with error messages
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./../app.component.scss', './sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  // readonly WebsiteRole = WebsiteRole;
  private CLASS_TAG = 'SignInComponent'
  emailFormControl = new FormControl('', [Validators.required, Validators.email])
  passwordFormControl = new FormControl('', [Validators.required])
  roleFormControl = new FormControl('', [Validators.required])

  formGroup = [this.emailFormControl, this.passwordFormControl, this.roleFormControl]

  hide = true

  loginObservable: Subscription

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private customerService: CustomerService,
    private operatorService: OperatorService,
    private userInfoService: UserInformationService,
    private operatorInfoService: OperatorInformationService,
    private notificationService: SocketService,
    private lStorageService: LocalStorageService,
    public roleService: RoleService,
  ) {
    this.loginObservable = this.userInfoService.userSetObservable.subscribe({
      next: (res) => {
        if (res && res.role === this.roleService.getCustomerCode()) {
          this.router.navigate(['/customerhome'])
        } else if (res && res.role === this.roleService.getOperatorCode()) {
          this.router.navigate(['/operatorhome']);
        }
      }
    })
    // this.loginObservable = this.userInfoService.userSetObservable.subscribe({
    //   next: (res) => {
    //     if (res && res.role === WebsiteRole.CUSTOMER) {
    //       this.router.navigate(['/customerhome'])
    //     } else if (res && res.role === WebsiteRole.OPERATOR) {
    //       this.router.navigate(['/operatorhome']);
    //     }
    //   }
    // })
  }

  ngOnInit() {
  }

  checkValidity(): boolean {
    let valid = true
    this.formGroup.forEach(form => {
      if (valid && form.invalid) {
        valid = false
      }
    })
    return valid
  }

  checkAndSubmit() {
    if (this.checkValidity()) {
      this.submit()
    }
  }

  submit() {
    this.makeLogin(this.emailFormControl.value, this.passwordFormControl.value, this.roleFormControl.value)
  }

  makeLogin(email: any, password: any, roleName: string) {
    this.authenticationService.signin(email, password, roleName)
      .subscribe({
        next: (signinResponse) => {
          console.log(signinResponse)
          this.lStorageService.setUserToken(signinResponse.token)
          this.lStorageService.setUserRoleName(roleName)
          // if (role === WebsiteRole.CUSTOMER) {
          if (roleName === this.roleService.getCustomerName()) {
            this.customerService.getCustomerByID(signinResponse.id).subscribe({
              next: (userResponse) => {
                this.userInfoService.login(userResponse, signinResponse.token)
                this.router.navigate(['/customerhome'])
              },
              error: (err) => {
                this.dialog.open(SigninErrorDialogComponent)
              }
            })
          } else if (roleName === this.roleService.getOperatorName()) {
            this.operatorService.getOperatorByID(signinResponse.id).subscribe({
              next: (userResponse) => {
                this.lStorageService.setUserCF(userResponse.cf)
                this.userInfoService.login(userResponse, signinResponse.token)
                this.router.navigate(['/operatorhome'])
              },
              error: (err) => {
                this.dialog.open(SigninErrorDialogComponent)
              }
            })
          }
        },
        error: (err) => {
          console.log(err)
          this.dialog.open(SigninErrorDialogComponent)
        }
      })
  }
}

@Component({
  selector: 'app-sign-in-error-dialog',
  templateUrl: './sign-in-error-dialog.html',
})
export class SigninErrorDialogComponent {
  constructor() {
  }
}
