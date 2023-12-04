import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {SignupComponent} from "./signup/signup.component";
import {SigninComponent} from "./signin/signin.component";
import {CustomerhomeComponent} from "./customerhome/customerhome.component";
import {ElementstestComponent} from "./elementstest/elementstest.component";
import {ForbiddenresourceComponent} from "./forbiddenresource/forbiddenresource.component";
import {UserinformationComponent} from "./userinformation/userinformation.component";
import {UserdepositsinformationComponent} from "./userdepositsinformation/userdepositsinformation.component";
import {MonthlycostComponent} from "./monthlycost/monthlycost.component";
import {UserNotificationsComponent} from "./usernotifications/user-notifications.component";
import {MaptestComponent} from "./maptest/maptest.component";
import {PaymentsComponent} from "./payments/payments.component";

// const routes: Routes = [{
//   path: "",
//   component:
//   children: [
//     {path: 'home', component: HomeComponent},
//     {path: 'signup', component: SignupComponent},
//     {path: 'signin', component: SigninComponent},
//     {path: 'customerhome', component: CustomerhomeComponent},
//     {path: 'test', component: ElementstestComponent},
//     {path: 'forbiddenarea', component: ForbiddenresourceComponent},
//     {path: '', redirectTo: '/home', pathMatch: 'full'},]
// }]

const routes: Routes = [
  getRouteComponent('signin', SigninComponent),
  getRouteComponent('signup', SignupComponent),
  getRouteComponent('customerhome', CustomerhomeComponent),
  getRouteComponent('test', ElementstestComponent),
  getRouteComponent('forbiddenarea', ForbiddenresourceComponent),
  getRouteComponent('userinformation', UserinformationComponent),
  getRouteComponent('depositsinformation', UserdepositsinformationComponent),
  getRouteComponent('monthlycost', MonthlycostComponent),
  getRouteComponent('usernotifications', UserNotificationsComponent),
  getRouteComponent('maptest',MaptestComponent),
  getRouteComponent('paymentstatus',PaymentsComponent),
  // {
  //   path:'depositsinformation',
  //   component:UserdepositsinformationComponent,
  //   children:[
  //     getRouteComponent('monthlycost',MonthlycostComponent)
  //   ]
  // },
  // {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'signin', pathMatch: 'full'},
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
