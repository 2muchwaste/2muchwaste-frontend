import {Component, Inject, OnInit} from '@angular/core'
import {User, UserBuilder} from "../models/user"
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms"
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog"
// import {WebsiteRole} from "../models/role"
import {AuthenticationService} from "../services/backendcalls/authenticationservice"
import {Router} from "@angular/router"
import {UserInformationService} from "../services/userinformationservice"
import {OperatorInformationService} from "../services/operatorinformationservice"
import {SigninErrorDialogComponent} from "../signin/sign-in.component"
import {CustomerService} from "../services/backendcalls/customerservice"
import {OperatorService} from '../services/backendcalls/operatorservice'
import {LocalStorageService} from "../services/localstorageservice";
import {RoleService} from "../services/backendcalls/roleservice";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./../app.component.scss', './signup.component.scss']
})

export class SignupComponent implements OnInit {

  readonly minLengthPassword = 8
  readonly maxLengthPassword = 32

  // readonly WebsiteRole = WebsiteRole

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userInfoService: UserInformationService,
    private operatorInfoService: OperatorInformationService,
    private customerService: CustomerService,
    private operatorService: OperatorService,
    private lStorageService: LocalStorageService,
    public roleService: RoleService,
  ) {
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
  emailFormControl = new FormControl('', [Validators.required,Validators.email])
  CFFormControl = new FormControl('', [Validators.required])
  // passwordFormControl = new FormControl('', [Validators.required,Validators.minLength(this.minLengthPassword),Validators.maxLength(this.maxLengthPassword)])
  passwordFormControl = new FormControl('', [Validators.required,Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,32}$')])
  zipCodeFormControl = new FormControl('', [Validators.required])
  addressFormControl = new FormControl('', [Validators.required])
  cityFormControl = new FormControl('', [Validators.required])
  birthdayFormControl = new FormControl('', [Validators.required,this.dateValidator])
  roleFormControl = new FormControl('', [Validators.required])


  dateValidator(control: FormControl): { [s: string]: boolean } {
    let fValue = control.value
    if (control.value) {
      const dateChosen = new Date(fValue)
      // const today = new Date()
      let adultAge = new Date()
      adultAge.setFullYear(adultAge.getFullYear()-18)
      if (dateChosen<adultAge){
        return {}
      }
    }
    return {'invalidDate':true}
  }

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
      .build()
  }

  submit() {
    if (this.signupForm.valid) {
      this.authenticationService.signup(this.initUser(), this.roleFormControl.value)
        .subscribe({
          next: (res) => {
            this.doLogin()
          },
          error: (err) => {
            this.dialog.open(SignupErrorDialogComponent, {
              data: {
                statusCode: err.status
              }
            })
          }
        })
    }
  }

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
        this.dialog.open(SignupErrorDialogComponent, {
          data: {
            statusCode: err.status
          }
        })
      }
    })
  }

}

@Component({
  selector: 'app-signup-error-dialog',
  templateUrl: './signup-error-dialog.html',
})
export class SignupErrorDialogComponent {

  emailAlreadyPresent = false

  constructor(@Inject(MAT_DIALOG_DATA) public errorStatus: any) {
    this.emailAlreadyPresent = true
  }
}
