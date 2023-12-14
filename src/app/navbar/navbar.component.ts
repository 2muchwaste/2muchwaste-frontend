import {
  AfterViewInit,
  Component,
  ElementRef, HostListener, OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import {UserInformationService} from "../services/userinformationservice"
import {SocketService} from "../services/notificationsservice"
import {UserNotification} from "../models/UserNotification"
import {CustomerService} from "../services/backendcalls/customerservice"
import {Subscription} from "rxjs"
import {UserResponse} from "../models/userresponse"
import {LocalStorageService} from "../services/localstorageservice"

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {

  private CLASS_TAG = "NavbarComponent:"
  public notificationNotRead: UserNotification[] = []
  private subscriptionUserReadNotification: Subscription
  public isLogged = false
  private subscriptionUser: Subscription
  @ViewChild('navbarbutton') navbarButton!: ElementRef<HTMLElement>
  @ViewChild('collapsablePartNavbar') collapsableNavbar!: ElementRef

  constructor(
    public userInfoService: UserInformationService,
    private notificationService: SocketService,
    private customerService: CustomerService,
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
    let userIDStored = this.lStorageService.getUserID()
    // let userIDStored = this.userInfoService.user._id
    if (userIDStored && !this.userInfoService.user) this.restoreUser(userIDStored)
  }

  ngAfterViewInit() {
  }

  private restoreUser(userIDStored: string) {
    this.customerService.getCustomerByID(userIDStored).subscribe({
      next: (usrResponse) => {
        console.log(this.CLASS_TAG, " Inizio collegamento socket")
        console.log(this.CLASS_TAG, " usrResponse",usrResponse)
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

  private initializeUserAfterLogin(userResponse: UserResponse) {    this.lStorageService.setUserID(userResponse._id)
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
