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

ort Math from ""

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

}
