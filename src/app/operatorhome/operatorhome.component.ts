import {AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from "../models/user";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Dumpster} from "../models/dumpster";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";
import {Observable, Subscription} from "rxjs";
import {UserResponse, UserResponseBuilder} from "../models/userresponse";
import {AppConstants} from "../utils/constants";
import {DumpsterService} from "../services/backendcalls/dumpsterservice";
import * as gL from 'geolib'
import * as L from "leaflet";
import {TrashTypeManager} from "../models/trashtype";
import {PageEvent} from "@angular/material/paginator";


export interface Coordinates {
  coords: {
    latitude: number,
    longitude: number
  }
}

@Component({
  selector: 'app-operatorhome',
  templateUrl: './operatorhome.component.html',
  styleUrls: ['./operatorhome.component.scss']
})
export class OperatorhomeComponent implements OnInit, OnDestroy, AfterViewInit {

public dumpsters: Dumpster[] = []
  public user!: UserResponse
  public dump!: Dump[]
  public userObs!: Observable<User>
  public dumpObs!: Observable<Dump[]>
  private lastUserPosition!: Coordinates
  private map!: L.Map;
  private trashTypeManager
  isButtonsVisible: Boolean = false
  viewMapDumpsters = false
  showBorderMap = false;

  constructor(
    private operatorHomeDialog: MatDialog,
    private operatorService: OperatorService,
    private authorizationService: Authorizationservice,
    private dumpService: DumpService,
    public userInfoService: UserInformationService,
    private dumpsterService: DumpsterService,
  ) {
    this.trashTypeManager = new TrashTypeManager()
  }

  ngOnInit(): void {
    console.log("OnInit operatorhome")
    this.authorizationService.checkAuthDataORRedirect()
    this.user = this.userInfoService.user
    if (this.user == null)
      this.setUser()
    // console.log(this.user);
    this.setDump()
    console.log("OnInit operatorhome uscita")
  }


  ngAfterViewInit() {
  }

  private initMap(userPosition: Coordinates): void {
    let centroid: L.LatLngExpression = [
      this.lastUserPosition.coords.latitude,
      this.lastUserPosition.coords.longitude
    ]

    this.map = L.map('map', {
      center: centroid,
      zoom: 18
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 8,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    let userPositionIcon = L.icon({
      iconUrl: 'assets/icons/user-position-pic.png',

      iconSize: [38, 38], // size of the icon
      // shadowSize: [50, 64], // size of the shadow
      iconAnchor: [19, 19], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    this.userInfoService.nearestDumpsters.forEach(dump => {
      let elem = [dump.dumpster.latitude, dump.dumpster.longitude]

      L.marker(elem as L.LatLngExpression)
        .addTo(this.map)
        .bindPopup(
          `<p>${dump.dumpster.address}</p>
          <p>Tipo: ${this.trashTypeManager.getItalianName(dump.dumpster.type)}</p>
          <p>Distanza: ${(dump.distance * 1000).toFixed(2)}m</p>`
        )
    })

    L.marker(
      [userPosition.coords.latitude, userPosition.coords.longitude] as L.LatLngExpression,
      {icon: userPositionIcon}
    ).addTo(this.map)
      .bindPopup("La tua posizione")

    tiles.addTo(this.map)
    this.showBorderMap = true
  }


  printUser() {
    console.log(this.user);
  }

  setDumps() {
    // @ts-ignore
    this.dumpService.getDumpFromUser(localStorage.getItem(AppConstants.lSUserID))
      .subscribe({
        next: (res) => {
          let lastMonthDate = new Date()
          lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
          this.dumps = res
            .map(dump => {
              dump.date = new Date(dump.date)
              return dump
            })
            .filter(dump => dump.date > lastMonthDate)
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  private setDumpsters(userPosition: Coordinates) {
    this.dumpsterService.getDumpsters()
      .subscribe(
        {
          next: (response) => {
            this.computateNearestDumpsters(userPosition, response).subscribe({
              next: (res) => {
                this.userInfoService.setNearestDumpsters(res)
                this.lastUserPosition = userPosition
                // setTimeout(() => this.initMap(userPosition), 1000)
                // setTimeout(() => this.initMap(userPosition), 1000)
              }
            })
          },
          error: (errorObject) => {
            console.log(errorObject)
          }
        }
      )
  }

  closeMap() {
    console.log("Close map button clicked");
    this.viewMapDumpsters = false
  }


  private positionNotFound(geoError: GeolocationPositionError) {
    if (geoError.code == GeolocationPositionError.PERMISSION_DENIED)
      this.openDialog(
        "Accesso alla posizione negato",
        "È necessario fornire l'autorizzazione per utilizzare la posizione"
      )
    else
      this.openDialog(
        "Posizione non trovata",
        "Non è stato possibile rilevare la posizione"
      )

  }


  private openDialog(errorTitle: string, errorMessage: string) {
    return this.customerHomeDialog.open(CustomerHomeDialogComponent, {
      data: {
        errorTitle: errorTitle,
        errorMessage: errorMessage
      }
    })
  }

  private setUser() {
    // @ts-ignore
    this.operatorService.getOperatorByID(localStorage.getItem(AppConstants.lSUserID)).subscribe({
      next: (res) => {
        this.user = res
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private updateDialogg(dialog: MatDialogRef<OperatorHomeDialogComponent>, title: string, message: string) {
    dialog.componentInstance.title = title
    dialog.componentInstance.message = message
  }

  private updateDialog(dialog: MatDialog, seconds: number, title: string, message: number) {
    if (seconds > 0) {
      setTimeout(() => {
        this.updateDialog(dialog, seconds - 1, title, message)
        console.log("AAA");
      }, 1000)
      console.log("BBB");
    }
  }

  ngOnDestroy(): void {
    localStorage.setItem('acic', 'bonobo')

  }

  getNearDumpsters() {
    if ('geolocation' in navigator) {
      console.log('geolocation present')
      let nearestDumpstersDialog = this.operatorHomeDialog.open(OperatorHomeThrowGarbageDialogComponent)
      navigator.geolocation.getCurrentPosition(
        (position: Coordinates) => {
          console.log(position)
          this.setDumpsters(position)
          nearestDumpstersDialog.componentInstance.showMapEvent.subscribe({
            next: () => {
              nearestDumpstersDialog.close()
              this.viewMapDumpsters = true

              setTimeout(() => {
                this.initMap(position)
              }, 1000)
            }
          })
          // nearestDumpstersDialog.componentInstance.

          // nearestDumpstersDialog.afterClosed()
        },
        (error: any) => {
          this.positionNotFound(error)
          nearestDumpstersDialog.close()

        }
      )
    } else {
      this.openDialog(
        "Sistema di geolocalizzazione non presente",
        "Non sono stati rilevati sistemi che permettono la geolocalizzazione del dispositivo"
      )
    }

  }

  getDistanceFromTwoPoints(p1: Coordinates, p2: Coordinates) {
    var R = 6371; // Radius of the earth in km
    let lat1 = p1.coords.latitude
    let lon1 = p1.coords.longitude

    let lat2 = p2.coords.latitude
    let lon2 = p2.coords.longitude
    var distanceLatitudes = this.deg2rad(lat2 - lat1);  // deg2rad below
    var distanceLongitudes = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(distanceLatitudes / 2) * Math.sin(distanceLatitudes / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(distanceLongitudes / 2) * Math.sin(distanceLongitudes / 2)

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }

  computateNearestDumpsters(userPosition: Coordinates, response: Dumpster[]) {

    return new Observable<{ dumpster: Dumpster, distance: number }[]>(obs => {
      let dumpsterAndDistance: { dumpster: Dumpster, distance: number }[] = []
      response.sort((p1, p2) => {
        let x = {coords: {latitude: p1.latitude, longitude: p1.longitude}}
        let y = {coords: {latitude: p2.latitude, longitude: p2.longitude}}
        return this.getDistanceFromTwoPoints(userPosition, x) - this.getDistanceFromTwoPoints(userPosition, y)
      }).forEach(d => {
        dumpsterAndDistance.push({
          dumpster: d,
          distance: (this.getDistanceFromTwoPoints(userPosition, {
            coords: {
              latitude: d.latitude,
              longitude: d.longitude
            }
          }))
        })
      })
      // obs.next(this.userInfoService.setNearestDumpsters(dumpsterAndDistance))
      obs.next(dumpsterAndDistance)
    })
  }

}

@Component({
  selector: 'app-operatorhome-throw-garbage-dialog',
  templateUrl: './operatorhome-throw-garbage-dialog.html',
  styleUrls: ['./operatorhome.component.scss', './operatorhome-throw-garbage-dialog.scss']

})
export class OperatorHomeThrowGarbageDialogComponent {
  // public dumpsters: {dumpster: Dumpster,distance: number}[]

  @Output() showMapEvent = new EventEmitter<boolean>()
  public nearestDumpstersSet = false

  public newNearestDumpster: Subscription

  public showMap = false
  public lowValue
  public highValue
  public dumpsterForPage = 10
  // public functionShowMap:()=>{}

  // public distance: number

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: any,
    public userInfoService: UserInformationService,
  ) {
    // this.functionShowMap = injectedData.mapShowFunction
    console.log('here');
    this.newNearestDumpster = this.userInfoService.newNearestDumpsterObservable.subscribe(dumpsters => {
      this.nearestDumpstersSet = true
    })
    this.lowValue = 0
    this.highValue = 10
    // this.distance = injectedData.distance
  }

  showDumpstersOnMap() {
    this.showMap = true
    this.showMapEvent.emit(true)
    // this.functionShowMap()
  }

  getPaginatorData(event: PageEvent) {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  movePageDumpsters(number: number) {
    let newLowValue = this.lowValue + this.dumpsterForPage * number
    let newHighValue = this.highValue + this.dumpsterForPage * number

    this.lowValue = newLowValue <= 0 ? 0 : newLowValue
    this.highValue = newHighValue <= this.dumpsterForPage ? this.dumpsterForPage : newHighValue

  }
}


@Component({
  selector: 'app-operatorhome-position-error',
  templateUrl: './operatorhome-position-error.html',
  styleUrls: ['./operatorhome-position-error.scss', './operatorhome.component.scss']
})
export class OperatorHomeDialogComponent {

  public title: string
  public message: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: any,
  ) {
    this.title = injectedData.errorTitle
    this.message = injectedData.errorMessage
  }
}
