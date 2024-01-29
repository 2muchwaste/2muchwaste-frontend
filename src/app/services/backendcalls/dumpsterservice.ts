import {Injectable} from '@angular/core'
import {AppConstants} from "../../utils/constants"
import {Observable} from "rxjs"
import {Dumpster} from "../../models/dumpster"
import {Authorizationservice} from "./authorizationservice"
import {HttpRequestService} from "./httprequestservice"
import {LocalStorageService} from "../localstorageservice"
import {GeoUtils} from "../../utils/geoutils";

@Injectable({
  providedIn: 'root',
})
export class DumpsterService {

  private backendDumpsterURL = AppConstants.serverURL + AppConstants.versionBackend + 'dumpsters/'
  public dumpster!: Dumpster

  constructor(
    private authService: Authorizationservice,
    private httpRequestService: HttpRequestService,
    private lStorageService: LocalStorageService
  ) {
  }

  getDumpsters(): Observable<Dumpster[]> {
    return this.getDumpstersInfo('')
  }

  getNearDumpsters(userPosition: {coords: {latitude: number,longitude: number}}){
    return new Observable<{ dumpster: Dumpster, distance: number }[]>(obs=>{
      this.getDumpsters().subscribe({
        next:(response)=>{
          let dumpsterAndDistance: { dumpster: Dumpster, distance: number }[] = []
          response.sort((p1, p2) => {
            let x = {coords: {latitude: p1.latitude, longitude: p1.longitude}}
            let y = {coords: {latitude: p2.latitude, longitude: p2.longitude}}
            return GeoUtils.getDistanceFromTwoPoints(userPosition, x) - GeoUtils.getDistanceFromTwoPoints(userPosition, y)
          }).forEach(d => {
            dumpsterAndDistance.push({
              dumpster: d,
              distance: (GeoUtils.getDistanceFromTwoPoints(userPosition, {
                coords: {
                  latitude: d.latitude,
                  longitude: d.longitude
                }
              }))
            })
          })
          obs.next(dumpsterAndDistance)
        }
      })
    })
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
