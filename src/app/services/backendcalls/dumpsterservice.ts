import {Injectable} from '@angular/core'
import {AppConstants} from "../../utils/constants"
import {Observable} from "rxjs"
import {Dumpster} from "../../models/dumpster"
import {Authorizationservice} from "./authorizationservice"
import {HttpRequestService} from "./httprequestservice"
import {LocalStorageService} from "../localstorageservice"

@Injectable({
  providedIn: 'root',
})
export class DumpsterService {

  private backendDumpsterURL = AppConstants.serverURL + AppConstants.versionBackend + 'dumpsters/'

  constructor(
    // private http: HttpClient,
    private authService: Authorizationservice,
    private httpRequestService: HttpRequestService,
    private lStorageService: LocalStorageService
  ) {
  }

  getDumpsters(): Observable<Dumpster[]> {
    return this.getDumpstersInfo('')
  }

  getDumpsterByID(dumpsterID: string): Observable<Dumpster> {
    return this.getDumpstersInfo(dumpsterID)
  }

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
  deleteDumpster(dumpsterID: string) {
    return this.deleteDumpsterInfo(dumpsterID)
  }

  private getDumpstersInfo<X>(information: string): Observable<X> {
    // @ts-ignore
    return this.makeSafeRequest<X>((info) =>
      this.httpRequestService.getRequest<X>(info), information)
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
      this.httpRequestService.deleteRequest(information), information)
  }

  private makeSafeRequest<X>(
    callback: (information: string, object: X) => Observable<X>,
    information: string,
    object: X
  ): Observable<X> {
    if (this.lStorageService.getUserToken() && this.lStorageService.getUserID()) {
      return callback(this.backendDumpsterURL + information, object)
    } else if (!this.lStorageService.getUserToken()) {
      return this.authService.getErrorNotTokenObservable()
    } else {
      return this.authService.getErrorNotUserIDObservable()
    }
  }

}
