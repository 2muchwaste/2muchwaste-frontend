import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../utils/constants";
import {FormControl, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
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

  errorLogin: boolean = false

  hide = true

  constructor(private http: HttpClient,
              private router: Router,
              private dialog: MatDialog) {
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

  submit(): void {
    console.log("Submitted")
    // this.logInfoSubmitted()
    let login = {
      "email": this.emailFormControl.value,
      "password": this.passwordFormControl.value
    }

    console.log('PRE richiesta POST')
    let role = this.roleFormControl.value

    let requestUrl: string = AppConstants.serverURL + '/api/v1/auth/' + role + '/signin'
    console.log(requestUrl)
    this.http.post<{
      id: string
      token: string
    }>(requestUrl, login)
      .subscribe({
        next: (res) => {
          console.log("Login effettuato con successo")
          console.log(res)
          // console.log(res.token);
          localStorage.setItem('id', res.id)
          localStorage.setItem('type', role)
          localStorage.setItem('token', res.token)
          this.router.navigate(['/customerhome'])
        },
        error: (errorObject) => {
          console.log("Impossibile effettaure il login")
          console.log(errorObject.error)
          this.dialog.open(SigninErrorDialogComponent)
        }
      })
  }

  logInfoSubmitted(): void {
    console.log(this.checkValidity())
    console.log('Email form control:')
    console.log(this.emailFormControl)
    console.log(this.emailFormControl.value)
    console.log("Password form control:")
    console.log(this.passwordFormControl)
    console.log(this.passwordFormControl.value)
    console.log("Role form control:")
    console.log(this.roleFormControl)
    console.log(this.roleFormControl.value)
    console.log(this)
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
