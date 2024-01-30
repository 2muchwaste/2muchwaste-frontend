import {NgModule, OnInit} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {ContactUsComponent} from './contactus/contact-us.component';
import {CreateDepositComponent} from './createdeposit/create-deposit.component';
import {CreateDumpsterComponent} from './createdumpster/create-dumpster.component';
import {
  CustomerHomeComponent,
  CustomerHomeDialogComponent,
  CustomerHomeThrowGarbageDialogComponent
} from './customerhome/customer-home.component';
import {DialogSimpleComponent} from "./dialogs/DialogSimple";
import {DialogYesNoComponent} from "./dialogs/DialogYesNo";
import {DumpstersListComponent} from './dumpsterslist/dumpsters-list.component';
import {EmptyDumpsterComponent} from './emptydumpster/empty-dumpster.component';
import {environment} from '../environments/environment';
import {FooterComponent} from './footer/footer.component';
import {ForbiddenResourceComponent} from './forbiddenresource/forbidden-resource.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from "@angular/common/http";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MaterialExampleModule} from '../material.module';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MonthlyCostComponent} from './monthlycost/monthly-cost.component';
import {MonthlyEmptyingComponent} from './monthlyemptying/monthly-emptying.component';
import {NavbarComponent} from './navbar/navbar.component';
import {
  OperatorHomeComponent,
  OperatorHomeDialogComponent,
  OperatorHomeDialogDumpsterComponent,
  OperatorHomeEmptyGarbageDialogComponent
} from './operatorhome/operator-home.component';
import {OperatorInformationComponent} from './operatorinformation/operator-information.component';
import {OperatorNotificationsComponent} from './operatornotifications/operator-notifications.component';
import {PaymentDialogComponent, PaymentsComponent} from './payments/payments.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {SignInComponent, SigninErrorDialogComponent} from './signin/sign-in.component';
import {SignupComponent, SignupErrorDialogComponent} from './signup/signup.component';
import {SourceNotFoundComponent} from './sourcenotfound/source-not-found.component';
import {UserDepositsInformationComponent} from './userdepositsinformation/user-deposits-information.component';
import {UserInformationComponent} from './userinformation/user-information.component';
import {UserInformationService} from "./services/userinformationservice";
import {UserNotificationsComponent} from './usernotifications/user-notifications.component';
import {WhoWeAreComponent} from './whoweare/who-we-are.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactUsComponent,
    CreateDepositComponent,
    CreateDumpsterComponent,
    CustomerHomeComponent,
    CustomerHomeDialogComponent,
    CustomerHomeThrowGarbageDialogComponent,
    DialogSimpleComponent,
    DialogYesNoComponent,
    DumpstersListComponent,
    EmptyDumpsterComponent,
    FooterComponent,
    ForbiddenResourceComponent,
    HomeComponent,
    MonthlyCostComponent,
    MonthlyEmptyingComponent,
    NavbarComponent,
    OperatorHomeComponent,
    OperatorHomeDialogComponent,
    OperatorHomeDialogDumpsterComponent,
    OperatorHomeEmptyGarbageDialogComponent,
    OperatorInformationComponent,
    OperatorNotificationsComponent,
    PaymentDialogComponent,
    PaymentsComponent,
    SignInComponent,
    SigninErrorDialogComponent,
    SignupComponent,
    SignupErrorDialogComponent,
    SourceNotFoundComponent,
    UserDepositsInformationComponent,
    UserInformationComponent,
    UserNotificationsComponent,
    WhoWeAreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    CanvasJSAngularChartsModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDividerModule,
    MatIconModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule implements OnInit {

  constructor(
    private userInfoService: UserInformationService
  ) {
  }

  ngOnInit(): void {
    console.log("AppComponent OnInit");
  }
}
