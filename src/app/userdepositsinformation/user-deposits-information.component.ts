import {Component, OnDestroy, OnInit} from '@angular/core'
import {UserResponse} from "../models/userresponse"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"
import {UserInformationService} from "../services/userinformationservice"
import {DepositService} from "../services/backendcalls/depositservice"
import {Deposit} from "../models/deposit"
import {PageEvent} from "@angular/material/paginator"
import {TrashTypeManager} from "../models/trashtype"
import {Subscription} from "rxjs"
import {LocalStorageService} from "../services/localstorageservice"

@Component({
  selector: 'app-user-deposits-information',
  templateUrl: './user-deposits-information.component.html',
  styleUrls: ['./user-deposits-information.component.scss']
})
export class UserDepositsInformationComponent implements OnInit, OnDestroy {

  public user!: UserResponse
  userDeposits!: Deposit[]
  lowValue: number = 0
  highValue: number = 10
  trashTypesManager: TrashTypeManager = new TrashTypeManager()
  subscriptionToNewNotification: Subscription

  constructor(
    private authorizationService: Authorizationservice,
    private userInfoService: UserInformationService,
    private depositService: DepositService,
    private lStorageService: LocalStorageService
  ) {
    this.subscriptionToNewNotification =
      this.userInfoService.userNewNotificationObservable.subscribe(userResponse => {
        this.setDeposits()
      })
  }

  ngOnInit(): void {
    console.log('UserDepositInformation enter OnInit')
    this.authorizationService.checkAuthDataORRedirect()
    this.setDeposits()
  }

  ngOnDestroy(): void {
    this.subscriptionToNewNotification.unsubscribe()
  }

  private setDeposits() {
    // @ts-ignore
    this.depositService.getDepositsFromUser(this.lStorageService.getUserID()).subscribe({
      next: res => {
        this.userDeposits = this.userInfoService.userDeposits
          = res.map(deposit => {
          deposit.date = new Date(deposit.date)
          return deposit
        }).reverse()
      },
      error: err => console.log(err)
    })
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize
    this.highValue = this.lowValue + event.pageSize
    return event
  }

}
