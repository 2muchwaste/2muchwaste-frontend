import {AppConstants} from "../../utils/constants";
import {HttpRequestService} from "./httprequestservice";
import {Injectable} from "@angular/core";
import {RoleResponse} from "../../models/roleresponse";
import {InvalidRoleError, WebsiteRole} from "../../models/role";
import {LocalStorageService} from "../localstorageservice";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly CLASS_TAG = "RoleService"
  private backendRoleURL = AppConstants.serverURL + AppConstants.versionBackend + 'roles/'

  constructor(
    private httpReqService: HttpRequestService,
    private lStorageService: LocalStorageService,
  ) {
  }

  getRoles() {
    return this.httpReqService.getRequest<RoleResponse[]>(this.backendRoleURL)
  }

  setRoles() {
    this.getRoles().subscribe({
      next: (res) => {
        res.forEach(role => {
          switch (role.name) {
            case AppConstants.adminRoleName:
              this.lStorageService.setRoleAdminCode(role._id)
              return
            case AppConstants.operatorRoleName:
              this.lStorageService.setRoleOperatorCode(role._id)
              return
            case AppConstants.customerRoleName:
              this.lStorageService.setRoleCustomerCode(role._id)
              return
          }
        })
      }
    })
  }

  public getAdminCode(): string {
    // @ts-ignore
    return this.lStorageService.getRoleAdminCode()
  }

  public getOperatorCode(): string {
    // @ts-ignore
    return this.lStorageService.getRoleOperatorCode()
  }

  public getCustomerCode(): string {
    // @ts-ignore
    return this.lStorageService.getRoleCustomerCode()
  }

  public getAdminName(): string {
    return AppConstants.adminRoleName
  }

  public getOperatorName(): string {
    return AppConstants.operatorRoleName
  }

  public getCustomerName(): string {
    return AppConstants.customerRoleName
  }

}
