import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {map} from "rxjs/operators";
import {AppConstants} from "../utils/constants";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  user = new User('', '', new Date(), '', '', 'via mengoli 15'
    , 61122, 'Pesaro', 'customer', '')

  password: string = ''


  constructor(private http: HttpClient) {  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log("Pressed")
    this.http.post(AppConstants.serverURL+'/api/v1/customers/auth/signup', this.user).pipe(map((responseData: any) => {
      let dataObject: any = {}
      dataObject = responseData;
      return dataObject
    })).subscribe((response: any) => {
      console.log("response: " +response)
      //this.newMovie._id = response["_id"];
      /*console.log("newmovie");
      console.log(this.newMovie)
      console.log("movie id");
      console.log(response["_id"]);*/
    })
  }
}
