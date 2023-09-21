import {Injectable} from "@angular/core"
import {AppConstants} from "../utils/constants"
import {Observable} from "rxjs"
import {User} from "../models/user"
import {HttpRequestService} from "./httprequestservice"

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  private backendCustomerURL = AppConstants.serverURL + AppConstants.versionBackend + 'customers/'

  constructor(private httpReqService: HttpRequestService) {
  }

  getCustomers(){
    return this.httpReqService.getRequest<User[]>(this.backendCustomerURL)
  }
  getCustomerByID(customerID: string) {
    return this.httpReqService.getRequest<User>(this.backendCustomerURL + customerID)
  }

  deleteCustomerByID(customerID: string) {
    return this.httpReqService.deleteRequest(this.backendCustomerURL + customerID)
  }

  getNotificationsFromUser(customerCF: string) {
    return this.httpReqService.getRequest(this.backendCustomerURL + customerCF + '/notifications')
  }

  readNotification(customerCF: string, notificationID: string) {
    return this.httpReqService.patchRequest(
      this.backendCustomerURL + customerCF + '/notifications/' + notificationID,null)
  }

  addNotificationFromUser(customerCF: string, notification: string) {
    return this.httpReqService.postRequest(
      this.backendCustomerURL + customerCF + '/notifications', {text: notification})
  }
}
