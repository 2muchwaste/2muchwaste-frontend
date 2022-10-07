import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {map} from "rxjs/operators";
import {AppConstants} from "../utils/constants";


@Component({
  selector: 'app-signoper',
  templateUrl: './signoper.component.html',
  styleUrls: ['./signoper.component.scss']
})
export class SignoperComponent implements OnInit {
  user = new User('', '', new Date(), '', '', 'Via Roma 10'
    , 63900, 'Fermo', 'customer', '')

  password: string = ''

  constructor(private http: HttpClient) {  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log("Pressed")
    this.http.post(AppConstants.serverURL+'/api/v1/customers/auth/signoper', this.user).pipe(map((responseData: any) => {
      let dataObject: any = {}
      dataObject = responseData;
      return dataObject
    })).subscribe((response: any) => {
      console.log("response: " +response)

    })
  }

}
