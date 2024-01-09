import {Component, OnDestroy, OnInit} from '@angular/core'
import {UserResponse} from "../models/userresponse"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"
import {OperatorInformationService} from "../services/operatorinformationservice"
import {EmptyService} from "../services/backendcalls/emptyservice"
import {Empty} from "../models/empty"
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
  userEmpty!: Empty[]
  lowValue: number = 0
  highValue: number = 10
  trashTypesManager: TrashTypeManager = new TrashTypeManager()
  subscriptionToNewNotification: Subscription

  constructor(
    private authorizationService: Authorizationservice,
    private operatorInfoService: OperatorInformationService,
    private emptyService: EmptyService,
    private lStorageService: LocalStorageService
  ) {
    this.subscriptionToNewNotification =
      this.operatorInfoService.userNewNotificationObservable.subscribe(userResponse => {
        this.setEmpty()
      })
  }

  ngOnInit(): void {
    console.log('OperatorInformation enter OnInit')
    this.authorizationService.checkAuthDataORRedirect()
    this.setEmpty()
  }

  ngOnDestroy(): void {
    this.subscriptionToNewNotification.unsubscribe()
  }

  private setEmpty() {
    // @ts-ignore
    this.emptyService.getEmptyFromUser(this.lStorageService.getUserID()).subscribe({
      next: res => {
        this.userEmpty = this.operatorInfoService.userEmpty
          = res.map(empty => {
          empty.date = new Date(empty.date)
          return empty
        }).reverse()
      },
      error: err => console.log(err)
    })
  }

  public getPaginatorData(event: any): any {
    this.lowValue = event.pageIndex * event.pageSize
    this.highValue = this.lowValue + event.pageSize
    return event
  }

}
