import {AfterViewInit, Component, OnInit} from '@angular/core'
import {FormControl, Validators} from '@angular/forms'
import {MatDialog} from '@angular/material/dialog'
import {AuthenticationService} from "../services/backendcalls/authenticationservice"
import {WebsiteRole} from "../models/role"
import {AppConstants} from "../utils/constants"
import {Router} from "@angular/router";
import {CustomerService} from "../services/backendcalls/customerservice";
import {UserInformationService} from "../services/userinformationservice";
import {SocketService} from "../services/notificationsservice";

/**
 * @title Input with error messages
 */
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./../app.component.scss', './signin.component.scss']
})
export class SigninComponent implements OnInit, AfterViewInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email])
  passwordFormControl = new FormControl('', [Validators.required])
  roleFormControl = new FormControl('', [Validators.required])

  formGroup = [this.emailFormControl, this.passwordFormControl, this.roleFormControl]

  hide = true


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private customerService: CustomerService,
    private userInfoService: UserInformationService,
    private notificationService: SocketService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // setTimeout(() =>
    //   this.makeLogin('michirenati@gmail.com', 'carciofo', WebsiteRole.CUSTOMER),
    //   1000
    // )
    //////////
    //////////
    // PER DEBUG E TEST
    // PER DEBUG E TEST
    //////////
    //////////
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
    this.makeLogin(this.emailFormControl.value, this.passwordFormControl.value, WebsiteRole.CUSTOMER);
  }

  private makeLogin(email: any, password: any, role: WebsiteRole) {
    this.authenticationService.signin(email, password, role)
      .subscribe({
        next: (res) => {
          console.log(res)
          localStorage.setItem(AppConstants.lSToken, res.token)
          localStorage.setItem(AppConstants.lSUserID, res.id)
          this.customerService.getCustomerByID(res.id).subscribe({
            next: (res) => {
              //console.log(res);
              this.userInfoService.login2023_11_24_01(res)
              // this.userInfoService.user = res
              // this.userInfoService.user.notifications
              //   = this.userInfoService.user.notifications
              //   .map(noti => {
              //     noti.date = new Date(noti.date);
              //     return noti
              //   })
              localStorage.setItem(AppConstants.userObject, JSON.stringify(res))
              // this.userInfoService.login(res)
              // console.log(this.userInfoService);
              this.router.navigate(['/customerhome'])
            },
            error: (err) => {
              this.dialog.open(SigninErrorDialogComponent)
            }
          })
        },
        error: (err) => {
          console.log(err)
          this.dialog.open(SigninErrorDialogComponent)
        }
      })
  }
}

@Component({
  selector: 'app-signin-error-dialog',
  templateUrl: 'signin-error-dialog.html',
})
export class SigninErrorDialogComponent {
  constructor() {
  }
}
