import {Injectable} from "@angular/core";
import {AppConstants} from "../utils/constants";
import {HttpRequestService} from "./httprequestservice";
import {Deposit} from "../models/deposit";

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  private backendDepositURL = AppConstants.serverURL + AppConstants.versionBackend + 'deposits/'

  constructor(
    private httpReqService: HttpRequestService
  ) {
  }

  getDeposits() {
    return this.httpReqService.getRequest<Deposit[]>(this.backendDepositURL)
  }

  getDepositsFromDumpster(dumpsterID: string) {
    return this.httpReqService.getRequest<Deposit[]>(this.backendDepositURL + 'dumpster/' +dumpsterID)
  }

  getDepositsFromUser(userID: string) {
    return this.httpReqService.getRequest<Deposit[]>(this.backendDepositURL + 'user/' + userID)
  }

  createDeposit(quantity: number, openingTimeSeconds: number, dumpsterID: string, userID: string) {

    return this.httpReqService.postRequest<Deposit>(
      this.backendDepositURL,
      {quantity: quantity, openingTimeSeconds: openingTimeSeconds, dumpsterID: dumpsterID, userID: userID})
  }
}
