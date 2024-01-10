import { Component, Input, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {Subscription} from "rxjs"
import {UserInformationService} from "../services/userinformationservice"
import {OperatorInformationService} from "../services/operatorinformationservice"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"
import {EmptyService} from "../services/backendcalls/emptyservice"
import {OperatorService} from "../services/backendcalls/operatorservice"
import {UserResponse} from "../models/userresponse"
import {Empty} from "../models/empty"
import {Dumpster} from "../models/dumpster"

@Component({
  selector: 'app-empty-dumpster',
  templateUrl: './empty-dumpster.component.html',
  styleUrls: ['./empty-dumpster.component.scss']
})
export class EmptyDumpsterComponent implements OnInit{
  private userEmpty!: Empty[]
  private userSetSubscription!: Subscription
  @Input() weight: undefined | number;

  constructor(
    private authorizationService: Authorizationservice,
    public userInfoService: UserInformationService,
    private emptyService: EmptyService,
    private operatorService: OperatorService,
    private recyclingService: RecyclingService
    ) {
    }

  ngOnInit(): void {
      console.log('emptydumpster OnInit')
      this.authorizationService.checkAuthDataORRedirect()
   }


  emptydumpster() {
    this.recyclingService.emptyBin().subscribe(() => {
      this.weight = 0;
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class RecyclingService {
  private binWeight: number = 30; // Peso iniziale del bidone

  emptyBin(): Observable<void> {
  this.binWeight = 0;
      return of();
  }

  getBinWeight(): number {
    return this.binWeight;
  }
}
