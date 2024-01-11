import {Injectable} from "@angular/core"
import {UserResponse} from "../models/userresponse"
import {Deposit} from "../models/deposit"
import {Empty} from "../models/empty"
import {Subject} from "rxjs"
import {UserNotification} from "../models/UserNotification"
import {Dumpster} from "../models/dumpster"
import {Payment} from "../models/payment"
import {LocalStorageService} from "./localstorageservice"
import {OperatorService} from "./backendcalls/operatorservice"


@Injectable({
  providedIn: "root"
})
export class UserInformationService {
  private SERVICE_TAG = 'UserInformationService:'
  public user!: UserResponse
  public userDeposits!: Deposit[]
  public userEmpty!: Empty[]
  payments!: Payment[]
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

  private newNearestDumpster = new Subject<{ dumpster: Dumpster, distance: number }[]>()
  newNearestDumpsterObservable = this.newNearestDumpster.asObservable()

  constructor(
    private lStorageService: LocalStorageService,
    private operatorService: OperatorService
  ) {
  }

  public logout() {
    this.logged = false
    this.lStorageService.clearLocalStorage()
    // @ts-ignore
    this.payments = undefined
    // @ts-ignore
    this.userDeposits = undefined
    // @ts-ignore
    this.userEmpty = undefined
    // @ts-ignore
    this.user = undefined
    // @ts-ignore
    this.nearestDumpsters = undefined
  }

  public login(userResponse: UserResponse, userToken: string) {
    this.lStorageService.setUserToken(userToken)
    this.lStorageService.setUserID(userResponse._id)
    console.log(userResponse)
    this.lStorageService.setUserObject(userResponse)
    console.log(this.SERVICE_TAG, 'login2023_11_24_01 called, userResponse:', userResponse)
    userResponse.notifications = []
    userResponse.notifications = this.getSortedNotificationsByData(userResponse.notifications)
    this.user = userResponse
    this.logged = true
    this.userLoggedIn.next(this.user)
  }

  public getUser() {
    return this.user
  }

  public isLogged() {
    return this.logged
  }

  readNotifications(userWithNewNotifications: UserResponse) {
    console.log(this.SERVICE_TAG, "this.readNotifications(), userWithReadNotifications ", userWithNewNotifications)
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

  addNotification(userWithNewNotification: UserResponse) {
    console.log(this.SERVICE_TAG, "this.addNotification2023_11_24_01, newNotificationuserWithReadNotifications ", userWithNewNotification)
    this.user = userWithNewNotification
    this.user.notifications = this.getSortedNotificationsByData(this.user.notifications)
    this.userNewNotificationSubject.next(this.user)
  }

  setUser(userResponse: UserResponse) {
    userResponse.notifications = this.getSortedNotificationsByData(userResponse.notifications)
    this.user = userResponse
    this.logged = true
    this.newUserSet.next(this.user)
  }

  setNearestDumpsters(dumpAndD: { dumpster: Dumpster, distance: number }[]) {
    this.nearestDumpsters = dumpAndD
    this.newNearestDumpster.next(dumpAndD)
  }

  getNotifications() {
    this.user.notifications = this.getSortedNotificationsByData(this.user.notifications)
    return this.user.notifications
  }

  getNotReadNotifications() {
    return this.getNotifications().filter(noti => !noti.read)
  }
}
