import {Injectable} from "@angular/core";
import {HttpRequestService} from "./httprequestservice";
import {AppConstants} from "../../utils/constants";
import {InvalidRoleError, WebsiteRole} from "../../models/role";
import {User} from "../../models/user";
import {SigninResponse} from "../../models/signinresponse";
import {UserResponse} from "../../models/userresponse";


@Injectable({
  providedIn: "root"
})
export class AuthenticationService {

  private authenticationBackendURL = AppConstants.serverURL + AppConstants.versionBackend + "auth/"

  constructor(private httpReqService: HttpRequestService) {
  }

  signup(user: User, role: WebsiteRole) {
    return this.httpReqService.postRequest<UserResponse>(
      this.authenticationBackendURL + role + '/signup',
      user
    )
  }

  signin(email: string, password: string, role: WebsiteRole) {
    return this.httpReqService.postRequest<SigninResponse>(
      this.authenticationBackendURL + role + '/signin',
      {email: email, password: password}
    )
  }

  signout(role: WebsiteRole) {
    return this.httpReqService.postRequest(
      this.authenticationBackendURL + role + '/signout',
      {}
    )
  }
}
