export class AppConstants{
  static localStorageUserID = "UserID"
  static localStorageToken = 'token';
  public static get serverURL(): string { return "http://localhost:3456"}
  public static get versionBackend(): string {return "/api/v1/"}
}
