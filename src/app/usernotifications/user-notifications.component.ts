import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserInformationService} from "../services/userinformationservice";
import {UserNotification} from "../models/UserNotification";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {CustomerService} from "../services/backendcalls/customerservice";
import {UserResponse} from "../models/userresponse";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit, OnDestroy {

  private CLASS_TAG = "UserNotificationsComponent:"
  notificationsFiltered: UserNotification[] = []
  lowValue: number = 0
  highValue: number = 10
  showReadNotification = true
  notifications!: UserNotification[]
  subscriptionToNewNotification: Subscription
  subscriptionToUserSet: Subscription
  notificationToTickAsRead = new Set<string>([])
  @ViewChild('matPaginator') matPaginator!: MatPaginator

  constructor(
    public userInfoService: UserInformationService,
    private authorizationService: Authorizationservice,
    private customerService: CustomerService,
  ) {
    this.subscriptionToNewNotification = this.userInfoService.userNewNotificationObservable.subscribe(userResponse => {
      this.setNotifications(userResponse);
    })
    this.subscriptionToUserSet = this.userInfoService.userSetObservable.subscribe(userResponse => {
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
    console.log(this.CLASS_TAG, 'ngOnInit, this.userInfoService.user:', this.userInfoService.user);
    if (this.userInfoService.user)
      this.setNotifications(this.userInfoService.user)
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
    this.notifications = this.showReadNotification ? this.userInfoService.getNotifications() : this.userInfoService.getNotReadNotifications()
    if (this.lowValue >= this.notifications.length) this.resetPaginator(this.matPaginator.pageSize)
  }

  private resetPaginator(pageSize: number) {
    this.lowValue = 0
    this.highValue = pageSize
    this.matPaginator.pageIndex = 0
    this.matPaginator.pageSize = pageSize
  }

  public tickNotificationsAsRead() {
    let newUser: UserResponse = this.userInfoService.user
    let notificationToReadNumber = 1
    this.notificationToTickAsRead.forEach(notificationID => {
      this.customerService.readNotification(this.userInfoService.user.cf, notificationID).subscribe({
        next: (res) => {

          newUser = res
          console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, newUser: ', newUser);
          if (notificationToReadNumber >= this.notificationToTickAsRead.size) {
            newUser.notifications[newUser.notifications.findIndex(noti => noti._id === notificationID)].read = true
            console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, last lap');
            this.userInfoService.readNotifications(newUser)
            this.notifications = this.userInfoService.getNotifications()
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
