import {Component, OnInit} from '@angular/core';
import {UserInformationService} from "../services/userinformationservice";

@Component({
  selector: 'app-userinformation',
  templateUrl: './userinformation.component.html',
  styleUrls: ['./userinformation.component.scss']
})
export class UserinformationComponent implements OnInit {


  constructor(
    public userInfoService: UserInformationService
  ) {
  }

  ngOnInit(): void {
  }

}
