import {Injectable} from "@angular/core";
import {AppConstants} from "../../utils/constants";
import {HttpRequestService} from "./httprequestservice";
import {DumpsterErrorType} from "../../models/dumpstererrortype";
import {OperatorNotification, OperatorNotificationStatus} from "../../models/operatornotification";

@Injectable({
  providedIn: 'root'
})
export class OperatorNotificationService {
  private backendOpNotificationURL = AppConstants.serverURL + AppConstants.versionBackend + 'opnotifications/'


  constructor(
    private httpReqService: HttpRequestService
  ) {
  }

  getOperatorNotifications() {
    return this.httpReqService.getRequest<OperatorNotification[]>(this.backendOpNotificationURL)
  }

  getPendingNotification() {
    return this.httpReqService.getRequest(this.backendOpNotificationURL + 'status/pending')
  }

  getInProgressNotification() {
    return this.httpReqService.getRequest(this.backendOpNotificationURL + 'status/inprogress')
  }

  getCompletedNotification() {
    return this.httpReqService.getRequest(this.backendOpNotificationURL + 'status/complete')
  }

  getNotificationsByProblemFull() {
    return this.httpReqService.getRequest(this.backendOpNotificationURL + NotificationErrorTypePath.FULL)
  }

  getNotificationsByProblemPhy() {
    return this.httpReqService.getRequest(this.backendOpNotificationURL + NotificationErrorTypePath.PHYSICAL_PROBLEM)
  }

  getNotificationsByProblemObstruction() {
    return this.httpReqService.getRequest(this.backendOpNotificationURL + NotificationErrorTypePath.OBSTRUCTION)
  }

  getNotificationsByProblemError() {
    return this.httpReqService.getRequest(this.backendOpNotificationURL + NotificationErrorTypePath.ERROR)
  }

  createOperatorNotification(notificationType:string, dumpsterID:string) {
    return this.httpReqService.postRequest(
      this.backendOpNotificationURL,
      {dumpsterID:dumpsterID,type:notificationType})
  }

  getNotificationByID(opNotificationID: string) {
    return this.httpReqService.getRequest(this.backendOpNotificationURL + opNotificationID)
  }

  updateNotificationByID(opNotificationID:string, notificationStatus: OperatorNotificationStatus) {
    return this.httpReqService.patchRequest(
      this.backendOpNotificationURL + opNotificationID,
      {status:notificationStatus})
  }

  deleteNotificationByID(opNotificationID:string) {
    return this.httpReqService.deleteRequest(this.backendOpNotificationURL + opNotificationID)
  }

}

enum NotificationErrorTypePath {
  FULL='problems/full',
  PHYSICAL_PROBLEM = 'problems/phy',
  OBSTRUCTION ='problems/obstruction',
  ERROR = 'problems/error',
}
