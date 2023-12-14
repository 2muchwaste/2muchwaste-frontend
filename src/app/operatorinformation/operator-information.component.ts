import {Component, OnDestroy, OnInit} from '@angular/core'
import {UserResponse} from "../models/userresponse"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"
import {UserInformationService} from "../services/userinformationservice"
import {EmptyService} from "../services/backendcalls/emptyservice"
import {EMpty} from "../models/empty"
import {PageEvent} from "@angular/material/paginator"
import {TrashTypeManager} from "../models/trashtype"
import {Subscription} from "rxjs"
import {LocalStorageService} from "../services/localstorageservice"

@Component({
  selector: 'app-operator-information',
  templateUrl: './operator-information.component.html',
  styleUrls: ['./operator-information.component.scss']
})
export class OperatorInformationComponent implements OnInit, OnDestroy {

  public user!: UserResponse
  userEMptied!: Empty[]
  lowValue: number = 0
  highValue: number = 10
  trashTypesManager: TrashTypeManager = new TrashTypeManager()
  subscriptionToNewNotification: Subscription

  constructor(
    private authorizationService: Authorizationservice,
    private userInfoService: UserInformationService,
    private emptyService: EmptyService,
    private lStorageService: LocalStorageService
  ) {
    this.subscriptionToNewNotification =
      this.userInfoService.userNewNotificationObservable.subscribe(userResponse => {
        this.setEmptied()
      })
  }

  ngOnInit(): void {
    console.log('OperatorInformation enter OnInit')
    this.authorizationService.checkAuthDataORRedirect()
    this.setEmptied()
  }

  ngOnDestroy(): void {
    this.subscriptionToNewNotification.unsubscribe()
  }

  private setEmptied() {
    // @ts-ignore
    this.emptyService.getEmptiedFromUser(this.lStorageService.getUserID()).subscribe({
      next: res => {
        this.userEMptied = this.userInfoService.userEmptied
          = res.map(empty => {
          empty.date = new Date(empty.date)
          return empty
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
