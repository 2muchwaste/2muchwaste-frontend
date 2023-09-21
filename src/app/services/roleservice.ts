import {AppConstants} from "../utils/constants";
import {HttpRequestService} from "./httprequestservice";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RoleService{
  private backendRoleURL = AppConstants.serverURL + AppConstants.versionBackend + 'roles/'


  constructor(
    private httpReqService: HttpRequestService
  ) {
  }
  getRoles(){
    return this.httpReqService.getRequest(this.backendRoleURL)
  }
}
