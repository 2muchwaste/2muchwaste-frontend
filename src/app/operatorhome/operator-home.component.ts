import {AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Dumpster} from "../models/dumpster";
import {Empty} from "../models/empty";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";
import {Observable, Subscription} from "rxjs";
import {UserResponse} from "../models/userresponse";
import {DumpsterService} from "../services/backendcalls/dumpsterservice";
import {EmptyService} from "../services/backendcalls/emptyservice";
import {OperatorService} from "../services/backendcalls/operatorservice"
import {CreateDumpsterService} from '../services/middleware/createdumpsterservice';
import {OperatorInformationService} from "../services/operatorinformationservice";
import {UserInformationService} from "../services/userinformationservice";
import {LocalStorageService} from "../services/localstorageservice"
import {OperatorDumpsterService} from "../services/middleware/operatordumpsterservice";
import {User} from "../models/user";
import {Router} from "@angular/router";
import * as L from "leaflet";
import {TrashTypeManager} from "../models/trashtype";
import {PageEvent} from "@angular/material/paginator";
import {DialogYesNoComponent} from "../dialogs/DialogYesNo";
import {DumpsterUtils} from "../utils/dumpsterutils";
import {Dialog} from "../dialogs/Dialog";

export interface Coordinates {
  coords: {
    latitude: number,
    longitude: number
  }
}

@Component({
  selector: 'app-operator-home',
  templateUrl: './operator-home.component.html',
  styleUrls: ['./operator-home.component.scss']
})
export class OperatorHomeComponent implements OnInit, AfterViewInit {

  public dumpsters: Dumpster[] = []
  public user!: UserResponse
  public empties!: Empty[]
  public userObs!: Observable<User>
  public openForm: boolean = false
  private lastUserPosition!: Coordinates
  private map!: L.Map;
  private trashTypeManager
  isButtonsVisible: Boolean = false
  viewMapDumpsters = false
  showBorderMap = false
  private CLASS_TAG = "OperatorHomeComponent"
  private dumpsterUtils: DumpsterUtils;

  constructor(
    private dialog: MatDialog,
    private operatorDumpsterService: OperatorDumpsterService,
    private authorizationService: Authorizationservice,
    private emptyService: EmptyService,
    public operatorInfoService: OperatorInformationService,
    public userInfoService: UserInformationService,
    private dumpsterService: DumpsterService,
    private lStorageService: LocalStorageService
  ) {
    this.trashTypeManager = new TrashTypeManager()
    this.dumpsterUtils = new DumpsterUtils()
  }

  ngOnInit(): void {
    console.log("OnInit operatorhome")
    this.authorizationService.checkAuthDataORRedirect()
    this.user = this.userInfoService.user
    if (this.user == null)
      this.setUser()
    // @ts-ignore
    this.setEmpties()
    // console.log(this.user);
    console.log("OnInit operatorhome uscita")
  }

  ngAfterViewInit() {
  }

  private initMap(userPosition: Coordinates): void {
    let popupText: (dumpster: Dumpster, distance: number) => string = (dumpster, distance) => {
      return `
          <div class="row">
            <div class="col-12">
              <p>${dumpster.address}</p>
              <p>Tipo: ${this.trashTypeManager.getItalianName(dumpster.type)}</p>
              <p>Distanza: ${(distance * 1000).toFixed(2)}m</p>
              <p>${"Riempimento: " + this.dumpsterUtils.getUsagePercentage(dumpster).toFixed(2) + "%"}</p>
              <p>${"Limite: " + dumpster.limitUsablePercentage + "%"}</p>
              <p>${"Contenuto: " + dumpster.actualWeight + "Kg"}</p>
            </div>
           <div class="col-12" id="popupContent"></div>
          </div>
        `
    }

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
      iconAnchor: [19, 19], // point of the icon which will correspond to marker's location
    });

    this.userInfoService.nearestDumpsters.forEach(dump => {
      let elem = [dump.dumpster.latitude, dump.dumpster.longitude]
      let marker = L.marker(elem as L.LatLngExpression)
        .addTo(this.map)
        .bindPopup(popupText(dump.dumpster, dump.distance))

      marker.on('click', () => {
        const popupContent = document.getElementById('popupContent');
        if (popupContent) {
          console.log("PremutoPopup del bidone " + dump.dumpster._id);
          // Render your button inside the popup content
          popupContent.innerHTML = '<button class="col-12 application-button-primary empty-button-map" mat-raised-button color="primary" id="popupButton">Svuota</button>';

          // Add a click event listener to the button
          const popupButton = document.getElementById('popupButton');
          if (popupButton) {
            popupButton.addEventListener('click', () => {
              let dialog: Dialog = {
                title: 'Svuotamento',
                message: 'Sicurə di voler svuotare il bidone in ' + dump.dumpster.address + '?',
              }

              let finished = {finish: false}
              let newWeight = 0.0
              let dialogRef = this.dialog.open(DialogYesNoComponent, {
                data: {
                  content: dialog,
                  finished: finished,
                  positiveFunction: () => {
                    this.dumpsterService.setDumpsterWeight(dump.dumpster._id, newWeight).subscribe({
                      next: (res) => {
                        console.log(this.CLASS_TAG + ": res", res)
                        this.dumpsterService.setDumpsterAvailability(dump.dumpster._id, true).subscribe({
                          next: (res) => {
                            if (!res.hasOwnProperty('address')) {
                              dialog.message = `C'è stato un errore durante la procedura. Riprovare.`
                            } else {
                              dialog.message = `Svuotamento avvenuto con successo`
                              let dumpPopup: {
                                dumpster: Dumpster,
                                distance: number
                              } = this.userInfoService.nearestDumpsters.filter(dump2 => dump2.dumpster._id === dump.dumpster._id)
                                .map(d => {
                                  d.dumpster.actualWeight = newWeight
                                  return d
                                })[0]
                              marker.setPopupContent(popupText(dumpPopup.dumpster, dumpPopup.distance))
                              finished.finish = true
                            }
                          }
                        })
                      }
                    })
                  },
                },
              })
            });
          }
        }
      });

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

  setEmpties() {
    // @ts-ignore
    this.operatorDumpsterService.getEmptiesWithSpecificDumpsterByCF(this.lStorageService.getUserCF()).subscribe({
      next: (res) => {
        this.userInfoService.userEmpties = this.empties = res
      }
    })
  }

  emptyGarbage() {
    this.isButtonsVisible = !this.isButtonsVisible
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
    return this.dialog.open(OperatorHomeDialogComponent, {
      data: {
        title: errorTitle,
        message: errorMessage
      }
    })
  }

  private setUser() {
    // @ts-ignore
    this.operatorDumpsterService.getOperatorByID(this.lStorageService.getUserID()).subscribe({
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

  getNearDumpsters() {
    if ('geolocation' in navigator) {
      console.log('geolocation present')
      let nearestDumpstersDialog = this.dialog.open(OperatorHomeEmptyGarbageDialogComponent,{disableClose:true})
      navigator.geolocation.getCurrentPosition(
        (position: Coordinates) => {
          console.log(position)
          this.setDumpsters(position)
          if (!nearestDumpstersDialog.componentInstance) return
          nearestDumpstersDialog.componentInstance.showMapEvent.subscribe({
            next: () => {
              nearestDumpstersDialog.close()
              this.viewMapDumpsters = true

              setTimeout(() => {
                this.initMap(position)
              }, 1000)
            }
          })
          nearestDumpstersDialog.disableClose = false
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
      obs.next(dumpsterAndDistance)
    })
  }

}

/**
 *
 */
@Component({
  selector: 'app-operator-home-empty-garbage-dialog',
  templateUrl: './operator-home-empty-garbage-dialog.html',
  styleUrls: ['./operator-home.component.scss', './operator-home-empty-garbage-dialog.scss']

})
export class OperatorHomeEmptyGarbageDialogComponent {
  private readonly CLASS_TAG = "OperatorHomeEmptyGarbageDialogComponent"

  @Output() showMapEvent = new EventEmitter<boolean>()
  trashTypesManager: TrashTypeManager = new TrashTypeManager()
  dumpsterUtils: DumpsterUtils = new DumpsterUtils()

  public nearestDumpstersSet = false

  public newNearestDumpster: Subscription

  public showMap = false
  public lowValue
  public highValue
  public dumpsterForPage = 10

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: any,
    public userInfoService: UserInformationService,
    private dumpsterService: DumpsterService,
    public operatorDumpsterService: OperatorDumpsterService,
    private dialog: MatDialog,
    private operatorService: OperatorService,
  ) {
    console.log('here');
    this.newNearestDumpster = this.userInfoService.newNearestDumpsterObservable.subscribe(dumpsters => {
      this.nearestDumpstersSet = true
    })
    this.lowValue = 0
    this.highValue = 10
  }

  showDumpstersOnMap() {
    this.showMap = true
    this.showMapEvent.emit(true)
  }

  getPaginatorData(event: PageEvent) {
    this.lowValue = event.pageIndex * event.pageSize
    this.highValue = this.lowValue + event.pageSize
    return event
  }

  movePageDumpsters(number: number) {
    let newLowValue = this.lowValue + this.dumpsterForPage * number
    let newHighValue = this.highValue + this.dumpsterForPage * number

    this.lowValue = newLowValue <= 0 ? 0 : newLowValue
    this.highValue = newHighValue <= this.dumpsterForPage ? this.dumpsterForPage : newHighValue

  }

  emptyDumpster(dump: { dumpster: Dumpster; distance: number }) {
    let dialog: Dialog = {
      title: 'Svuotamento',
      message: 'Sicurə di voler svuotare il bidone in ' + dump.dumpster.address + '?',
    }
    let finished = {finish: false}
    this.dialog.open(DialogYesNoComponent, {
      data: {
        content: dialog,
        finished: finished,
        positiveFunction: () => {

          this.operatorService.addEmptyToOperator(this.userInfoService.user.cf, dump.dumpster._id).subscribe({
            next: (dumpsterReturned) => {
              if (!dumpsterReturned.hasOwnProperty('address')) {
                dialog.message = `C'è stato un errore durante la procedura. Riprovare.`
              } else {
                this.dumpsterService.setDumpsterAvailability(dump.dumpster._id, true).subscribe({
                  next: (res) => {
                    dialog.message = `Svuotamento avvenuto con successo`
                    this.userInfoService.nearestDumpsters.filter(dump2 => dump2.dumpster._id === dump.dumpster._id)
                      .map(d => d.dumpster.actualWeight = dumpsterReturned.actualWeight)
                      this.operatorDumpsterService.getEmptiesWithSpecificDumpsterByCF(this.userInfoService.user.cf).subscribe({
                        next: (res) => {
                          console.log(res)
                        }
                      })
                  }
                })
              }
            }
          })
        },
      },
    })
  }
}

@Component({
  selector: 'app-operator-home-position-error',
  templateUrl: './operator-home-position-error.html',
  styleUrls: ['./operator-home-position-error.scss', './operator-home.component.scss']
})
export class OperatorHomeDialogComponent {

  private readonly CLASS_TAG = 'OperatorHomeDialogComponent'
  public title: string
  public message: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: Dialog,
  ) {
    console.log(this.CLASS_TAG + ": injectedData", injectedData)
    this.title = injectedData.title
    this.message = injectedData.message
  }
}

@Component({
  selector: 'app-operator-home-dialog-dumpster',
  templateUrl: 'operator-home-dialog-dumpster.html',
  styleUrls: ['./operator-home-position-error.scss', './operator-home.component.scss']
})
export class OperatorHomeDialogDumpsterComponent {

  private readonly CLASS_TAG = 'OperatorHomeDialogComponent'
  public title: string
  public message: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: Dialog,
    private router: Router,
    private createDumpsterService: CreateDumpsterService,
  ) {
    console.log(this.CLASS_TAG + ": injectedData", injectedData)
    this.title = injectedData.title
    this.message = injectedData.message
  }

  createDumpster() {
    console.log(this.CLASS_TAG + ": this.createDumpsterService.dumpster", this.createDumpsterService.dumpster)
    this.router.navigate(['/createdumpster'])
  }
}

