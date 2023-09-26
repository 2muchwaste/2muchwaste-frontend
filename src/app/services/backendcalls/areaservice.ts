import {Injectable} from "@angular/core";
import {HttpRequestService} from "./httprequestservice";
import {AppConstants} from "../../utils/constants";
import {District} from "../../models/district";

@Injectable({
  providedIn: 'root'
})
export class Areaservice {
  private backendAreaURL = AppConstants.serverURL + AppConstants.versionBackend + 'areas/';

  constructor(
    private httpRequestService: HttpRequestService
  ) {
  }

  getAreas() {
    return this.httpRequestService.getRequest<District[]>(this.backendAreaURL)
  }

  getDistrictsFromZipCode(zipCode: number) {
    return this.httpRequestService.getRequest<District[]>(this.backendAreaURL + zipCode)
  }

  getStreetsDistrictFromZipCodeAndName(zipCode: number, districtName: string) {
    return this.httpRequestService.getRequest<{ streets: string[] }>(this.backendAreaURL + zipCode + '/' + districtName)
  }

  addStreetToArea(zipCode: number, area: string, streetName: string) {
    return this.httpRequestService.postRequest<District>(
      this.backendAreaURL + zipCode + '/' + area,
      {street: streetName}
    )
  }

  createDistrict(zipCode: number, areaName: string, streets: string[]) {
    return this.httpRequestService.postRequest<District>(
      this.backendAreaURL,
      new District(areaName, streets, zipCode)
    )
  }
}
