import {Injectable} from "@angular/core"
import {OperatorResponse} from "../models/operatorresponse"
import {Empty} from "../models/empty"
import {Subject} from "rxjs"
import {UserNotification} from "../models/UserNotification"
import {OperatorNotification} from "../models/operatornotification"
import {Dumpster} from "../models/dumpster"
import {LocalStorageService} from "./localstorageservice"
import {OperatorService} from "./backendcalls/operatorservice"
import {RoleService} from "./backendcalls/roleservice"


@Injectable({
  providedIn: "root"
})
export class OperatorInformationService {
  private SERVICE_TAG = 'OperatorInformationService:'
  public operator!: OperatorResponse
  public userEmpties!: Empty[]
  public operatorNotifications!: OperatorNotification[]
  public logged = false
  public nearestDumpsters!: { dumpster: Dumpster, distance: number }[]

  private userLoggedIn = new Subject<OperatorResponse>()
  userLoggedInObservable = this.userLoggedIn.asObservable()

  private newUserSet = new Subject<OperatorResponse>()
  userSetObservable = this.newUserSet.asObservable()

  private userNewNotificationSubject = new Subject<OperatorResponse>()
  userNewNotificationObservable = this.userNewNotificationSubject.asObservable()

  private userReadNotification = new Subject<OperatorResponse>()
  userReadNotificationObservable = this.userReadNotification.asObservable()

  private newNearestDumpster = new Subject<{ dumpster: Dumpster, distance: number }[]>()
  newNearestDumpsterObservable = this.newNearestDumpster.asObservable()

  constructor(
    private lStorageService: LocalStorageService,
    private roleService: RoleService,
    private operatorService: OperatorService
  ) {
  }

  public logout() {
    this.logged = false
    this.lStorageService.clearLocalStorage()
    // @ts-ignore
    this.userEmpties = undefined
    // @ts-ignore
    this.user = undefined
    // @ts-ignore
    this.nearestDumpsters = undefined
  }

  public login(operatorResponse: OperatorResponse, userToken: string) {
    this.lStorageService.setUserToken(userToken)
    this.lStorageService.setUserID(operatorResponse._id)
    console.log(operatorResponse)
    this.lStorageService.setUserObject(operatorResponse)
    console.log(this.SERVICE_TAG, 'login2023_11_24_01 called, operatorResponse:', operatorResponse)
    operatorResponse.notifications = []
    operatorResponse.notifications = this.getSortedNotificationsByData(operatorResponse.notifications)
    this.operator = operatorResponse
    this.logged = true
    this.userLoggedIn.next(this.operator)
  }

  public getUser() {
    return this.operator
  }

  public isLogged() {
    return this.logged
  }

  readNotifications(userWithNewNotifications: OperatorResponse) {
    console.log(this.SERVICE_TAG, "this.readNotifications(), userWithReadNotifications ", userWithNewNotifications)
    userWithNewNotifications.notifications = this.getSortedNotificationsByData(userWithNewNotifications.notifications)
    this.operator = userWithNewNotifications
    this.userReadNotification.next(userWithNewNotifications)
  }

  private getSortedNotificationsByData(userNotifications: OperatorNotification[]) {
    return userNotifications
      .map(noti => {
        noti.date = new Date(noti.date)
        return noti
      })
      .sort((noti1, noti2) =>
        noti2.date.getTime() - noti1.date.getTime())
  }

  addNotification(userWithNewNotification: OperatorResponse) {
    console.log(this.SERVICE_TAG, "this.addNotification2023_11_24_01, newNotificationuserWithReadNotifications ", userWithNewNotification)
    this.operator = userWithNewNotification
    this.operator.notifications = this.getSortedNotificationsByData(this.operator.notifications)
    this.userNewNotificationSubject.next(this.operator)
  }

  setUser(operatorResponse: OperatorResponse) {
    operatorResponse.notifications = this.getSortedNotificationsByData(operatorResponse.notifications)
    this.operator = operatorResponse
    this.logged = true
    this.newUserSet.next(this.operator)
  }

  setNearestDumpsters(dumpAndD: { dumpster: Dumpster, distance: number }[]) {
    this.nearestDumpsters = dumpAndD
    this.newNearestDumpster.next(dumpAndD)
  }

  getNotifications() {
    this.operator.notifications = this.getSortedNotificationsByData(this.operator.notifications)
    return this.operator.notifications
  }

  getNotReadNotifications() {
    return this.getNotifications().filter(noti => !noti.read)
  }
}
