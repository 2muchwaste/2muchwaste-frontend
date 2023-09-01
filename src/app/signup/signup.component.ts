import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {map} from "rxjs/operators";
import {AppConstants} from "../utils/constants";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDatepicker} from "@angular/material/datepicker";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  // user = new User('', '', new Date(), '', '', 'Via mengoli 15'
  //   , 61122, 'Pesaro', 'customer', '')

  roles: string[] = ['Admin', 'User', 'Operator']

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

  formGroupt = [this.nameFormControl, this.surnameFormControl, this.emailFormControl, this.CFFormControl, this.passwordFormControl, this.zipCodeFormControl, this.cityFormControl, this.birthdayFormControl]

  // user = new User()
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  initUser(): User {
    return new User(
      this.nameFormControl.value,
      this.surnameFormControl.value,
      ('' + this.birthdayFormControl.value.getFullYear() + '-' + this.birthdayFormControl.value.getMonth() + '-' + this.birthdayFormControl.value.getDate()),
      this.CFFormControl.value,
      this.emailFormControl.value,
      this.addressFormControl.value,
      this.zipCodeFormControl.value,
      this.cityFormControl.value,
      this.roleFormControl.value,
      this.passwordFormControl.value
    )
  }

  onSubmit(): void {
    console.log("Pressed")
    let user = this.initUser()
    console.log(user)
    this.http.post(AppConstants.serverURL + '/api/v1/auth/' + this.roleFormControl.value + '/signup', user).pipe(map((responseData: any) => {
      let dataObject: any = {}
      dataObject = responseData;
      return dataObject
    })).subscribe((response: any) => {
      console.log("response: ")
      console.log(response)
      //this.newMovie._id = response["_id"];
      /*console.log("newmovie");
      console.log(this.newMovie)
      console.log("movie id");
      console.log(response["_id"]);*/
    })
    // console.log('Submitted')
    // this.formGroupt.forEach((value) => console.log(value))
    // console.log('User element:')
    // console.log(this.initUser())
  }
}
