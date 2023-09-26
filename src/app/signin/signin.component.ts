import {Component, OnInit} from '@angular/core'
import {FormControl, Validators} from '@angular/forms'
import {MatDialog} from '@angular/material/dialog'
import {AuthenticationService} from "../services/backendcalls/authenticationservice"
import {WebsiteRole} from "../models/role"
import {AppConstants} from "../utils/constants"
import {Router} from "@angular/router";

/**
 * @title Input with error messages
 */
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email])
  passwordFormControl = new FormControl('', [Validators.required])
  roleFormControl = new FormControl('', [Validators.required])

  formGroup = [this.emailFormControl, this.passwordFormControl, this.roleFormControl]

  hide = true

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) {
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
    this.authenticationService.signin(this.emailFormControl.value, this.passwordFormControl.value, WebsiteRole.CUSTOMER)
      .pipe()
      .subscribe({
        next: (res) => {
          console.log(res)
          localStorage.setItem(AppConstants.lSToken, res.token)
          localStorage.setItem(AppConstants.lSUserID, res._id)
          this.router.navigate(['/customerhome'])
        },
        error: (err) => {
          console.log(err)
          this.dialog.open(SigninErrorDialogComponent)
          // this.errorLogin=true
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
