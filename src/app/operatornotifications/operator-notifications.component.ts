import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserInformationService} from "../services/userinformationservice";
import {
  OperatorNotification,
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
  notificationsFiltered: OperatorNotification[] = []
  lowValue: number = 0
  highValue: number = 10
  showEvenInProgressComplete = true
  allNotifications!: OperatorNotificationAndDumpster[]
  notifications!: OperatorNotificationAndDumpster[]
  readonly DumpsterErrorTypeManager = new DumpsterErrorTypeManager()
  readonly OperatorNotificationStatusManager = new OperatorNotificationStatusManager()
  readonly TrashTypeManager = new TrashTypeManager()
  // subscriptionToNewNotification: Subscription
  subscriptionToUserSet: Subscription
  notificationToTickAsRead = new Set<string>([])
  @ViewChild('matPaginator') matPaginator!: MatPaginator

  constructor(
    public userInfoService: UserInformationService,
    // public operatorInfoService: OperatorInformationService,
    private authorizationService: Authorizationservice,
    private notificationDumpsterService: NotificationDumpsterService,
    private operatorService: OperatorService,
  ) {
    // this.subscriptionToNewNotification = this.operatorInfoService.userNewNotificationObservable.subscribe(operatorResponse => {
    //   this.setNotifications(operatorResponse);
    // })
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
    this.allNotifications = this.notifications = operatorNotifications
    // this.notificationsFiltered = this.notifications.filter(noti => this.showReadNotification || !noti.read)
  }

  ngOnInit(): void {
    this.authorizationService.checkAuthDataORRedirect()
    console.log(this.CLASS_TAG, 'ngOnInit, this.userInfoService.user:', this.userInfoService.user);
    if (this.userInfoService.user)
      this.setNotifications(this.userInfoService.operatorNotifications)
  }

  ngOnDestroy() {
    // this.subscriptionToNewNotification.unsubscribe()
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
    // this.allNotifications = this.showEvenInProgressComplete ? this.operatorInfoService.getNotifications() : this.operatorInfoService.getNotReadNotifications()
    if (this.lowValue >= this.allNotifications.length) this.resetPaginator(this.matPaginator.pageSize)
  }

  private resetPaginator(pageSize: number) {
    this.lowValue = 0
    this.highValue = pageSize
    this.matPaginator.pageIndex = 0
    this.matPaginator.pageSize = pageSize
  }

  // public tickNotificationsAsRead() {
  //   // Serve controllare di non mandare in lettura quelle già lette dato il frontend??
  //   let newOperator: OperatorResponse = this.operatorInfoService.operator
  //   let notificationToReadNumber = 1
  //   this.notificationToTickAsRead.forEach(notificationID => {
  //     this.operatorService.readNotification(this.operatorInfoService.operator.cf, notificationID).subscribe({
  //       next: (res) => {
  //
  //         newOperator = res
  //         console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, newOperator: ', newOperator);
  //         if (notificationToReadNumber >= this.notificationToTickAsRead.size) {
  //           newOperator.notifications[newOperator.notifications.findIndex(noti => noti._id === notificationID)].read = true
  //           console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, last lap');
  //           this.operatorInfoService.readNotifications(newOperator)
  //           this.notifications = this.operatorInfoService.getNotifications()
  //         }
  //         notificationToReadNumber += 1
  //       },
  //       error: (err) => {
  //
  //       }
  //     })
  //   })
  //
  //   this.notificationToTickAsRead.forEach(notificationID => {
  //         this.operatorService.readNotification(this.operatorInfoService.operator.cf, notificationID).subscribe({
  //           next: (res) => {
  //
  //             newOperator = res
  //         console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, newUser: ', newOperator);
  //         if (notificationToReadNumber >= this.notificationToTickAsRead.size) {
  //           newOperator.notifications[newOperator.notifications.findIndex(noti => noti._id === notificationID)].read = true
  //           console.log(this.CLASS_TAG, 'this.tickNotificationsAsRead, last lap');
  //           this.operatorInfoService.readNotifications(newOperator)
  //           this.notifications = this.operatorInfoService.getNotifications()
  //         }
  //         notificationToReadNumber += 1
  //       },
  //       error: (err) => {
  //
  //       }
  //     })
  //   })
  //   this.notificationToTickAsRead = new Set<string>()
  //
  // }

  tickNotification(checked: boolean, notificationID: string) {
    if (checked) {
      this.notificationToTickAsRead.add(notificationID)
    } else {
      this.notificationToTickAsRead.delete(notificationID)
    }
    console.log(this.notificationToTickAsRead);
  }
}
