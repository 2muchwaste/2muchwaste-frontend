export class AppConstants {
  /**
   * Key for local storage to set and get user ID logged
   */
  static lSUserID = "userid"
  /**
   * Key for local storage to set and get user role
   */
  static lSuserRole = "role"
  /**
   * Key for local storage to set and get logged user's token
   */
  static lSToken = "token"
  /**
   * Key for local storage to set and get user object
   */
  static userObject = 'userObject'
  /**
   * Key for local storage to set and get user cf
   */
  static lSuserCF = "userCF"

  public static get serverURL(): string {
    return "http://localhost:3456"
  }

  public static get versionBackend(): string {
    return "/api/v1/"
  }
}
