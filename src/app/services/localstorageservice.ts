import {Injectable} from '@angular/core'
import {AppConstants} from "../utils/constants"
import {WebsiteRole} from "../models/role";

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly USER_ID_KEY = AppConstants.lSUserID
  private readonly USER_TOKEN_KEY = AppConstants.lSToken
  private readonly USER_OBJECT_KEY = AppConstants.userObject
  private readonly USER_ROLE = AppConstants.lSuserRole
  private readonly USER_CF_KEY = AppConstants.lSuserCF

  setUserID(userID: string): void {
    localStorage.setItem(this.USER_ID_KEY, userID)
  }

  getUserID(): string | null {
    return localStorage.getItem(this.USER_ID_KEY)
  }

  setUserCF(userCF: string): void {
    localStorage.setItem(this.USER_CF_KEY, userCF)
  }

  getUserCF(): string | null {
    return localStorage.getItem(this.USER_CF_KEY)
  }

  setUserToken(userToken: string): void {
    localStorage.setItem(this.USER_TOKEN_KEY, userToken)
  }

  getUserToken(): string | null {
    return localStorage.getItem(this.USER_TOKEN_KEY)
  }

  setUserRoleName(userRole: string) {
    localStorage.setItem(this.USER_ROLE, userRole)
  }

  getUserRoleName() {
    return localStorage.getItem(this.USER_ROLE)
  }

  setRoleCustomerCode(roleCode: string) {
    localStorage.setItem(AppConstants.customerRoleName, roleCode)
  }

  setRoleOperatorCode(roleCode: string) {
    localStorage.setItem(AppConstants.operatorRoleName, roleCode)
  }

  setRoleAdminCode(roleCode: string) {
    localStorage.setItem(AppConstants.adminRoleName, roleCode)
  }

  getRoleCustomerCode() {
    return localStorage.getItem(AppConstants.customerRoleName)
  }

  getRoleOperatorCode() {
    return localStorage.getItem(AppConstants.operatorRoleName)
  }

  getRoleAdminCode() {
    return localStorage.getItem(AppConstants.adminRoleName)
  }

  setUserObject(userObject: any): void {
    // Assuming userObject is a JSON-serializable object
    const serializedObject = JSON.stringify(userObject)
    localStorage.setItem(this.USER_OBJECT_KEY, serializedObject)
  }

  getUserObject(): any | null {
    const serializedObject = localStorage.getItem(this.USER_OBJECT_KEY)
    return serializedObject ? JSON.parse(serializedObject) : null
  }

  clearLocalStorage(): void {
    localStorage.removeItem(this.USER_ID_KEY)
    localStorage.removeItem(this.USER_TOKEN_KEY)
    localStorage.removeItem(this.USER_OBJECT_KEY)
    localStorage.removeItem(this.USER_ROLE)
    localStorage.removeItem(this.USER_CF_KEY)
  }
}
