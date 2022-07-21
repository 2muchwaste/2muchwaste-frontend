export class User {
  constructor(
    public name: string,
    public surname: string,
    public birthday: Date,
    public cf: string,
    public email: string,
    public address: string,
    public zipcode: string,
    public city: string,
    public role: string,
    public passwordHash: string,
    public passwordSalt: string
  ) {
  }
}
