import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OperatorInformationService} from "../services/operatorinformationservice";
import {UserInformationService} from "../services/userinformationservice";
import {UserNotification} from "../models/UserNotification";
import {OperatorNotification} from "../models/operatornotification";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {OperatorService} from "../services/backendcalls/operatorservice";
import {OperatorResponse} from "../models/operatorresponse";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";


@Component({
  selector: 'app-operator-notifications',
  templateUrl: './operator-notifications.component.html',
  styleUrls: ['./operator-notifications.component.scss']
})
export class OperatorNotificationsComponent implements OnInit, OnDestroy {

  private CLASS_TAG = "OperatorNotificationsComponent:"
  notificationsFiltered: OperatorNotification[] = []
  lowValue: number = 0
  highValue: number = 10
  showReadNotification = true
  notifications!: OperatorNotification[]
  subscriptionToNewNotification: Subscription
  subscriptionToUserSet: Subscription
  notificationToTickAsRead = new Set<string>([])
  @ViewChild('matPaginator') matPaginator!: MatPaginator

  constructor(
    public userInfoService: UserInformationService,
    public operatorInfoService: OperatorInformationService,
    private authorizationService: Authorizationservice,
    public operator: OperatorResponse,
    private operatorService: OperatorService,
  ) {
    this.subscriptionToNewNotification = this.operatorInfoService.userNewNotificationObservable.subscribe(operatorResponse => {
      this.setNotifications(operatorResponse);
    })
    this.subscriptionToUserSet = this.operatorInfoService.userSetObservable.subscribe(operatorResponse => {
      console.log(this.CLASS_TAG, 'userSetObservable.subscribe, operatorResponse:', operatorResponse);
      this.setNotifications(operatorResponse)
    })
  }

  private setNotifications(operatorResponse: OperatorResponse) {
    this.notifications = operatorResponse.notifications
    this.notificationsFiltered = this.notifications.filter(noti => this.showReadNotification || !noti.read)
  }

  ngOnInit(): void {
    this.authorizationService.checkAuthDataORRedirect()
    console.log(this.CLASS_TAG, 'ngOnInit, this.userInfoService.user:', this.operatorInfoService.operator);
    if (this.operatorInfoService.operator)
      this.setNotifications(this.operatorInfoService.operator)
  }

  ngOnDestroy() {
    this.subscriptionToNewNotification.unsubscribe()
    this.subscriptionToUserSet.unsubscribe()
  }

  public getPaginatorData(event: any): any {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  public filterNotificationsRead() {
    this.showReadNotification = !this.showReadNotification
    this.notifications = this.showReadNotification ? this.operatorInfoService.getNotifications() : this.operatorInfoService.getNotReadNotifications()
    if (this.lowValue >= this.notifications.length) this.resetPaginator(this.matPaginator.pageSize)
  }

  private resetPaginator(pageSize: number) {
    this.lowValue = 0
    this.highValue = pageSize
    this.matPaginator.pageIndex = 0
    this.matPaginator.pageSize = pageSize
  }

  public tickNotificationsAsRead() {
    // Serve controllare di non mandare in lettura quelle già lette dato il frontend??
    let newOperator: OperatorResponse = this.operatorInfoService.operator
    let notificationToReadNumber = 1
    this.notificationToTickAsRead.forEach(notificationID => {
      this.operatorService.readNotification(this.operatorInfoService.operator.cf, notificationID).subscribe({
        next: (res) => {

          newOperator = res
          console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, newOperator: ', newOperator);
          if (notificationToReadNumber >= this.notificationToTickAsRead.size) {
            newOperator.notifications[newOperator.notifications.findIndex(noti => noti._id === notificationID)].read = true
            console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, last lap');
            this.operatorInfoService.readNotifications(newOperator)
            this.notifications = this.operatorInfoService.getNotifications()
          }
          notificationToReadNumber += 1
        },
        error: (err) => {

        }
      })
    })

    this.notificationToTickAsRead.forEach(notificationID => {
          this.operatorService.readNotification(this.operatorInfoService.operator.cf, notificationID).subscribe({
            next: (res) => {

              newOperator = res
          console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, newUser: ', newOperator);
          if (notificationToReadNumber >= this.notificationToTickAsRead.size) {
            newOperator.notifications[newOperator.notifications.findIndex(noti => noti._id === notificationID)].read = true
            console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, last lap');
            this.operatorInfoService.readNotifications(newOperator)
            this.notifications = this.operatorInfoService.getNotifications()
          }
          notificationToReadNumber += 1
        },
        error: (err) => {

        }
      })
    })
    this.notificationToTickAsRead = new Set<string>()

  }

  tickNotification(checked: boolean, notificationID: string) {
    if (checked) {
      this.notificationToTickAsRead.add(notificationID)
    } else {
      this.notificationToTickAsRead.delete(notificationID)
    }
    console.log(this.notificationToTickAsRead);
  }
}
