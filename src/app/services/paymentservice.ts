import {AppConstants} from "../utils/constants";
import {HttpRequestService} from "./httprequestservice";
import {Payment} from "../models/payment";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private backendPaymentURL = AppConstants.serverURL + AppConstants.versionBackend + 'payments/'

  constructor(
    private httpReqService: HttpRequestService
  ) {
  }

  getPayments() {
    return this.httpReqService.getRequest<Payment[]>(this.backendPaymentURL)
  }

  getPaymentByID(paymentID: string) {
    return this.httpReqService.getRequest<Payment>(this.backendPaymentURL + paymentID)
  }

  getPaymentStatusByID(paymentID: string) {
    return this.httpReqService.getRequest(this.backendPaymentURL + paymentID + '/status')
  }

  getUserInvoicesByUserID(userID: string) {
    return this.httpReqService.getRequest(this.backendPaymentURL + 'user/' + userID)
  }

  createPayment(userID: string, invoiceIssueDate: Date, value: number) {
    return this.httpReqService.postRequest(
      this.backendPaymentURL,
      {userID: userID, invoiceIssueDate: invoiceIssueDate, value: value, status: 'pending'}
    )
  }

  updatePaymentByID(paymentID: string, status: string) {
    return this.httpReqService.patchRequest(
      this.backendPaymentURL + paymentID,
      {status: status}
    )
  }

  updatePaymentStatusByID(paymentID: string, status: string) {
    return this.httpReqService.patchRequest(
      this.backendPaymentURL + paymentID,
      {status: status}
    )
  }

  deletePaymentByID(paymentID: string) {
    return this.httpReqService.deleteRequest(this.backendPaymentURL + paymentID)
  }

}
