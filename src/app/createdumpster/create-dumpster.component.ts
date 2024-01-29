import {Component, Inject, OnInit} from '@angular/core'
<<<<<<< HEAD
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms"
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog"
import {Dumpster, DumpsterBuilder} from "../models/dumpster";
import {DumpsterService} from "../services/backendcalls/dumpsterservice";
import {TrashTypeManager} from "../models/trashtype";
=======
import {User, UserBuilder} from "../models/user"
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms"
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog"
// import {WebsiteRole} from "../models/role"
>>>>>>> 6b21b1aabf93b92db4692f499a64c2b2ccec2650
import {AuthenticationService} from "../services/backendcalls/authenticationservice"
import {Router} from "@angular/router"
import {UserInformationService} from "../services/userinformationservice"
import {OperatorInformationService} from "../services/operatorinformationservice"
<<<<<<< HEAD
=======
import {SigninErrorDialogComponent} from "../signin/sign-in.component"
import {CustomerService} from "../services/backendcalls/customerservice"
>>>>>>> 6b21b1aabf93b92db4692f499a64c2b2ccec2650
import {OperatorService} from '../services/backendcalls/operatorservice'
import {LocalStorageService} from "../services/localstorageservice";
import {RoleService} from "../services/backendcalls/roleservice";

@Component({
  selector: 'app-create-dumpster',
  templateUrl: './create-dumpster.component.html',
  styleUrls: ['./../app.component.scss', './create-dumpster.component.scss']
})

export class CreateDumpsterComponent implements OnInit {
<<<<<<< HEAD
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
=======

  // readonly WebsiteRole = WebsiteRole
>>>>>>> 6b21b1aabf93b92db4692f499a64c2b2ccec2650

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
<<<<<<< HEAD
    public dumpsterService: DumpsterService,
    private authenticationService: AuthenticationService,
    private userInfoService: UserInformationService,
    private operatorInfoService: OperatorInformationService,
=======
    private authenticationService: AuthenticationService,
    private userInfoService: UserInformationService,
    private operatorInfoService: OperatorInformationService,
    private customerService: CustomerService,
>>>>>>> 6b21b1aabf93b92db4692f499a64c2b2ccec2650
    private operatorService: OperatorService,
    private lStorageService: LocalStorageService,
    public roleService: RoleService,
  ) {
<<<<<<< HEAD
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
=======
    this.signupForm = this.fb.group({
      name: this.nameFormControl,
      surname: this.surnameFormControl,
      email: this.emailFormControl,
      cf: this.CFFormControl,
      password: this.passwordFormControl,
      zipCode: this.zipCodeFormControl,
      address: this.addressFormControl,
      city: this.cityFormControl,
      birthday: this.birthdayFormControl,
      role: this.roleFormControl
    })

    this.roles.push(
      this.roleService.getCustomerName(),
      this.roleService.getOperatorName(),
      this.roleService.getAdminName())
  }

  private signupForm!: FormGroup

  roles: string[] = []

  hide = true

  nameFormControl = new FormControl('', [Validators.required])
  surnameFormControl = new FormControl('', [Validators.required])
  emailFormControl = new FormControl('', [Validators.required])
  CFFormControl = new FormControl('', [Validators.required])
  passwordFormControl = new FormControl('', [Validators.required])
  zipCodeFormControl = new FormControl('', [Validators.required])
  addressFormControl = new FormControl('', [Validators.required])
  cityFormControl = new FormControl('', [Validators.required])
  birthdayFormControl = new FormControl('', [Validators.required])
  roleFormControl = new FormControl('', [Validators.required])

  ngOnInit(): void {
  }

  initUser(): User {
    return new UserBuilder()
      .setName(this.nameFormControl.value)
      .setSurname(this.surnameFormControl.value)
      .setBirthday(
        this.birthdayFormControl.value.getFullYear() + '-'
        + (this.birthdayFormControl.value.getMonth() + 1) + '-'
        + this.birthdayFormControl.value.getDate()
      )
      .setCF(this.CFFormControl.value)
      .setEmail(this.emailFormControl.value)
      .setAddress(this.addressFormControl.value)
      .setZipCode(this.zipCodeFormControl.value)
      .setCity(this.cityFormControl.value)
      .setRole(this.roleFormControl.value)
      .setPassword(this.passwordFormControl.value)
>>>>>>> 6b21b1aabf93b92db4692f499a64c2b2ccec2650
      .build()
  }

  submit() {
<<<<<<< HEAD
    if (this.createDumpsterForm.valid) {
      console.log("creazione bidone");
      this.dumpsterService.createDumpster(this.initDumpster())
        .subscribe({
          next: (res) => {
            console.log("bidone realizzato", res);
            this.createDumpsterSuccess()
=======
    if (this.signupForm.valid) {
      this.authenticationService.signup(this.initUser(), this.roleFormControl.value)
        .subscribe({
          next: (res) => {
            this.doLogin()
>>>>>>> 6b21b1aabf93b92db4692f499a64c2b2ccec2650
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

<<<<<<< HEAD
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

=======
  private doLogin() {
    this.authenticationService.signin(
      this.emailFormControl.value,
      this.passwordFormControl.value,
      this.roleFormControl.value
    ).subscribe({
      next: (signinResponse) => {
        this.lStorageService.setUserToken(signinResponse.token)
        if (this.roleFormControl.value === this.roleService.getCustomerName()) {
          this.customerService.getCustomerByID(signinResponse.id).subscribe({
            next: (userResponse) => {
              this.userInfoService.login(userResponse, signinResponse.token)
              this.router.navigate(['/customerhome'])
            },
            error: (err) => {
              this.dialog.open(SigninErrorDialogComponent)
            }
          })
        } else if (this.roleFormControl.value === this.roleService.getOperatorName()) {
          this.operatorService.getOperatorByID(signinResponse.id).subscribe({
            next: (userResponse) => {
              this.userInfoService.login(userResponse, signinResponse.token)
              this.router.navigate(['/operatorhome'])
            },
            error: (err) => {
              this.dialog.open(SigninErrorDialogComponent)
            }
          })
        }
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
>>>>>>> 6b21b1aabf93b92db4692f499a64c2b2ccec2650

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
