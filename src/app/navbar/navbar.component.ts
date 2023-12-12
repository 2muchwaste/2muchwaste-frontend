import {
  AfterViewInit,
  Component,
  ElementRef, HostListener, OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {UserInformationService} from "../services/userinformationservice";
import {SocketService} from "../services/notificationsservice";
import {UserNotification} from "../models/UserNotification";
import {AppConstants} from "../utils/constants";
import {CustomerService} from "../services/backendcalls/customerservice";
import {Subscription} from "rxjs";
import {UserResponse} from "../models/userresponse";

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
    private eRef: ElementRef
  ) {
    this.subscriptionUser = this.userInfoService.userLoggedInObservable.subscribe(userResponse => {
      this.initializeUserAfterLogin2023_11_24_01(userResponse)
    })

    // Quando arriva una nuova notifica bisogna aggiornare l'array inerente della navbar
    this.subscriptionUserReadNotification = this.userInfoService.userReadNotificationObservable.subscribe(userResponse => {
      console.log(this.CLASS_TAG, "userReadNotificationObservable.subscribe, user arrived, OLD this.notificationNotRead: ", this.notificationNotRead);
      this.notificationNotRead = userResponse.notifications.filter(noti => !noti.read)
      console.log(this.CLASS_TAG, "userReadNotificationObservable.subscribe, this.notificationNotRead", this.notificationNotRead);
    })
  }


  ngOnInit() {
    let userIDStored = localStorage.getItem(AppConstants.lSUserID)
    if (userIDStored && !this.userInfoService.user) this.restoreUser2023_11_24_01(userIDStored)
  }

  ngAfterViewInit() {
  }

  private restoreUser2023_11_24_01(userIDStored: string) {
    this.customerService.getCustomerByID(userIDStored).subscribe({
      next: (usrResponser) => {

        localStorage.setItem(AppConstants.userObject, JSON.stringify(usrResponser))
        localStorage.setItem(AppConstants.lSUserID, usrResponser._id)

        console.log(this.CLASS_TAG, " Inizio collegamento socket")
        this.initializeSocketNotifications(usrResponser)
        this.userInfoService.setUser(usrResponser)
        this.notificationNotRead = this.userInfoService.getNotReadNotifications()
        this.isLogged = true
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  private initializeUserAfterLogin2023_11_24_01(userResponse: UserResponse) {

    localStorage.setItem(AppConstants.userObject, JSON.stringify(userResponse))
    localStorage.setItem(AppConstants.lSUserID, userResponse._id)
    console.log(this.CLASS_TAG, " Inizio collegamento socket")
    this.initializeSocketNotifications(userResponse);
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
    localStorage.removeItem(AppConstants.lSUserID)
    localStorage.removeItem(AppConstants.lSuserRole)
    localStorage.removeItem(AppConstants.lSToken)
    localStorage.removeItem('userObject')
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target) && this.collapsableNavbar.nativeElement.classList.contains('show')) {
      this.performBurgerButtonClick()
    }
  }
}
