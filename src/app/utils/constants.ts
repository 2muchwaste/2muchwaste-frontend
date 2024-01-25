export class AppConstants {
  /**
   * Key for local storage to set and get user ID logged
   */
  static readonly lSUserID = "userid"
  /**
   * Key for local storage to set and get user role
   */
  static readonly lSuserRole = "role"
  /**
   * Key for local storage to set and get logged user's token
   */
  static readonly lSToken = "token"
  /**
   * Key for local storage to set and get user object
   */
  static readonly userObject = 'userObject'
  /**
   * Key for local storage to set and get user cf
   */
  static readonly lSuserCF = "userCF"
  /**
   * Key for role name customer
   */
  static readonly customerRoleName = "customer"
  /**
   * Key for role name operator
   */
  static readonly operatorRoleName = "operator"
  /**
   * Key for role name admin
   */
  static readonly adminRoleName = "admin"

  public static get serverURL(): string {
    return "http://localhost:3456"
  }

  public static get versionBackend(): string {
    return "/api/v1/"
  }
}
