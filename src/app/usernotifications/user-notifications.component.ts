import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserInformationService} from "../services/userinformationservice";
import {UserNotification} from "../models/UserNotification";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {CustomerService} from "../services/backendcalls/customerservice";
import {UserResponse} from "../models/userresponse";
import {Router} from "@angular/router";

@Component({
  selector: 'app-usernotifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit, OnDestroy {

  private CLASS_TAG = "UserNotificationsComponent:"
  // notifications: UserNotification[] = []
  notificationsFiltered: UserNotification[] = []
  lowValue: number = 0;
  highValue: number = 10;
  notificationNumber!: number
  showReadNotification = true;
  // notifications : UserNotification[] = [new UserNotification("00", new Date,false,'notifica di prova')]
  notifications!: UserNotification[]
  subscriptionToNewNotification: Subscription
  subscriptionToUserSet: Subscription
  // subscriptionNotification: Subscription
  notificationToTickAsRead = new Set<string>([])
  @ViewChild('matPaginator') matPaginator!: MatPaginator

  constructor(
    public userInfoService: UserInformationService,
    private customerService: CustomerService,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {
    this.subscriptionToNewNotification = this.userInfoService.userNewNotificationObservable.subscribe(userResponse => {
      this.setNotifications(userResponse);
    })
    this.subscriptionToUserSet = this.userInfoService.userSetObservable.subscribe(userResponse => {
      console.log(this.CLASS_TAG, 'userSetObservable.subscribe, userResponse:', userResponse);
      this.setNotifications(userResponse)
    })
    // this.subscriptionUser = this.userInfoService.userLoggingIn.subscribe(userResponse => {
    //   console.log(this.CLASS_TAG, " userLoggedModificato, userResponse ", userResponse);
    //   this.notifications = userResponse.notifications
    //   this.notificationsFiltered = this.notifications.filter(noti => this.showReadNotification || !noti.read)
    //   console.log(this.CLASS_TAG + "this.notifications", this.notifications);
    //   console.log(this.CLASS_TAG + "this.notificationsFiltered", this.notificationsFiltered);
    // })

    // this.subscriptionNotification = this.userInfoService.userNewNotificationObservable.subscribe(newNotification => {
    //   console.log(this.CLASS_TAG, " newNotification :", newNotification);
    //   this.notifications.unshift(newNotification)
    //   this.notificationsFiltered = this.notifications.filter(noti => this.showReadNotification || !noti.read)
    // })
  }

  private setNotifications(userResponse: UserResponse) {
    this.notifications = userResponse.notifications
    this.notificationsFiltered = this.notifications.filter(noti => this.showReadNotification || !noti.read)
  }

  ngOnInit(): void {
    console.log(this.CLASS_TAG, 'ngOnInit, this.userInfoService.user:', this.userInfoService.user);
    if (this.userInfoService.user)
      this.setNotifications(this.userInfoService.user)
    // console.log(this.CLASS_TAG, 'ngOnInit, this.userInfoService.user:', this.userInfoService.user);
  }

  ngOnDestroy() {
    this.subscriptionToNewNotification.unsubscribe()
    // this.subscriptionNotification.unsubscribe()
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
    // Serve controllare di non mandare in lettura quelle già lette dato il frontend??
    let newUser: UserResponse = this.userInfoService.user
    let i = 1
    this.notificationToTickAsRead.forEach(notificationID => {
      this.customerService.readNotification(this.userInfoService.user.cf, notificationID).subscribe({
        next: (res) => {

          newUser = res
          console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, newUser: ', newUser);
          if (i >= this.notificationToTickAsRead.size) {
            newUser.notifications[newUser.notifications.findIndex(noti => noti._id === notificationID)].read = true
            console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, last lap');
            this.userInfoService.readNotifications(newUser)
            this.notifications = this.userInfoService.getNotifications()
          }
          i += 1
        },
        error: (err) => {

        }
      })
    })
    this.notificationToTickAsRead = new Set<string>()

  }

  showOptions(event: MatCheckboxChange) {
    console.log(event);
  }

  tickNotification(checked: boolean, notificationID: string) {
    if (checked) {
      this.notificationToTickAsRead.add(notificationID)
    } else {
      this.notificationToTickAsRead.delete(notificationID)
    }
    console.log(this.notificationToTickAsRead);
  }

  protected readonly length = length;
}
