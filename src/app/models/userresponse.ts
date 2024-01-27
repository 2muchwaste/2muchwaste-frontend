import {User, UserBuilder} from "./user";
import {UserNotification} from "./UserNotification";
import { OperatorNotification } from "./operatornotification";
import { EmptyServerResponse } from "./emptyserverresponse";

export class UserResponse extends User {
  constructor(
    public _id: string,
    public __t: string,
    public notifications: UserNotification[],
    public empties: [] = [],
    public __v: number,
    user: User
  ) {
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
      user.password
    );
  }
}

export class UserResponseBuilder {
  private _id: string = "";
  private __t: string = "";
  private notifications: [] = [];
  private empties: [] = [];
  private __v: number = 0;
  private user: User = new UserBuilder().build()

  setId(id: string): UserResponseBuilder {
    this._id = id;
    return this;
  }

  setT(t: string): UserResponseBuilder {
    this.__t = t;
    return this;
  }

  setNotifications(notifications: []): UserResponseBuilder {
    this.notifications = notifications;
    return this;
  }

  setEmpties(empties: []): UserResponseBuilder {
    this.empties = empties;
    return this;
  }

  setV(v: number): UserResponseBuilder {
    this.__v = v;
    return this;
  }

  setUser(user: User): UserResponseBuilder {
    this.user = user;
    return this;
  }

  build(): UserResponse {
    return new UserResponse(this._id, this.__t, this.notifications, this.empties, this.__v, this.user);
  }
}
