import {Component, Inject, OnInit} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms"
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog"
import {Dumpster, DumpsterBuilder} from "../models/dumpster";
import {DumpsterService} from "../services/backendcalls/dumpsterservice";
import {TrashTypeManager} from "../models/trashtype";
import {AuthenticationService} from "../services/backendcalls/authenticationservice"
import {Router} from "@angular/router"
import {UserInformationService} from "../services/userinformationservice"
import {OperatorInformationService} from "../services/operatorinformationservice"
import {OperatorService} from '../services/backendcalls/operatorservice'
import {LocalStorageService} from "../services/localstorageservice";
import {RoleService} from "../services/backendcalls/roleservice";

@Component({
  selector: 'app-create-dumpster',
  templateUrl: './create-dumpster.component.html',
  styleUrls: ['./../app.component.scss', './create-dumpster.component.scss']
})

export class CreateDumpsterComponent implements OnInit {
  private readonly CLASS_TAG = "CreateDumpsterComponent"
  readonly trashTypeManager = new TrashTypeManager()
  dumpster: Dumpster
  private createDumpsterForm!: FormGroup
  roles: string[] = []
  hide = true

  actualWeightFormControl = new FormControl('', [Validators.required])
  addressFormControl = new FormControl('', [Validators.required])
  areaFormControl = new FormControl('', [Validators.required])
  availableFormControl = new FormControl('', [Validators.required])
  cityFormControl = new FormControl('', [Validators.required])
  latitudineFormControl = new FormControl('', [Validators.required])
  longitudineFormControl = new FormControl('', [Validators.required])
  limitUsablePercentageFormControl = new FormControl('', [Validators.required])
  maxWeightFormControl = new FormControl('', [Validators.required])
  openingSecondsDurationFormControl = new FormControl('', [Validators.required])
  typeFormControl = new FormControl('', [Validators.required])
  zipCodeFormControl = new FormControl('', [Validators.required])

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    public dumpsterService: DumpsterService,
    private authenticationService: AuthenticationService,
    private userInfoService: UserInformationService,
    private operatorInfoService: OperatorInformationService,
    private operatorService: OperatorService,
    private lStorageService: LocalStorageService,
    public roleService: RoleService,
  ) {
    this.dumpster = this.dumpsterService.dumpster
    this.createDumpsterForm = this.fb.group({
      actualWeight: this.actualWeightFormControl,
      address: this.addressFormControl,
      area: this.areaFormControl,
      available: this.availableFormControl,
      city: this.cityFormControl,
      latitude: this.latitudineFormControl,
      longitude: this.longitudineFormControl,
      limitUsablePercentage: this.limitUsablePercentageFormControl,
      maxWeight: this.maxWeightFormControl,
      openingSecondsDuration: this.openingSecondsDurationFormControl,
      type: this.typeFormControl,
      zipCode: this.zipCodeFormControl
    })

  }

  ngOnInit(): void {
  }

  initDumpster(): Dumpster{
    return new DumpsterBuilder()
      .setActualWeightFormControl(this.actualWeightFormControl.value)
      .setAddressFormControl(this.addressFormControl.value)
      .setareaFormControl(this.areaFormControl)
      .setAvailableFormControl(this.availableFormControl.value)
      .setCityFormControl(this.cityFormControl.value)
      .setLatitudineFormControl(this.latitudineFormControl.value)
      .setLongitudineFormControl(this.longitudineFormControl.value)
      .setLimitUsablePercentageFormControl(this.limitUsablePercentageFormControl.value)
      .setMaxWeightFormControl(this.maxWeightFormControl.value)
      .setOpeningSecondsDurationFormControl(this.openingSecondsDurationFormControl.value)
      .setTypeFormControl(this.typeFormControl.value)
      .setZipCodeFormControl(this.zipCodeFormControl.value)
      .build()
  }

  submit() {
    if (this.createDumpsterForm.valid) {
      console.log("creazione bidone");
      this.dumpsterService.createDumpster(this.initDumpster())
        .subscribe({
          next: (res) => {
            console.log("bidone realizzato", res);
            this.createDumpsterSuccess()
          },
          error: (err) => {
            this.dialog.open(CreateDumpsterErrorDialogComponent, {
              data: {
                statusCode: err.status
              }
            })
          }
        })
    }
  }

  private createDumpsterSuccess() {
    this.router.navigate(['/operatorhome']);
  }
  
  private handleDumpsterCreationError(statusCode: number) {
    this.dialog.open(CreateDumpsterErrorDialogComponent, {
      data: {
        statusCode: statusCode
      }
    });
  }
}


@Component({
  selector: 'app-createdumpster-error-dialog',
  templateUrl: './createdumpster-error-dialog.html',
})
export class CreateDumpsterErrorDialogComponent {

  ErrorDumpster = false

  constructor(@Inject(MAT_DIALOG_DATA) public errorStatus: any) {
    this.ErrorDumpster = true
  }
}
