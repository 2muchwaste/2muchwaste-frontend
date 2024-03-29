import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Dumpster, DumpsterBuilder} from "../models/dumpster";
import {DumpsterService} from "../services/backendcalls/dumpsterservice";
import {TrashTypeManager, TrashTypes} from "../models/trashtype";
import {AuthenticationService} from "../services/backendcalls/authenticationservice";
import {CreateDumpsterService} from "../services/middleware/createdumpsterservice";
import {Router} from "@angular/router";
import {UserInformationService} from "../services/userinformationservice";
import {OperatorInformationService} from "../services/operatorinformationservice";
import {OperatorService} from '../services/backendcalls/operatorservice';
import {LocalStorageService} from "../services/localstorageservice";
import {RoleService} from "../services/backendcalls/roleservice";
import {DialogSimpleComponent} from "../dialogs/DialogSimple";

@Component({
  selector: 'app-create-dumpster',
  templateUrl: './create-dumpster.component.html',
  styleUrls: ['./../app.component.scss', './create-dumpster.component.scss']
})
export class CreateDumpsterComponent implements OnInit {
  maxUsablePercentage = 90
  minUsablePercentage = 10
  private readonly CLASS_TAG = "CreateDumpsterComponent";
  readonly trashTypeManager = new TrashTypeManager();
  dumpster: Dumpster;
  private createDumpsterForm!: FormGroup;



  actualWeightFormControl = new FormControl('', [Validators.required]);
  addressFormControl = new FormControl('', [Validators.required]);
  areaFormControl = new FormControl('', [Validators.required]);
  availableFormControl = new FormControl('', [Validators.required,this.availabilityValidator]);
  cityFormControl = new FormControl('', [Validators.required]);
  latitudineFormControl = new FormControl('', [Validators.required]);
  longitudineFormControl = new FormControl('', [Validators.required]);
  // limitUsablePercentageFormControl = new FormControl('', [Validators.required,this.percentageValidator]);
  limitUsablePercentageFormControl = new FormControl('', [Validators.required,Validators.min(this.minUsablePercentage),Validators.max(this.maxUsablePercentage)]);
  maxWeightFormControl = new FormControl('', [Validators.required]);
  openingSecondsDurationFormControl = new FormControl('', [Validators.required]);
  typeFormControl = new FormControl('', [Validators.required]);
  zipCodeFormControl = new FormControl('', [Validators.required]);

  trashTypes: TrashTypes[];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    public dumpsterService: DumpsterService,
    public createDumpsterService: CreateDumpsterService,
    private authenticationService: AuthenticationService,
    private userInfoService: UserInformationService,
    private operatorInfoService: OperatorInformationService,
    private operatorService: OperatorService,
    private lStorageService: LocalStorageService,
    public roleService: RoleService,
  ) {
    this.dumpster = this.dumpsterService.dumpster;

    this.trashTypes = Object.values(TrashTypes)

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
    });
  }

  availabilityValidator(control: FormControl): { [s: string]: boolean } {
    const valid = /^(true|false)$/.test(control.value);
    return valid ? {} : {"invalidAvailability": true}
  }

  ngOnInit(): void {
  }

  initDumpster(): Dumpster {
    return new DumpsterBuilder()
      .setActualWeight(this.actualWeightFormControl.value)
      .setAddress(this.addressFormControl.value)
      .setArea(this.areaFormControl.value)
      .setAvailable(this.availableFormControl.value)
      .setCity(this.cityFormControl.value)
      .setLatitude(this.latitudineFormControl.value)
      .setLongitude(this.longitudineFormControl.value)
      .setLimitUsablePercentage(this.limitUsablePercentageFormControl.value)
      .setMaxWeight(this.maxWeightFormControl.value)
      .setOpeningSecondsDuration(this.openingSecondsDurationFormControl.value)
      .setType(this.typeFormControl.value)
      .setZipCode(this.zipCodeFormControl.value)
      .build();
  }

  submit() {
    if (this.createDumpsterForm.valid) {
      console.log("creazione bidone");
      const createObject = this.initDumpster()
      this.dumpsterService.createDumpster(createObject).subscribe({
        next: (res) => {
          console.log("bidone realizzato", res);
          let dialogRef = this.dialog.open(DialogSimpleComponent, {
            data: {
              title: "Bidone creato",
              message: "Bidone creato con successo"
            }
          })
          dialogRef.afterClosed().subscribe({
            next: (res) => {
              this.router.navigate(['/operatorhome'])
            }
          })

        }
      });
    }
  }
}
