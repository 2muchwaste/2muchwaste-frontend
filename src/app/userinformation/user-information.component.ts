import {Component, OnInit} from '@angular/core'
import {UserInformationService} from "../services/userinformationservice"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {


  constructor(
    public userInfoService: UserInformationService,
    private authorizationService: Authorizationservice
  ) {
  }

  ngOnInit(): void {
    this.authorizationService.checkAuthDataORRedirect()
  }

}
