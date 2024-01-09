import {Injectable} from "@angular/core";
import {AppConstants} from "../../utils/constants";
import {HttpRequestService} from "./httprequestservice";
import {Empty} from "../../models/empty";

@Injectable({
  providedIn: 'root'
})
export class EmptyService {
  private backendEmptyURL = AppConstants.serverURL + AppConstants.versionBackend + 'empty/'

  constructor(
    private httpReqService: HttpRequestService
  ) {
  }

  getEmpty() {
    return this.httpReqService.getRequest<Empty[]>(this.backendEmptyURL)
  }

  getEmptyFromDumpster(dumpsterID: string) {
    return this.httpReqService.getRequest<Empty[]>(this.backendEmptyURL + 'dumpster/' +dumpsterID)
  }

  getEmptyFromUser(userID: string) {
    return this.httpReqService.getRequest<Empty[]>(this.backendEmptyURL + 'user/' + userID)
  }

  createEmpty(quantity: number, dumpsterID: string, userID: string) {

    return this.httpReqService.postRequest<Empty>(
      this.backendEmptyURL,
      {quantity: quantity, dumpsterID: dumpsterID, userID: userID})
  }
}
