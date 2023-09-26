import {Injectable} from "@angular/core";
import {AppConstants} from "../../utils/constants";
import {HttpRequestService} from "./httprequestservice";
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private backendUserURL = AppConstants.serverURL + AppConstants.versionBackend + 'users/'

  constructor(
    private httpReqService: HttpRequestService
  ) {
  }

  getUsers(){
    return this.httpReqService.getRequest<User[]>(this.backendUserURL)
  }
}
