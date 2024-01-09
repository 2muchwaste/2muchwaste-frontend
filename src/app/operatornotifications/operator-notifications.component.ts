import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OperatorInformationService} from "../services/operatorinformationservice";
import {UserNotification} from "../models/UserNotification";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {OperatorService} from "../services/backendcalls/operatorservice";
import {UserResponse} from "../models/userresponse";
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
  notifications!: UserNotification[]
  subscriptionToNewNotification: Subscription
  subscriptionToUserSet: Subscription
  notificationToTickAsRead = new Set<string>([])
  @ViewChild('matPaginator') matPaginator!: MatPaginator

  constructor(
    public operatorInfoService: OperatorInformationService,
    private authorizationService: Authorizationservice,
    private operatorService: OperatorService,
  ) {
    this.subscriptionToNewNotification = this.operatorInfoService.userNewNotificationObservable.subscribe(userResponse => {
      this.setNotifications(userResponse);
    })
    this.subscriptionToUserSet = this.operatorInfoService.userSetObservable.subscribe(userResponse => {
      console.log(this.CLASS_TAG, 'userSetObservable.subscribe, userResponse:', userResponse);
      this.setNotifications(userResponse)
    })
  }

  private setNotifications(userResponse: UserResponse) {
    this.notifications = userResponse.notifications
    this.notificationsFiltered = this.notifications.filter(noti => this.showReadNotification || !noti.read)
  }

  ngOnInit(): void {
    this.authorizationService.checkAuthDataORRedirect()
    console.log(this.CLASS_TAG, 'ngOnInit, this.operatorInfoService.user:', this.operatorInfoService.user);
    if (this.operatorInfoService.user)
      this.setNotifications(this.operatorInfoService.user)
  }

  ngOnDestroy() {
    this.subscriptionToNewNotification.unsubscribe()
    this.subscriptionToUserSet.unsubscribe()
  }

  public getPaginatorData(event: PageEvent): PageEvent {
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
    let newUser: UserResponse = this.operatorInfoService.user
    let notificationToReadNumber = 1
    this.notificationToTickAsRead.forEach(notificationID => {
      this.operatorService.readNotification(this.operatorInfoService.user.cf, notificationID).subscribe({
        next: (res) => {

          newUser = res
          console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, newUser: ', newUser);
          if (notificationToReadNumber >= this.notificationToTickAsRead.size) {
            newUser.notifications[newUser.notifications.findIndex(noti => noti._id === notificationID)].read = true
            console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, last lap');
            this.operatorInfoService.readNotifications(newUser)
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
