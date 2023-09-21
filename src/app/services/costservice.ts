import {Injectable} from "@angular/core";
import {HttpRequestService} from "./httprequestservice";
import {AppConstants} from "../utils/constants";
import {Cost} from "../models/cost";

@Injectable({
  providedIn: 'root'
})
export class CostService {
  private backendCostURL = AppConstants.serverURL + AppConstants.versionBackend + 'costs/';


  constructor(
    private httpReqService: HttpRequestService
  ) {
  }

  addPrice(wasteType: string, pricePerKilogram: number) {
    return this.httpReqService.postRequest(
      this.backendCostURL,
      new Cost(wasteType, pricePerKilogram)
    )
  }

  getCosts() {
    return this.httpReqService.getRequest<Cost>(this.backendCostURL)
  }

  getPrice(typeOfWaste: string) {
    return this.httpReqService.getRequest<{ pricePerKilogram: number }>(this.backendCostURL + typeOfWaste)
  }

  updatePrice(typeOfWaste: string, pricePerKilogram: number) {
    return this.httpReqService.patchRequest<Cost>(
      this.backendCostURL + typeOfWaste,
      {pricePerKilogram: pricePerKilogram}
    )
  }

  deletePrice(wasteType: string) {
    return this.httpReqService.deleteRequest(this.backendCostURL + wasteType)
  }
}
