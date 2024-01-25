import {Component, OnDestroy, OnInit} from '@angular/core'
import {UserResponse} from "../models/userresponse"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"
import {OperatorInformationService} from "../services/operatorinformationservice"
import {UserInformationService} from "../services/userinformationservice"
import {OperatorService} from "../services/backendcalls/operatorservice"
import {Empty} from "../models/empty"
import {PageEvent} from "@angular/material/paginator"
import {TrashTypeManager} from "../models/trashtype"
import {Subscription} from "rxjs"
import {LocalStorageService} from "../services/localstorageservice"
import {OperatorDumpsterService} from "../services/middleware/operatordumpsterservice";

@Component({
  selector: 'app-operator-information',
  templateUrl: './operator-information.component.html',
  styleUrls: ['./operator-information.component.scss']
})
export class OperatorInformationComponent implements OnInit, OnDestroy {
  private CLASS_TAG = "OperatorInformationComponent"
  public user!: UserResponse
  userEmpties!: Empty[]
  lowValue: number = 0
  highValue: number = 10
  trashTypesManager: TrashTypeManager = new TrashTypeManager()
  subscriptionToNewNotification: Subscription

  constructor(
    private authorizationService: Authorizationservice,
    private userInfoService: UserInformationService,
    private operatorDumpsterService: OperatorDumpsterService,
    private operatorInfoService: OperatorInformationService,
    private lStorageService: LocalStorageService
  ) {
    this.subscriptionToNewNotification =
      this.userInfoService.userNewNotificationObservable.subscribe(userResponse => {
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
    this.operatorDumpsterService.getEmptiesWithSpecificDumpsterByCF(this.lStorageService.getUserCF()).subscribe({
      next: (res) => {
        this.userEmpties = this.userInfoService.userEmpties = res
        console.log(this.CLASS_TAG + ": res", res)
      }
    })
  }

  public getPaginatorData(event: any): any {
    this.lowValue = event.pageIndex * event.pageSize
    this.highValue = this.lowValue + event.pageSize
    return event
  }

}
