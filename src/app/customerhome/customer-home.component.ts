import {AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core'
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog"
import {Dumpster} from "../models/dumpster"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"
import {Observable, Subscription} from "rxjs"
import {Deposit} from "../models/deposit"
import {CustomerService} from "../services/backendcalls/customerservice"
import {UserInformationService} from "../services/userinformationservice"
import {DepositService} from "../services/backendcalls/depositservice"
import {UserResponse} from "../models/userresponse"
import {DumpsterService} from "../services/backendcalls/dumpsterservice"
import {Timer} from "../models/timer"
import * as L from "leaflet"
import {TrashTypeManager} from "../models/trashtype"
import {PageEvent} from "@angular/material/paginator"
import {LocalStorageService} from "../services/localstorageservice"
import {Router} from "@angular/router";
import {CreateDepositService} from "../services/middleware/createdepositservice";
import {Coordinates} from "../utils/geoutils";

export interface Dialog {
  title: string,
  message: string
}

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.scss']
})
export class CustomerHomeComponent implements OnInit {

  public user!: UserResponse
  public deposits!: Deposit[]
  private lastUserPosition!: Coordinates
  private map!: L.Map
  private trashTypeManager
  isButtonsVisible: Boolean = false
  viewMapDumpsters = false
  showBorderMap = false

  constructor(
    private customerHomeDialog: MatDialog,
    private customerService: CustomerService,
    private authorizationService: Authorizationservice,
    private depositService: DepositService,
    public userInfoService: UserInformationService,
    private dumpsterService: DumpsterService,
    private lStorageService: LocalStorageService
  ) {
    this.trashTypeManager = new TrashTypeManager()
  }

  ngOnInit(): void {
    console.log("OnInit customerhome")
    this.authorizationService.checkAuthDataORRedirect()
    this.user = this.userInfoService.user
    if (this.user == null)
      this.setUser()
    // console.log(this.user)
    this.setDeposits()
    console.log("OnInit customerhome uscita")
  }

  private initMap(userPosition: Coordinates): void {
    let centroid: L.LatLngExpression = [
      this.lastUserPosition.coords.latitude,
      this.lastUserPosition.coords.longitude
    ]

    this.map = L.map('map', {
      center: centroid,
      zoom: 18
    })

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 8,
      attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    let userPositionIcon = L.icon({
      iconUrl: 'assets/icons/user-position-pic.png',
      iconSize: [38, 38], // size of the icon
      iconAnchor: [19, 19], // point of the icon which will correspond to marker's location
    })

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
    console.log(this.user)
  }

  setDeposits() {
    // @ts-ignore
    this.depositService.getDepositsFromUser(this.lStorageService.getUserID())
      .subscribe({
        next: (res) => {
          let lastMonthDate = new Date()
          lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
          this.deposits = res
            .map(deposit => {
              deposit.date = new Date(deposit.date)
              return deposit
            })
            .filter(deposit => deposit.date > lastMonthDate)
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  throwGarbage() {
    this.isButtonsVisible = !this.isButtonsVisible
  }

  private setDumpsters(userPosition: Coordinates) {
    this.dumpsterService.getNearDumpsters(userPosition).subscribe({
      next: (res) => {
        this.userInfoService.setNearestDumpsters(res)
        this.lastUserPosition = userPosition
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  closeMap() {
    console.log("Close map button clicked")
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
        title: errorTitle,
        message: errorMessage
      }
    })
  }

  private setUser() {
    // @ts-ignore
    this.customerService.getCustomerByID(this.lStorageService.getUserID()).subscribe({
      next: (res) => {
        this.user = res
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  private openDumpster(openingSeconds: number) {
    let closingSecondsSentence = "Il bidone ha un timer interno e rimarrà aperto per ulteriori "
    let dumpsterOpenedDialog = this.openDialog(
      "Apertura bidone",
      closingSecondsSentence + openingSeconds + " secondi"
    )
    console.log("Inizio timer")
    new Timer(10000, 1000, () => {
      this.updateDialogg(
        dumpsterOpenedDialog,
        "Apertura bidone",
        "Micio")
      console.log(new Date())
    }).start()
  }

  private updateDialogg(dialog: MatDialogRef<CustomerHomeDialogComponent>, title: string, message: string) {
    dialog.componentInstance.title = title
    dialog.componentInstance.message = message
  }

  private updateDialog(dialog: MatDialog, seconds: number, title: string, message: number) {
    if (seconds > 0) {
      setTimeout(() => {
        this.updateDialog(dialog, seconds - 1, title, message)
        console.log("AAA")
      }, 1000)
      console.log("BBB")
    }
  }

  getNearDumpsters() {
    if ('geolocation' in navigator) {
      console.log('geolocation present')
      let nearestDumpstersDialog = this.customerHomeDialog.open(CustomerHomeThrowGarbageDialogComponent)
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

}

@Component({
  selector: 'app-customer-home-throw-garbage-dialog',
  templateUrl: './customer-home-throw-garbage-dialog.html',
  styleUrls: ['./customer-home.component.scss', './customer-home-throw-garbage-dialog.scss']

})
export class CustomerHomeThrowGarbageDialogComponent {
  // public dumpsters: {dumpster: Dumpster,distance: number}[]

  @Output() showMapEvent = new EventEmitter<boolean>()
  trashTypesManager: TrashTypeManager = new TrashTypeManager()

  public nearestDumpstersSet = false

  public newNearestDumpster: Subscription

  public showMap = false
  public lowValue
  public highValue
  public dumpsterForPage = 10

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: any,
    public userInfoService: UserInformationService,
    public dialog: MatDialog,
    private createDepositService: CreateDepositService,
  ) {
    console.log('here')
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

  openDialog(dump: { dumpster: Dumpster; distance: number }) {
    this.createDepositService.dumpster = dump.dumpster
    let dialog: Dialog = {
      title: 'Deposito',
      message: 'Sicuro di voler svuotare il bidone in ' + dump.dumpster.address + '?',
    }
    let dialogRef = this.dialog.open(CustomerHomeDialogYesNoComponent, {
      data: dialog,
    })
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        this.dialog.closeAll()
      }
    })
  }

}

@Component({
  selector: 'app-customer-home-position-error',
  templateUrl: 'customer-home-position-error.html',
  styleUrls: ['./customer-home-position-error.scss', './customer-home.component.scss']
})
export class CustomerHomeDialogComponent {

  private readonly CLASS_TAG = 'CustomerHomeDialogComponent'
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
  selector: 'app-customer-home-yes-no',
  templateUrl: 'customer-home-yes-no.html',
  styleUrls: ['./customer-home-position-error.scss', './customer-home.component.scss']
})
export class CustomerHomeDialogYesNoComponent {

  private readonly CLASS_TAG = 'CustomerHomeDialogComponent'
  public title: string
  public message: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: Dialog,
    private router: Router,
    private createDepositService: CreateDepositService,
  ) {
    console.log(this.CLASS_TAG + ": injectedData", injectedData)
    this.title = injectedData.title
    this.message = injectedData.message
  }

  createDeposit() {
    console.log(this.CLASS_TAG + ": this.createDepositService.dumpster", this.createDepositService.dumpster)
    this.router.navigate(['/createdeposit'])
  }
}

