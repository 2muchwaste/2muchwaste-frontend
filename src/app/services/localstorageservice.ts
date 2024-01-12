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

  setUserID(userID: string): void {
    localStorage.setItem(this.USER_ID_KEY, userID)
  }

  getUserID(): string | null {
    return localStorage.getItem(this.USER_ID_KEY)
  }

  setUserToken(userToken: string): void {
    localStorage.setItem(this.USER_TOKEN_KEY, userToken)
  }

  getUserToken(): string | null {
    return localStorage.getItem(this.USER_TOKEN_KEY)
  }

  setUserRole(userRole: WebsiteRole) {
    localStorage.setItem(this.USER_ROLE, userRole)
  }

  getUserRole() {
    return localStorage.getItem(this.USER_ROLE)
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
  }
}
