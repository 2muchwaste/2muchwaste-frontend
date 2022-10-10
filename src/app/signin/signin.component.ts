import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {User} from "../models/user";
import {map} from "rxjs/operators";
import {AppConstants} from "../utils/constants";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  type: string = ''
  email: string = ''
  password: string = ''

  constructor(private route: ActivatedRoute,
              private http: HttpClient) {  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      console.log("type="+this.type);
    });

  }

  onSubmit(): void {
    console.log("Pressed");
    console.log("Mail inserita: " + this.email);
    console.log("Password inserita: " + this.password);

    // this.http.post(AppConstants.serverURL+'/api/v1/customers/auth/signup', this.user).pipe(map((responseData: any) => {
    //   let dataObject: any = {}
    //   dataObject = responseData;
    //   return dataObject
    // })).subscribe((response: any) => {
    //   console.log("response: " +response)
    //   //this.newMovie._id = response["_id"];
    //   /*console.log("newmovie");
    //   console.log(this.newMovie)
    //   console.log("movie id");
    //   console.log(response["_id"]);*/
    // })
  }

}
