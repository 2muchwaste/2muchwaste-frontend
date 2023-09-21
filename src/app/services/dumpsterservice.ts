import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConstants} from "../utils/constants";
import {Observable, Subscriber} from "rxjs";
import {Dumpster} from "../models/dumpster";
import {AuthenticationService} from "./authenticationservice";
import {HttpRequestService} from "./httprequestservice";

@Injectable({
  providedIn: 'root',
})
export class DumpsterService {

  private backendDumpsterURL = AppConstants.serverURL + AppConstants.versionBackend + 'dumpsters/'

  constructor(
    // private http: HttpClient,
    private authService: AuthenticationService,
    private httpRequestService: HttpRequestService
  ) {
  }

  getDumpsters(): Observable<Dumpster[]> {
    return this.getDumpstersInfo('')
  }

  // kk
  getDumpsterByID(dumpsterID: string): Observable<Dumpster> {
    return this.getDumpstersInfo(dumpsterID)
  }


  // Da valutare perché vengono ritornate cose diverse in caso positivo e in caso negativo

  // getDumpsterAvailability(dumpsterID: string){
  //   return this.getDumpstersInfo(dumpsterID + '/availability')
  // }

  // Stesso discorso
  // getActualWeight(dumpsterID: string){
  //   return this.getDumpstersInfo(dumpsterID + '/actualweight')
  // }

  createDumpster(dumpster: Dumpster) {
    return this.postDumpsterInfo('', dumpster)
  }

  setDumpsterAvailability(dumpsterID: string, availability: boolean) {
    return this.patchDumpsterInfo(dumpsterID + '/availability', {available: availability})
  }

  setDumpsterWeight(dumpsterID: string, weight: number) {
    return this.patchDumpsterInfo(dumpsterID + '/weight', {weight: weight})
  }

  /**
   * Not return any error if delete successfully
   *
   * @param dumpsterID
   */
  deleteDumpster(dumpsterID:string){
    return this.deleteDumpsterInfo(dumpsterID)
  }

  private getDumpstersInfo<X>(information: string): Observable<X> {
    // @ts-ignore
    return this.makeSafeRequest<X>((info) =>
      this.httpRequestService.getRequest<X>(info), information);
  }

  private postDumpsterInfo<X>(information: string, objectForPost: X): Observable<X> {
    return this.makeSafeRequest<X>((information, elementForPost) =>
      this.httpRequestService.postRequest<X>(information, elementForPost), information, objectForPost)
  }

  private patchDumpsterInfo<X>(information: string, objectForPatch: X): Observable<any> {
    return this.makeSafeRequest((information, elementForPatch) =>
      this.httpRequestService.patchRequest(information, elementForPatch), information, objectForPatch)
  }
  private deleteDumpsterInfo(information: string) {
    // @ts-ignore
    return this.makeSafeRequest((information) =>
      this.httpRequestService.deleteRequest(information),information)
  }

  private makeSafeRequest<X>(
    callback: (information: string, object: X) => Observable<X>,
    information: string,
    object: X
  ): Observable<X> {
    if (this.authService.isTokenPresent() && this.authService.isUserIDPresent()) {
      return callback(this.backendDumpsterURL + information, object)
    } else if (!this.authService.isTokenPresent()) {
      return this.authService.getErrorNotTokenObservable()
    } else {
      return this.authService.getErrorNotUserIDObservable()
    }
  }





// createDumpster


}
