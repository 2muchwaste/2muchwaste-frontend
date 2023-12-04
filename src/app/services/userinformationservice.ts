import {Injectable} from "@angular/core";
import {UserResponse} from "../models/userresponse";
import {Deposit} from "../models/deposit";
import {CustomerService} from "./backendcalls/customerservice";
import {Subject} from "rxjs";
import {AuthenticationService} from "./backendcalls/authenticationservice";
import {User} from "../models/user";
import {UserNotification} from "../models/UserNotification";
import {Dumpster} from "../models/dumpster";
import {Payment} from "../models/payment";

@Injectable({
  providedIn: "root"
})
export class UserInformationService {
  private SERVICE_TAG = 'UserInformationService:'
  public user!: UserResponse
  public userDeposits!: Deposit[]
  payments!: Payment[];
  public logged = false
  public nearestDumpsters!: { dumpster: Dumpster, distance: number }[]

  private userLoggedIn = new Subject<UserResponse>()
  userLoggedInObservable = this.userLoggedIn.asObservable()

  private newUserSet = new Subject<UserResponse>()
  userSetObservable = this.newUserSet.asObservable()

  private userNewNotificationSubject = new Subject<UserResponse>()
  userNewNotificationObservable = this.userNewNotificationSubject.asObservable()

  private userReadNotification = new Subject<UserResponse>()
  userReadNotificationObservable = this.userReadNotification.asObservable()

  private newNearestDumpster = new Subject<{ dumpster: Dumpster, distance: number }[]>();
  newNearestDumpsterObservable = this.newNearestDumpster.asObservable()

  constructor() {
  }

  public logout() {
    this.logged = false
  }

  public updateUser(userResponse: UserResponse) {
    console.log(this.SERVICE_TAG, 'updating user');
    console.log(this.SERVICE_TAG, userResponse);
    this.user = userResponse
    this.logged = true
    // this.user.notifications.map(noti => {
    //   noti.date = new Date(noti.date)
    //   return noti
    // })
    this.user.notifications = this.user.notifications
      .map(noti => {
        noti.date = new Date(noti.date)
        return noti
      })
      .sort((noti1, noti2) => noti2.date.getTime() - noti1.date.getTime())

    console.log(this.SERVICE_TAG, 'calling next(userResponse)');
    this.userLoggedIn.next(userResponse)
  }

  public login(userResponse: UserResponse) {
    console.log(this.SERVICE_TAG, 'login called');
    console.log(this.SERVICE_TAG, userResponse);
    this.user = userResponse
    this.logged = true
    this.user.notifications = this.user.notifications.map(noti => {
      noti.date = new Date(noti.date)
      return noti
    }).sort((noti1, noti2) => noti2.date.getTime() - noti1.date.getTime())
    // this.updateUser(userResponse)
    // this.user = userResponse
    // this.userLoggedIn.next(userResponse)
  }

  public login2023_11_24_01(userResponse: UserResponse) {
    console.log(this.SERVICE_TAG, 'login2023_11_24_01 called, userResponse:', userResponse);
    userResponse.notifications = this.getSortedNotificationsByData(userResponse.notifications)
    this.user = userResponse
    this.logged = true
    this.userLoggedIn.next(this.user)
  }


  public addNotification(newNotification: UserNotification) {
    this.user.notifications.unshift(newNotification)
    this.userNewNotificationSubject.next(this.user)
  }

  public getUser() {
    return this.user
  }


  public isLogged() {
    return this.logged
  }

  readNotifications(userWithNewNotifications: UserResponse) {
    console.log(this.SERVICE_TAG, "this.readNotifications(), userWithReadNotifications ", userWithNewNotifications);
    userWithNewNotifications.notifications = this.getSortedNotificationsByData(userWithNewNotifications.notifications)
    this.user = userWithNewNotifications
    this.userReadNotification.next(userWithNewNotifications)
  }

  private getSortedNotificationsByData(userNotifications: UserNotification[]) {
    return userNotifications
      .map(noti => {
        noti.date = new Date(noti.date)
        return noti
      })
      .sort((noti1, noti2) =>
        noti2.date.getTime() - noti1.date.getTime())
  }

  addNotification2023_11_24_01(userWithNewNotification: UserResponse) {
    console.log(this.SERVICE_TAG, "this.addNotification2023_11_24_01, newNotificationuserWithReadNotifications ", userWithNewNotification);
    // this.user.notifications.unshift(userWithNewNotification)
    this.user = userWithNewNotification
    this.user.notifications = this.getSortedNotificationsByData(this.user.notifications)
    this.userNewNotificationSubject.next(this.user)
  }

  setUser2023_11_24_01(userResponse: UserResponse) {
    userResponse.notifications = this.getSortedNotificationsByData(userResponse.notifications)
    this.user = userResponse
    this.newUserSet.next(this.user)
  }

  setNearestDumpsters(dumpAndD: {dumpster: Dumpster,distance:number}[]) {
    this.nearestDumpsters = dumpAndD
    this.newNearestDumpster.next(dumpAndD)
  }

  // getBirthday(){
  //   let birthday = new Date(this.user.birthday).
  // }

  getNotifications() {
    this.user.notifications = this.getSortedNotificationsByData(this.user.notifications)
    return this.user.notifications
  }

  getNotReadNotifications() {
    return this.getNotifications().filter(noti => !noti.read)
  }
}
