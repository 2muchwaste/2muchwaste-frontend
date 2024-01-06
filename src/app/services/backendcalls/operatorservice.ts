import {Injectable} from "@angular/core";
import {AppConstants} from "../../utils/constants";
import {Authorizationservice} from "./authorizationservice";
import {HttpRequestService} from "./httprequestservice";
import {User} from "../../models/user";
import {Observable} from "rxjs";
import {District} from "../../models/district";

@Injectable({
  providedIn: 'root',
})
export class OperatorService {

  private backendOperatorURL = AppConstants.serverURL + AppConstants.versionBackend + 'operators/'
  private objectForEmptyDumpster = (dumpsterID: string) => {
    return {dumpsterID: dumpsterID}
  }

  constructor(private httpReqService: HttpRequestService) {
  }

  getOperators() {
    return this.httpReqService.getRequest<User[]>(this.backendOperatorURL)
  }

  getOperatorByID(operatorID: string) {
    return this.httpReqService.getRequest<User>(this.backendOperatorURL + operatorID)
  }

  getOperatorDistrictByCF(operatorCF: string) {
    return new Observable<District[]>(obs => {
      this.getRawOperatorDistrictByCF(operatorCF)
        .pipe()
        .subscribe({
          next: (res) => {
            obs.next(res[0].districts)
          },
          error: (err) =>
            obs.error(err)
        })
    })
  }

  private getRawOperatorDistrictByCF(operatorCF: string) {
    return this.httpReqService.getRequest <{ districts: District[] }[]>
    (this.backendOperatorURL + operatorCF + '/districts');
  }

  getOperatorEmptiesByCF(operatorCF: string) {
    return new Observable(obs => {
      this.httpReqService.getRequest<{
        empties: {date:Date,dumpsterID:string,_id:string}[]
      }[]>(this.backendOperatorURL + operatorCF + '/empties')
        .pipe()
        .subscribe({
          next: (res) => {
            console.log(res[0].empties);
            obs.next(res)
          },
          error: (err) => {
            obs.error(err)
          }
        })
    })
  }

  addEmptyToOperator(operatorCF: string, dumpsterID: string) {
    return this.httpReqService.postRequest(
      this.backendOperatorURL + operatorCF + '/empties',
      this.objectForEmptyDumpster(dumpsterID))
  }


  addDistrictToOperator(operatorCF: string, zipCode: number, name: string) {
    return this.httpReqService.postRequest(
      this.backendOperatorURL + operatorCF + '/districts',
      {zipCode: zipCode, name: name}
    )
  }

  deleteOperatorByID(operatorID: string) {
    return this.httpReqService.deleteRequest(this.backendOperatorURL + operatorID)
  }
  
  
   getNotificationsFromUser(operatorCF: string) {
    return this.httpReqService.getRequest(this.backendOperatorURL + operatorCF + '/notifications')
  }

  readNotification(operatorCF: string, notificationID: string) {
    return this.httpReqService.patchRequest<UserResponse>(
      this.backendOperatorURL + operatorCF + '/notifications/' + notificationID,null)
  }

  addNotificationFromUser(operatorCF: string, notification: string) {
    return this.httpReqService.postRequest(
      this.backendOperatorURL + operatorCF + '/notifications', {text: notification})
  }
}

}
