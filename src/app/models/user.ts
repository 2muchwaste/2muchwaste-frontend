export class User {
  constructor(
    public name: string,
    public surname: string,
    public birthday: string,
    public cf: string,
    public email: string,
    public address: string,
    public zipCode: number,
    public city: string,
    public role: string,
    public password: string,
  ) {
  }
}
