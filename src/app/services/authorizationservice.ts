import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpHeaders} from "@angular/common/http";
import {AppConstants} from "../utils/constants";

@Injectable({
  providedIn: 'root',
})
export class Authorizationservice {
  constructor(private router: Router) {
  }

  isTokenPresent() {
    return localStorage.getItem(AppConstants.lSToken) !== null
  }

  isUserIDPresent() {
    return localStorage.getItem(AppConstants.lSUserID) !== null
  }

  checkAuthDataORRedirect() {
    if (!this.isTokenPresent() || !this.isUserIDPresent()) {
      this.router.navigate(['/forbiddenarea'])
    }
  }

  getErrorNotTokenObservable<X>() {
    return this.getErrorNotElementObservable<X>("Token not present")
  }

  getErrorNotUserIDObservable<X>() {
    return this.getErrorNotElementObservable<X>("UserID not present")
  }

  getErrorWrongTokenObservable<X>() {
    return this.getErrorNotElementObservable<X>("Token not valid")
  }

  private buildAuthorizationToken(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }

  getHeaderBearerToken(): HttpHeaders {
    let token = localStorage.getItem(AppConstants.lSToken)
    // @ts-ignore
    return this.buildAuthorizationToken(token)
  }

  private getErrorNotElementObservable<X>(message: string) {
    return new Observable<X>(obs => {
      obs.error({
        status: 403,
        message: message
      })
    })
  }

}
