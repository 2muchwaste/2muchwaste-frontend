import {Injectable} from '@angular/core'
import {AppConstants} from "../utils/constants"

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly USER_ID_KEY = AppConstants.lSUserID
  private readonly USER_TOKEN_KEY = AppConstants.lSToken
  private readonly USER_OBJECT_KEY = AppConstants.userObject
  private readonly USER_ROLE = AppConstants.lSuserRole

  setUserID(userID: string): void {
    sessionStorage.setItem(this.USER_ID_KEY, userID)
  }

  getUserID(): string | null {
    return sessionStorage.getItem(this.USER_ID_KEY)
  }

  setUserToken(userToken: string): void {
    sessionStorage.setItem(this.USER_TOKEN_KEY, userToken)
  }

  getUserToken(): string | null {
    return sessionStorage.getItem(this.USER_TOKEN_KEY)
  }

  setUserObject(userObject: any): void {
    // Assuming userObject is a JSON-serializable object
    const serializedObject = JSON.stringify(userObject)
    sessionStorage.setItem(this.USER_OBJECT_KEY, serializedObject)
  }

  getUserObject(): any | null {
    const serializedObject = sessionStorage.getItem(this.USER_OBJECT_KEY)
    return serializedObject ? JSON.parse(serializedObject) : null
  }

  clearLocalStorage(): void {
    sessionStorage.removeItem(this.USER_ID_KEY)
    sessionStorage.removeItem(this.USER_TOKEN_KEY)
    sessionStorage.removeItem(this.USER_OBJECT_KEY)
    sessionStorage.removeItem(this.USER_ROLE)
  }
}
