import {Injectable} from "@angular/core";
import {HttpRequestService} from "./httprequestservice";
import {AppConstants} from "../../utils/constants";
import {InvalidRoleError, WebsiteRole, WebSiteRoleHelper} from "../../models/role";
import {User} from "../../models/user";
import {SignInResponse} from "../../models/signInResponse";
import {UserResponse} from "../../models/userresponse";


@Injectable({
  providedIn: "root"
})
export class AuthenticationService {

  private authenticationBackendURL = AppConstants.serverURL + AppConstants.versionBackend + "auth/"
  private CLASS_TAG = "AuthenticationService";

  constructor(private httpReqService: HttpRequestService) {
  }

  signup(user: User, role: string) {
    // user.role = WebSiteRoleHelper.getNameRole(role)
    console.log(this.CLASS_TAG + ": user", user)
    return this.httpReqService.postRequest(
      this.authenticationBackendURL + role + '/signup',
      user
    )
  }

  signin(email: string, password: string, role: string) {
    return this.httpReqService.postRequest<SignInResponse>(
      this.authenticationBackendURL + role + '/signin',
      {email: email, password: password}
    )
  }

  signout(role: WebsiteRole) {
    return this.httpReqService.postRequest(
      this.authenticationBackendURL + WebSiteRoleHelper.getNameRole(role) + '/signout',
      {}
    )
  }

}
