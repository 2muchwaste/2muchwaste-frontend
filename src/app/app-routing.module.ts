import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {SignupComponent} from "./signup/signup.component";
import {SignInComponent} from "./signin/sign-in.component";
import {CustomerHomeComponent} from "./customerhome/customer-home.component";
import {ForbiddenResourceComponent} from "./forbiddenresource/forbidden-resource.component";
import {UserInformationComponent} from "./userinformation/user-information.component";
import {UserDepositsInformationComponent} from "./userdepositsinformation/user-deposits-information.component";
import {MonthlyCostComponent} from "./monthlycost/monthly-cost.component";
import {UserNotificationsComponent} from "./usernotifications/user-notifications.component";
import {PaymentsComponent} from "./payments/payments.component";
import {SourceNotFoundComponent} from "./sourcenotfound/source-not-found.component";
import {WhoWeAreComponent} from "./whoweare/who-we-are.component";
import {ContactUsComponent} from "./contactus/contact-us.component";
import {OperatorHomeComponent} from "./operatorhome/operator-home.component";
import {EmptyDumpsterComponent} from "./emptydumpster/empty-dumpster.component";
import {MonthlyEmptyingComponent} from "./monthlyemptying/monthly-emptying.component";
import {OperatorInformationComponent} from "./operatorinformation/operator-information.component";
import {OperatorNotificationsComponent } from "./operatornotifications/operator-notifications.component";
import {CreateDumpsterComponent} from "./createdumpster/createdumpster.component";

const routes: Routes = [
  getRouteComponent('signin', SignInComponent),
  getRouteComponent('signup', SignupComponent),
  getRouteComponent('customerhome', CustomerHomeComponent),
  getRouteComponent('operatorhome', OperatorHomeComponent),
  getRouteComponent('emptydumpster', EmptyDumpsterComponent),
  getRouteComponent('monthlyemptying', MonthlyEmptyingComponent),
  getRouteComponent('operatorinformation', OperatorInformationComponent),
  getRouteComponent('operatornotifications', OperatorNotificationsComponent),
  getRouteComponent('forbiddenarea', ForbiddenResourceComponent),
  getRouteComponent('userinformation', UserInformationComponent),
  getRouteComponent('depositsinformation', UserDepositsInformationComponent),
  getRouteComponent('monthlycost', MonthlyCostComponent),
  getRouteComponent('usernotifications', UserNotificationsComponent),
  getRouteComponent('paymentstatus',PaymentsComponent),
  getRouteComponent('whoweare',WhoWeAreComponent),
  getRouteComponent('contactus',ContactUsComponent),
  getRouteComponent('createdumpster',CreateDumpsterComponent),
  {path: '', redirectTo: 'signin', pathMatch: 'full'},
  getRouteComponent('**',SourceNotFoundComponent)
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
