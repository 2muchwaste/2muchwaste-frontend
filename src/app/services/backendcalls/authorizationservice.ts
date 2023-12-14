import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {HttpHeaders} from "@angular/common/http";
import {AppConstants} from "../../utils/constants";
import {LocalStorageService} from "../localstorageservice";

@Injectable({
  providedIn: 'root',
})
export class Authorizationservice {
  constructor(
    private router: Router,
    private lStorageService: LocalStorageService
  ) {
  }

  checkAuthDataORRedirect() {
    if (!this.lStorageService.getUserToken() || !this.lStorageService.getUserID()) {
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
    let token = this.lStorageService.getUserToken()
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
