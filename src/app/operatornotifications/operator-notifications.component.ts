import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserInformationService} from "../services/userinformationservice";
import {
  OperatorNotificationAndDumpster,
  OperatorNotificationStatus,
  OperatorNotificationStatusManager
} from "../models/operatornotification";
import {MatPaginator} from "@angular/material/paginator";
import {Subscription} from "rxjs";
import {OperatorService} from "../services/backendcalls/operatorservice";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";
import {DumpsterErrorTypeManager} from "../models/dumpstererrortype";
import {TrashTypeManager} from "../models/trashtype";
import {NotificationDumpsterService} from "../services/middleware/notificationdumpsterservice";

@Component({
  selector: 'app-operator-notifications',
  templateUrl: './operator-notifications.component.html',
  styleUrls: ['./operator-notifications.component.scss']
})
export class OperatorNotificationsComponent implements OnInit, OnDestroy {

  private CLASS_TAG = "OperatorNotificationsComponent:"
  lowValue: number = 0
  highValue: number = 10
  showEvenInProgressComplete = true
  notShowReadNotifications = true
  allNotifications!: OperatorNotificationAndDumpster[]
  notifications!: OperatorNotificationAndDumpster[]
  readonly DumpsterErrorTypeManager = new DumpsterErrorTypeManager()
  readonly OperatorNotificationStatusManager = new OperatorNotificationStatusManager()
  readonly TrashTypeManager = new TrashTypeManager()
  subscriptionToUserSet: Subscription
  subscriptionToNewNotification: Subscription
  notificationToTickAsRead = new Set<string>([])
  @ViewChild('matPaginator') matPaginator!: MatPaginator

  constructor(
    public userInfoService: UserInformationService,
    private authorizationService: Authorizationservice,
    private notificationDumpsterService: NotificationDumpsterService,
  ) {

    this.subscriptionToNewNotification = this.userInfoService.operatorNewNotificationsSubjectObservable.subscribe(operatorNotifications => {
      console.log(this.CLASS_TAG + ": operatorNotification", operatorNotifications)
      this.setNotifications(operatorNotifications)
    })

    this.subscriptionToUserSet = this.userInfoService.userSetObservable.subscribe(operatorResponse => {
      console.log(this.CLASS_TAG, 'userSetObservable.subscribe, operatorResponse:', operatorResponse);
      this.notificationDumpsterService.getInformativeOperatorNotifications().subscribe({
        next: (res) => {
          this.setNotifications(res)
        }
      })
    })
  }

  private setNotifications(operatorNotifications: OperatorNotificationAndDumpster[]) {
    this.allNotifications = this.notifications = operatorNotifications.map(noti => {
      noti.operatorNotification.date = new Date(noti.operatorNotification.date)
      return noti
    }).sort((noti1, noti2) => noti2.operatorNotification.date.getTime() - noti1.operatorNotification.date.getTime())
  }

  ngOnInit(): void {
    this.authorizationService.checkAuthDataORRedirect()
    console.log(this.CLASS_TAG, 'ngOnInit, this.userInfoService.user:', this.userInfoService.user);
    if (this.userInfoService.user)
      this.setNotifications(this.userInfoService.operatorNotifications)
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
    this.showEvenInProgressComplete = !this.showEvenInProgressComplete
    if (this.showEvenInProgressComplete) {
      this.notifications = this.allNotifications
    } else {
      this.notifications = this.allNotifications.filter(noti => noti.operatorNotification.status === OperatorNotificationStatus.PENDING)
    }
    if (this.lowValue >= this.allNotifications.length) this.resetPaginator(this.matPaginator.pageSize)
  }

  private resetPaginator(pageSize: number) {
    this.lowValue = 0
    this.highValue = pageSize
    this.matPaginator.pageIndex = 0
    this.matPaginator.pageSize = pageSize
  }
}
