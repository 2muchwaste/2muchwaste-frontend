import {Component, Inject, OnInit} from '@angular/core';
import {User} from "../models/user";
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import * as turf from '@turf/turf'
import {Dumpster} from "../models/dumpster";
import {Feature, Point, Properties} from "@turf/turf";
import {AuthenticationService} from "../services/authenticationservice";
import {Observable, of} from "rxjs";
import {Deposit} from "../models/deposit";
import {CustomerService} from "../services/customerservice";

@Component({
  selector: 'app-customerhome',
  templateUrl: './customerhome.component.html',
  styleUrls: ['./customerhome.component.scss']
})
export class CustomerhomeComponent implements OnInit {

  public dumpsters: Dumpster[] = []
  public user!: User;
  public deposits!: Deposit[];
  public userObs!: Observable<User>;
  public depositsObs!: Observable<Deposit[]>

  constructor(
    private customerHomeDialog: MatDialog,
    private customerService: CustomerService,
    private authenticationService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    console.log("OnInit customerhome")
    this.authenticationService.checkAuthDataORRedirect()
    this.setUser()
    this.setDeposits()
    console.log("OnInit customerhome uscita")
  }

  setUser() {
    // @ts-ignore
    this.customerService.getCustomerByID(localStorage.getItem('UserID'))
      .pipe()
      .subscribe({
        next: (response) => {
          this.user = response
        },
        error: (error) => {
          console.log(error);
        }
      })
  }

  setDeposits(){
    // // @ts-ignore
    // this.userService.getLastMonthDepositByUserId(localStorage.getItem('UserID'))
    //   .pipe()
    //   .subscribe({
    //     next: (response) => {
    //       this.deposits = response
    //     },
    //     error: (error) => {
    //       console.log(error);
    //     }
    //   })
  }

  // fetchUserData(): Observable<any>{
  //   // @ts-ignore
  //   return this.userService.getCustomerByID(localStorage.getItem('UserID'))
  // }
  throwGarbage() {
    if ('geolocation' in navigator) {
      console.log('geolocation present')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let userPosition = turf.point(
            [position.coords.longitude, position.coords.latitude]
          )
          this.setDumpsters(userPosition);
        },
        (error) => this.positionNotFound(error)
      )
    } else {
      this.openPositionErrorDialog(
        "Sistema di geolocalizzazione non presente",
        "Non sono stati rilevati sistemi che permettono la geolocalizzazione del dispositivo"
      )
    }
  }

  private setDumpsters(userPosition: Feature<Point>) {
    // @ts-ignore
    // this.userService.getDumpsters(localStorage.getItem('tokenCustomer'))
    //   .pipe()
    //   .subscribe(
    //     {
    //       next: (response) => {
    //         this.dumpsters = (response.sort((d1, d2) => {
    //           let p1 = turf.point([d1.longitude, d1.latitude])
    //           let p2 = turf.point([d2.longitude, d2.latitude])
    //           return turf.distance(userPosition, p1) - turf.distance(userPosition, p2)
    //         }));
    //         console.log(this.dumpsters);
    //         this.customerHomeDialog.open(CustomerHomeThrowGarbageDialogComponent, {
    //           data: {
    //             dumpsters: this.dumpsters
    //           }
    //         })
    //       },
    //       error: (errorObject) => {
    //         console.log(errorObject)
    //       }
    //     }
    //   )
  }

  private positionNotFound(geoError: GeolocationPositionError) {
    // Error: Handle geolocation error here
    if (geoError.code == GeolocationPositionError.PERMISSION_DENIED)
      this.openPositionErrorDialog(
        "Accesso alla posizione negato",
        "È necessario fornire l'autorizzazione per utilizzare la posizione"
      )
    else
      this.openPositionErrorDialog(
        "Posizione non trovata",
        "Non è stato possibile rilevare la posizione"
      )

  }


  private openPositionErrorDialog(errorTitle: string, errorMessage: string) {
    this.customerHomeDialog.open(CustomerHomePositionErrorDialogComponent, {
      data: {
        errorTitle: errorTitle,
        errorMessage: errorMessage
      }
    })
  }

}

@Component({
  selector: 'app-customerhome-throw-garbage-dialog',
  templateUrl: './customerhome-throw-garbage-dialog.html'
})
export class CustomerHomeThrowGarbageDialogComponent {
  public dumpsters: Dumpster[]

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: any
  ) {
    this.dumpsters = injectedData.dumpsters
  }
}


@Component({
  selector: 'app-customerhome-position-error',
  templateUrl: './customerhome-position-error.html'
})
export class CustomerHomePositionErrorDialogComponent {

  public titleError: string
  public errorMessage: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: any,
  ) {
    this.titleError = injectedData.errorTitle
    this.errorMessage = injectedData.errorMessage
  }
}

