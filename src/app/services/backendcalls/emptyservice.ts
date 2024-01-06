import {Injectable} from "@angular/core";
import {AppConstants} from "../../utils/constants";
import {HttpRequestService} from "./httprequestservice";
import {Deposit} from "../../models/empty";

@Injectable({
  providedIn: 'root'
})
export class EmptyService {
  private backendDepositURL = AppConstants.serverURL + AppConstants.versionBackend + 'empty/'

  constructor(
    private httpReqService: HttpRequestService
  ) {
  }

  getEmpty() {
    return this.httpReqService.getRequest<Empty[]>(this.backendDepositURL)
  }

  getEmptyFromDumpster(dumpsterID: string) {
    return this.httpReqService.getRequest<Empty[]>(this.backendDepositURL + 'dumpster/' +dumpsterID)
  }

  getEmptyFromUser(userID: string) {
    return this.httpReqService.getRequest<Empty[]>(this.backendDepositURL + 'user/' + userID)
  }

  createEmpty(quantity: number, dumpsterID: string, userID: string) {

    return this.httpReqService.postRequest<Deposit>(
      this.backendDepositURL,
      {quantity: quantity, dumpsterID: dumpsterID, userID: userID})
  }
}
