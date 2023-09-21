import {NgModule} from '@angular/core';
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
import {SigninComponent, SigninErrorDialogComponent} from './signin/signin.component';

import {SignoperComponent} from './signoper/signoper.component';
import {
    CustomerhomeComponent,
    CustomerHomePositionErrorDialogComponent,
    CustomerHomeThrowGarbageDialogComponent
} from './customerhome/customerhome.component';
import {OperatorhomeComponent} from './operatorhome/operatorhome.component';
import {ElementstestComponent} from './elementstest/elementstest.component';
import { SourcenotfoundComponent } from './sourcenotfound/sourcenotfound.component';
import { ForbiddenresourceComponent } from './forbiddenresource/forbiddenresource.component';


@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        SignupComponent,
        SignupErrorDialogComponent,
        SigninComponent,
        SigninErrorDialogComponent,
        SignoperComponent,
        CustomerhomeComponent,
        CustomerHomeThrowGarbageDialogComponent,
        CustomerHomePositionErrorDialogComponent,
        OperatorhomeComponent,
        ElementstestComponent,
        SourcenotfoundComponent,
        ForbiddenresourceComponent
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
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
