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
import {WebsiteRole} from "../models/role";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  public user: any
  private CLASS_TAG = "NavbarComponent:"
  public notificationNotRead: UserNotification[] = []
  private subscriptionUserReadNotification: Subscription
  public isLogged = false
  private subscriptionUser: Subscription
  readonly WebsiteRole = WebsiteRole
  @ViewChild('navbarbutton') navbarButton!: ElementRef<HTMLElement>
  @ViewChild('collapsablePartNavbar') collapsableNavbar!: ElementRef

  constructor(
    public userInfoService: UserInformationService,
    public operatorInfoService: OperatorInformationService,
    private notificationService: SocketService,
    private customerService: CustomerService,
    private operatorService: OperatorService,
    private eRef: ElementRef,
    private lStorageService: LocalStorageService
  ) {
    this.subscriptionUser = this.userInfoService.userLoggedInObservable.subscribe(userResponse => {
      this.initializeUserAfterLogin(userResponse)
    })

    // Quando arriva una nuova notifica bisogna aggiornare l'array inerente della navbar
    this.subscriptionUserReadNotification = this.userInfoService.userReadNotificationObservable.subscribe(userResponse => {
      console.log(this.CLASS_TAG, "userReadNotificationObservable.subscribe, user arrived, OLD this.notificationNotRead: ", this.notificationNotRead)
      this.notificationNotRead = userResponse.notifications.filter(noti => !noti.read)
      console.log(this.CLASS_TAG, "userReadNotificationObservable.subscribe, this.notificationNotRead", this.notificationNotRead)
    })
  }

  ngOnInit() {
    console.log(this.lStorageService.getUserObject())
    const role = this.lStorageService.getUserObject().role
    console.log(role)
    if (role === 'customer') {
      let userIDStored = this.lStorageService.getUserID()
      if (userIDStored && !this.userInfoService.user) this.restoreUser(userIDStored)
    } else if (role === 'operator') {
      let operatorIDStored = this.lStorageService.getUserID()
      // let userIDStored = this.userInfoService.user._id
      if (operatorIDStored && !this.userInfoService.user && this.lStorageService.getUserRole() === WebsiteRole.OPERATOR) this.restoreOperator(operatorIDStored)

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
        this.notificationNotRead = this.userInfoService.getNotReadNotifications()
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
        this.operatorInfoService.setUser(operatorResponse)
        this.notificationNotRead = this.userInfoService.getNotReadNotifications()
        this.isLogged = true
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  private initializeUserAfterLogin(userResponse: UserResponse) {
    this.lStorageService.setUserID(userResponse._id)
    this.lStorageService.setUserObject(userResponse)
    console.log(this.CLASS_TAG, " Inizio collegamento socket")
    this.initializeSocketNotifications(userResponse)
    this.isLogged = true
    this.notificationNotRead = this.userInfoService.getNotReadNotifications()

  }

  private initializeSocketNotifications(userResponse: UserResponse) {
    this.notificationService.listen(userResponse._id).subscribe({
      next: (newNotification) => {
        this.userInfoService.addNotification(newNotification)
        this.notificationNotRead = this.userInfoService.getNotReadNotifications()
      }
    })
  }

  performBurgerButtonClick() {
    let el: HTMLElement = this.navbarButton.nativeElement
    el.click()
  }

  ngOnDestroy(): void {
    this.subscriptionUserReadNotification.unsubscribe()
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
