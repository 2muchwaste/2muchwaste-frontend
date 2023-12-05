import {Component, OnInit} from '@angular/core';
import {UserInformationService} from "../services/userinformationservice";
import {AuthenticationService} from "../services/backendcalls/authenticationservice";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";

@Component({
  selector: 'app-userinformation',
  templateUrl: './userinformation.component.html',
  styleUrls: ['./userinformation.component.scss']
})
export class UserinformationComponent implements OnInit {


  constructor(
    public userInfoService: UserInformationService,
    private authorizationService: Authorizationservice
  ) {
  }

  ngOnInit(): void {
    this.authorizationService.checkAuthDataORRedirect()
  }

}
