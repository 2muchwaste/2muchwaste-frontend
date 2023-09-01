import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {AppConstants} from "../utils/constants";
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  constructor(private http: HttpClient,
              private dialog: MatDialog) {
  }

  roles: string[] = ['admin', 'user', 'operator']

  hide = true

  nameFormControl = new FormControl('', [Validators.required])
  surnameFormControl = new FormControl('', [Validators.required])
  emailFormControl = new FormControl('', [Validators.required])
  CFFormControl = new FormControl('', [Validators.required])
  passwordFormControl = new FormControl('', [Validators.required])
  zipCodeFormControl = new FormControl('', [Validators.required])
  addressFormControl = new FormControl('', [Validators.required])
  cityFormControl = new FormControl('', [Validators.required])
  birthdayFormControl = new FormControl('', [Validators.required])
  roleFormControl = new FormControl('', [Validators.required])

  formGroup = [
    this.nameFormControl,
    this.surnameFormControl,
    this.emailFormControl,
    this.CFFormControl,
    this.passwordFormControl,
    this.zipCodeFormControl,
    this.cityFormControl,
    this.birthdayFormControl
  ]

  // user = new User()

  ngOnInit(): void {
  }

  initUser(): User {
    return new User(
      this.nameFormControl.value,
      this.surnameFormControl.value,
      (
        this.birthdayFormControl.value.getFullYear() + '-'
        + this.birthdayFormControl.value.getMonth() + '-'
        + this.birthdayFormControl.value.getDate()
      ),
      this.CFFormControl.value,
      this.emailFormControl.value,
      this.addressFormControl.value,
      this.zipCodeFormControl.value,
      this.cityFormControl.value,
      this.roleFormControl.value,
      this.passwordFormControl.value
    )
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
    console.log("Pressed")
    let user = this.initUser()
    let requestUrl = AppConstants.serverURL + '/api/v1/auth/' + this.roleFormControl.value + '/signup'
    this.http.post(requestUrl, user)
      .subscribe({
        next: (res) => {
          console.log("Signup succes")
          console.log(res)
        },
        error: (errorObject) => {
          console.log("Signup error")
          console.log(errorObject)
          console.log('errorObject.status')
          console.log(errorObject.status)
          console.log('errorObject.error')
          console.log(errorObject.error)
          this.dialog.open(SignupErrorDialogComponent,{
            data: {
              statusCode: errorObject.status
            }
          });

        }
      })
  }
}

@Component({
  selector: 'app-signup-error-dialog',
  templateUrl: 'signup-error-dialog.html',
})
export class SignupErrorDialogComponent {

  emailAlreadyPresent = false
  constructor(@Inject(MAT_DIALOG_DATA) public errorStatus: any) {
    this.emailAlreadyPresent = true
  }
}
