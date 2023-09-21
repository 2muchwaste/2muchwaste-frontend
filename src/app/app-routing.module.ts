import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {HomeComponent} from "./home/home.component";
import {SignupComponent} from "./signup/signup.component";
import {SigninComponent} from "./signin/signin.component";
import {CustomerhomeComponent} from "./customerhome/customerhome.component";
import {ElementstestComponent} from "./elementstest/elementstest.component";
import {ForbiddenresourceComponent} from "./forbiddenresource/forbiddenresource.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'customerhome', component: CustomerhomeComponent},
  {path: 'test', component: ElementstestComponent},
  {path: 'forbiddenarea', component: ForbiddenresourceComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
