import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContactUsComponent} from "./contactus/contact-us.component";
import {CreateDepositComponent} from "./createdeposit/create-deposit.component";
import {CreateDumpsterComponent} from "./createdumpster/create-dumpster.component";
import {CustomerHomeComponent} from "./customerhome/customer-home.component";
import {DumpstersListComponent} from "./dumpsterslist/dumpsters-list.component";
import {EmptyDumpsterComponent} from "./emptydumpster/empty-dumpster.component";
import {ForbiddenResourceComponent} from "./forbiddenresource/forbidden-resource.component";
import {MonthlyCostComponent} from "./monthlycost/monthly-cost.component";
import {MonthlyEmptyingComponent} from "./monthlyemptying/monthly-emptying.component";
import {OperatorHomeComponent} from "./operatorhome/operator-home.component";
import {OperatorInformationComponent} from "./operatorinformation/operator-information.component";
import {OperatorNotificationsComponent} from "./operatornotifications/operator-notifications.component";
import {PaymentsComponent} from "./payments/payments.component";
import {RouterModule, Routes} from "@angular/router";
import {SignInComponent} from "./signin/sign-in.component";
import {SignupComponent} from "./signup/signup.component";
import {SourceNotFoundComponent} from "./sourcenotfound/source-not-found.component";
import {UserDepositsInformationComponent} from "./userdepositsinformation/user-deposits-information.component";
import {UserInformationComponent} from "./userinformation/user-information.component";
import {UserNotificationsComponent} from "./usernotifications/user-notifications.component";
import {WhoWeAreComponent} from "./whoweare/who-we-are.component";

const routes: Routes = [
  getRouteComponent('contactus', ContactUsComponent),
  getRouteComponent('createdeposit', CreateDepositComponent),
  getRouteComponent('createdumpster', CreateDumpsterComponent),
  getRouteComponent('customerhome', CustomerHomeComponent),
  getRouteComponent('depositsinformation', UserDepositsInformationComponent),
  getRouteComponent('dumpsterslist', DumpstersListComponent),
  getRouteComponent('emptydumpster', EmptyDumpsterComponent),
  getRouteComponent('forbiddenarea', ForbiddenResourceComponent),
  getRouteComponent('monthlycost', MonthlyCostComponent),
  getRouteComponent('monthlyemptying', MonthlyEmptyingComponent),
  getRouteComponent('operatorhome', OperatorHomeComponent),
  getRouteComponent('operatorinformation', OperatorInformationComponent),
  getRouteComponent('operatornotifications', OperatorNotificationsComponent),
  getRouteComponent('paymentstatus', PaymentsComponent),
  getRouteComponent('signin', SignInComponent),
  getRouteComponent('signup', SignupComponent),
  getRouteComponent('userinformation', UserInformationComponent),
  getRouteComponent('usernotifications', UserNotificationsComponent),
  getRouteComponent('whoweare', WhoWeAreComponent),

  {path: '', redirectTo: 'signin', pathMatch: 'full'},
  getRouteComponent('**', SourceNotFoundComponent)
]

function getRouteComponent(path: string, component: any) {
  return {path: path, component: component}
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
