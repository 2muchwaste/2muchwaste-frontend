import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {map} from "rxjs/operators";
import {AppConstants} from "../utils/constants";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-signoper',
  templateUrl: './signoper.component.html',
  styleUrls: ['./signoper.component.scss']
})
export class SignoperComponent implements OnInit {
  user = new User('', '', '', '', '', 'Via Roma 10'
    , 63900, 'Fermo', 'customer', '')

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
