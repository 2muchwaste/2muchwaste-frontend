import {User} from "./user";

export class UserResponse extends User {
  constructor(
    public _id:string,
    public __t:string,
    public notifications: [],
    public __v:number,
    user: User
  ){
    super(
      user.name,
      user.surname,
      user.birthday,
      user.cf,
      user.email,
      user.address,
      user.zipCode,
      user.city,
      user.role,
      user.password);
  }
}
