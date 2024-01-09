import {Component, OnInit} from '@angular/core'
import {FormControl, Validators} from '@angular/forms'
import {MatDialog} from '@angular/material/dialog'
import {AuthenticationService} from "../services/backendcalls/authenticationservice"
import {WebsiteRole} from "../models/role"
import {Router} from "@angular/router"
import {CustomerService} from "../services/backendcalls/customerservice"
import {OperatorService} from "../services/backendcalls/operatorservice"
import {UserInformationService} from "../services/userinformationservice"
import {SocketService} from "../services/notificationsservice"
import {Subscription} from "rxjs"
import {LocalStorageService} from "../services/localstorageservice"

/**
 * @title Input with error messages
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./../app.component.scss', './sign-in.component.scss']
})
export class SignInComponent implements OnInit {

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
    private notificationService: SocketService,
    private lStorageService: LocalStorageService
  ) {
    this.loginObservable = this.userInfoService.userSetObservable.subscribe({
      next: (res) => {
        this.router.navigate(['/customerhome'])
      }
    })
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

  makeLogin(email: any, password: any, role: WebsiteRole) {
    this.authenticationService.signin(email, password, role)
      .subscribe({
        next: (signinResponse) => {
          console.log(signinResponse)
          this.lStorageService.setUserToken(signinResponse.token)
          if(role===WebsiteRole.CUSTOMER){

          this.customerService.getCustomerByID(signinResponse.id).subscribe({
            next: (userResponse) => {
              this.userInfoService.login(userResponse, signinResponse.token)
              this.router.navigate(['/customerhome'])
            },
            error: (err) => {
              this.dialog.open(SigninErrorDialogComponent)
            }
          })
          }
          else if(role===WebsiteRole.OPERATOR) {
           this.operatorService.getOperatorByID(signinResponse.id).subscribe({
                      next: (userResponse) => {
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
