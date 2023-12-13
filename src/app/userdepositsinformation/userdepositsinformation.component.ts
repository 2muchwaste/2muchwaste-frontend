import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserResponse} from "../models/userresponse";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";
import {UserInformationService} from "../services/userinformationservice";
import {AppConstants} from "../utils/constants";
import {DepositService} from "../services/backendcalls/depositservice";
import {Deposit} from "../models/deposit";
import {PageEvent} from "@angular/material/paginator";
import {TrashTypeManager} from "../models/trashtype";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-userdepositsinformation',
  templateUrl: './userdepositsinformation.component.html',
  styleUrls: ['./userdepositsinformation.component.scss']
})
export class UserdepositsinformationComponent implements OnInit, OnDestroy {

  public user!: UserResponse
  public userID!: string
  userDeposits!: Deposit[];
  lowValue: number = 0;
  highValue: number = 10;
  trashTypesManager: TrashTypeManager = new TrashTypeManager()
  subscriptionToNewNotification: Subscription

  constructor(
    private authorizationService: Authorizationservice,
    private userInfoService: UserInformationService,
    private depositService: DepositService,
  ) {
    this.subscriptionToNewNotification =
      this.userInfoService.userNewNotificationObservable.subscribe(userResponse => {
        this.setDeposits()
      })
  }

  ngOnInit(): void {
    console.log('UserDepositInformation enter OnInit');
    this.authorizationService.checkAuthDataORRedirect()
    // @ts-ignore
    this.userID = localStorage.getItem(AppConstants.lSUserID)
    this.setDeposits()
  }

  ngOnDestroy(): void {
    this.subscriptionToNewNotification.unsubscribe()
  }

  private setDeposits() {
    this.depositService.getDepositsFromUser(this.userID).subscribe({
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
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

}
