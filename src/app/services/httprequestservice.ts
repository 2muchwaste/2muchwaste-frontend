import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, Subscriber} from "rxjs";
import {AuthenticationService} from "./authenticationservice";

@Injectable({
  providedIn: 'root',
})
export class HttpRequestService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService) {
  }

  public getRequest<X>(information: string) {
    let headers = this.authService.getHeaderBearerToken()
    return new Observable<X>(obs => {
      this.http.get<X>(information, {headers})
        .pipe()
        .subscribe(this.getObserver(obs))
    });
  }

  public postRequest<X>(information: string, object: any) {
    let headers = this.authService.getHeaderBearerToken()
    return new Observable<X>(obs => {
      this.http.post<X>(information, object, {headers})
        .pipe()
        .subscribe(this.getObserver(obs))
    });
  }

  public patchRequest<X>(information: string, object: any) {
    let headers = this.authService.getHeaderBearerToken()
    return new Observable<X>(obs => {
      this.http.patch<X>(information, object, {headers})
        .pipe()
        .subscribe(this.getObserver(obs))
    })
  }

  public deleteRequest(information: string) {
    let headers = this.authService.getHeaderBearerToken()
    return new Observable(obs => {
      this.http.delete(information, {headers})
        .pipe()
        .subscribe(this.getObserver(obs))
    })
  }

  private getObserver<X>(obs: Subscriber<X>) {
    return {
      next: this.getNext(obs),
      error: (error: any) => {
        obs.error(error)
      }
    };
  }

  private getNext<X>(obs: Subscriber<X>) {
    return (response: X) => {
      obs.next(response)
    };
  }

  
}
