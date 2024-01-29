import {NgModule, OnInit} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {MaterialExampleModule} from '../material.module';

import {NavbarComponent} from './navbar/navbar.component';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {HomeComponent} from './home/home.component';

import {SignupComponent, SignupErrorDialogComponent} from './signup/signup.component';
import {SignInComponent, SigninErrorDialogComponent} from './signin/sign-in.component';

import {
  CustomerHomeComponent,
  CustomerHomeDialogComponent,
  CustomerHomeThrowGarbageDialogComponent
} from './customerhome/customer-home.component';
import {
  OperatorHomeComponent,
  OperatorHomeDialogComponent,
  OperatorHomeEmptyGarbageDialogComponent
} from './operatorhome/operator-home.component';
import {SourceNotFoundComponent} from './sourcenotfound/source-not-found.component';
import {EmptyDumpsterComponent} from './emptydumpster/empty-dumpster.component';
// import {MonthlyEmptyingComponent} from './monthlyemptying/monthly-emptying.component';
import {OperatorInformationComponent} from './operatorinformation/operator-information.component';
// import {OperatorNotificationsComponent} from './operatornotifications/operator-notifications.component';
import {ForbiddenResourceComponent} from './forbiddenresource/forbidden-resource.component';
import {FooterComponent} from './footer/footer.component';
import {UserInformationComponent} from './userinformation/user-information.component';
import {UserDepositsInformationComponent} from './userdepositsinformation/user-deposits-information.component';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {MonthlyCostComponent} from './monthlycost/monthly-cost.component';
import {UserInformationService} from "./services/userinformationservice";
import {UserNotificationsComponent} from './usernotifications/user-notifications.component';
import {PaymentDialogComponent, PaymentsComponent} from './payments/payments.component';
import {WhoWeAreComponent} from './whoweare/who-we-are.component';
import {ContactUsComponent} from './contactus/contact-us.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {CreateDepositComponent} from './createdeposit/create-deposit.component';
import {DialogYesNoComponent} from "./dialogs/DialogYesNo";
import {DialogSimpleComponent} from "./dialogs/DialogSimple";
import {DumpstersListComponent} from './dumpsterslist/dumpsters-list.component';
import {CreateDumpsterComponent} from './createdumpster/create-dumpster.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SignupComponent,
    SignupErrorDialogComponent,
    SignInComponent,
    SigninErrorDialogComponent,
    CustomerHomeComponent,
    CustomerHomeThrowGarbageDialogComponent,
    CustomerHomeDialogComponent,
    OperatorHomeComponent,
    MonthlyCostComponent,
    PaymentsComponent,
    PaymentDialogComponent,
    OperatorHomeEmptyGarbageDialogComponent,
    OperatorHomeEmptyGarbageDialogComponent,
    EmptyDumpsterComponent,
    // MonthlyEmptyingComponent,
    CreateDumpsterComponent,
    // OperatorNotificationsComponent,
    OperatorHomeDialogComponent,
    OperatorInformationComponent,
    DialogYesNoComponent,
    DialogSimpleComponent,
    SourceNotFoundComponent,
    ForbiddenResourceComponent,
    FooterComponent,
    UserInformationComponent,
    UserDepositsInformationComponent,
    UserNotificationsComponent,
    WhoWeAreComponent,
    ContactUsComponent,
    CreateDepositComponent,
    DumpstersListComponent,
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
