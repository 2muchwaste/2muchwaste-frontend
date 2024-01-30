import {
  AfterViewInit,
  Component,
  ElementRef, HostListener, OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import {UserInformationService} from "../services/userinformationservice"
import {OperatorInformationService} from "../services/operatorinformationservice"
import {SocketService} from "../services/notificationsservice"
import {UserNotification} from "../models/UserNotification"
import {CustomerService} from "../services/backendcalls/customerservice"
import {OperatorService} from "../services/backendcalls/operatorservice"
import {Subscription} from "rxjs"
import {UserResponse} from "../models/userresponse"
import {LocalStorageService} from "../services/localstorageservice"
import {OperatorNotificationAndDumpster} from "../models/operatornotification";
import {OperatorNotificationService} from "../services/backendcalls/operatornotificationservice";
import {RoleService} from "../services/backendcalls/roleservice";
import {DumpsterService} from "../services/backendcalls/dumpsterservice";
import {NotificationDumpsterService} from "../services/middleware/notificationdumpsterservice";
import {DumpsterErrorTypeManager} from "../models/dumpstererrortype";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  public user: any
  private CLASS_TAG = "NavbarComponent:"
  public customerNotificationNotRead: UserNotification[] = []
  public operatorNotificationNotRead: OperatorNotificationAndDumpster[] = []
  private subscriptionUserReadNotification: Subscription
  public isLogged = false
  public readonly dumpsterErrorTypeManager = new DumpsterErrorTypeManager();
  private subscriptionUser: Subscription
  @ViewChild('navbarbutton') navbarButton!: ElementRef<HTMLElement>
  @ViewChild('collapsablePartNavbar') collapsableNavbar!: ElementRef

  constructor(
    public userInfoService: UserInformationService,
    private notificationService: SocketService,
    private customerService: CustomerService,
    private operatorService: OperatorService,
    private eRef: ElementRef,
    private lStorageService: LocalStorageService,
    public roleService: RoleService,
    private dumpsterService: DumpsterService,
    private notificationDumpsterService:NotificationDumpsterService,
  ) {


    this.subscriptionUser = this.userInfoService.userLoggedInObservable.subscribe(userResponse => {
      console.log(this.CLASS_TAG + ": AAAAAuserResponse", userResponse)
      if (userResponse.role === this.roleService.getCustomerCode()) this.initializeUserAfterLogin(userResponse)
      else if (userResponse.role === this.roleService.getOperatorCode()) this.initializeOperatorAfterLogin(userResponse)
    })

    // Quando arriva una nuova notifica bisogna aggiornare l'array inerente della navbar
    this.subscriptionUserReadNotification = this.userInfoService.userReadNotificationObservable.subscribe(userResponse => {
      console.log(this.CLASS_TAG, "userReadNotificationObservable.subscribe, user arrived, OLD this.notificationNotRead: ", this.customerNotificationNotRead)
      this.customerNotificationNotRead = userResponse.notifications.filter(noti => !noti.read)
      console.log(this.CLASS_TAG, "userReadNotificationObservable.subscribe, this.notificationNotRead", this.customerNotificationNotRead)
    })
  }

  ngOnInit() {
    const user = this.lStorageService.getUserObject()
    console.log(this.CLASS_TAG + ": ABBAuser", user)
    console.log(this.CLASS_TAG + ": ABBAthis.roleService.getCustomerCode()", this.roleService.getCustomerCode())
    if (user && user.role === this.roleService.getCustomerCode()) {
      let userIDStored = this.lStorageService.getUserID()
      if (userIDStored && !this.userInfoService.user) this.restoreUser(userIDStored)
    } else if (user && user.role === this.roleService.getOperatorCode()) {
      let operatorIDStored = this.lStorageService.getUserID()
      // let userIDStored = this.userInfoService.user._id
      if (operatorIDStored && !this.userInfoService.user && this.lStorageService.getUserRoleName() === this.roleService.getOperatorName()) this.restoreOperator(operatorIDStored)

    }
  }

  ngAfterViewInit() {

  }

  private restoreUser(userIDStored: string) {
    this.customerService.getCustomerByID(userIDStored).subscribe({
      next: (usrResponse) => {
        console.log(this.CLASS_TAG, " Inizio collegamento socket")
        console.log(this.CLASS_TAG, " customerResponse", usrResponse)
        this.user = usrResponse
        this.initializeSocketNotifications(usrResponse)
        this.userInfoService.setUser(usrResponse)
        this.customerNotificationNotRead = this.userInfoService.getNotReadNotifications()
        this.isLogged = true
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  private restoreOperator(operatorIDStored: string) {
    this.operatorService.getOperatorByID(operatorIDStored).subscribe({
      next: (operatorResponse) => {
        console.log(this.CLASS_TAG, " Inizio collegamento socket")
        console.log(this.CLASS_TAG, " operatorResponse", operatorResponse)
        this.user = operatorResponse
        this.initializeSocketNotifications(operatorResponse)
        this.setOperatorNotifications()
        // usare direttamente user info service
        this.userInfoService.setUser(operatorResponse)
        this.isLogged = true
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  private initializeUserAfterLogin(userResponse: UserResponse) {
    this.customerService.getCustomerByID(userResponse._id).subscribe({
      next: (res) => {
        userResponse.notifications = res.notifications
        this.lStorageService.setUserID(userResponse._id)
        this.lStorageService.setUserObject(userResponse)
        console.log(this.CLASS_TAG, " Inizio collegamento socket")
        this.initializeSocketNotifications(userResponse)
        this.isLogged = true
        this.customerNotificationNotRead = this.userInfoService.getNotReadNotifications()
      }
    })
  }

  private initializeOperatorAfterLogin(userResponse: UserResponse) {
    this.lStorageService.setUserID(userResponse._id)
    this.lStorageService.setUserObject(userResponse)
    console.log(this.CLASS_TAG, " Inizio collegamento socket")
    this.initializeSocketNotifications(userResponse)
    this.setOperatorNotifications()
    this.isLogged = true
  }

  private initializeSocketNotifications(userResponse: UserResponse) {
    this.notificationService.listen(userResponse._id).subscribe({
      next: (newNotification) => {
        this.userInfoService.addNotification(newNotification)
        this.customerNotificationNotRead = this.userInfoService.getNotReadNotifications()
      }
    })
  }

  private setOperatorNotifications() {
    this.notificationDumpsterService.getInformativeOperatorNotifications().subscribe({
      next:(res)=>{
        this.userInfoService.operatorNotifications = this.operatorNotificationNotRead = res
      }
    })
  }

  performBurgerButtonClick() {
    let el: HTMLElement = this.navbarButton.nativeElement
    el.click()
  }

  ngOnDestroy(): void {
    this.subscriptionUserReadNotification.unsubscribe()
    this.subscriptionUser.unsubscribe()
  }

  logout() {
    this.userInfoService.logout()
    this.isLogged = false
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target) && this.collapsableNavbar.nativeElement.classList.contains('show')) {
      this.performBurgerButtonClick()
    }
  }
}
