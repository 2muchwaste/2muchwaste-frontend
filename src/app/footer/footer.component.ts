import { Component, OnInit } from '@angular/core';
import {UserInformationService} from "../services/userinformationservice";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public userInfoService: UserInformationService
  ) { }

  ngOnInit(): void {
  }

}
