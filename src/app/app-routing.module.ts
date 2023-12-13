import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {SignupComponent} from "./signup/signup.component";
import {SigninComponent} from "./signin/signin.component";
import {CustomerhomeComponent} from "./customerhome/customerhome.component";
import {ForbiddenresourceComponent} from "./forbiddenresource/forbiddenresource.component";
import {UserinformationComponent} from "./userinformation/userinformation.component";
import {UserdepositsinformationComponent} from "./userdepositsinformation/userdepositsinformation.component";
import {MonthlycostComponent} from "./monthlycost/monthlycost.component";
import {UserNotificationsComponent} from "./usernotifications/user-notifications.component";
import {MaptestComponent} from "./maptest/maptest.component";
import {PaymentsComponent} from "./payments/payments.component";
import {SourcenotfoundComponent} from "./sourcenotfound/sourcenotfound.component";
import {WhoWeAreComponent} from "./whoweare/who-we-are.component";
import {ContactUsComponent} from "./contactus/contact-us.component";

const routes: Routes = [
  getRouteComponent('signin', SigninComponent),
  getRouteComponent('signup', SignupComponent),
  getRouteComponent('customerhome', CustomerhomeComponent),
  getRouteComponent('forbiddenarea', ForbiddenresourceComponent),
  getRouteComponent('userinformation', UserinformationComponent),
  getRouteComponent('depositsinformation', UserdepositsinformationComponent),
  getRouteComponent('monthlycost', MonthlycostComponent),
  getRouteComponent('usernotifications', UserNotificationsComponent),
  getRouteComponent('maptest',MaptestComponent),
  getRouteComponent('paymentstatus',PaymentsComponent),
  getRouteComponent('whoweare',WhoWeAreComponent),
  getRouteComponent('contactus',ContactUsComponent),
  {path: '', redirectTo: 'signin', pathMatch: 'full'},
  getRouteComponent('**',SourcenotfoundComponent)
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
