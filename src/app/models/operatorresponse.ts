import {User, UserBuilder} from "./user";
import { OperatorNotification } from "./operatornotification";
import { EmptyServerResponse } from "./emptyserverresponse";

export class OperatorResponse extends User {
  constructor(
    public _id: string,
    public __t: string,
    public notifications: OperatorNotification[],
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

export class OperatorResponseBuilder {
  private _id: string = "";
  private __t: string = "";
  private notifications: [] = [];
  private empties: [] = [];
  private __v: number = 0;
  private user: User = new UserBuilder().build()

  setId(id: string): OperatorResponseBuilder {
    this._id = id;
    return this;
  }

  setT(t: string): OperatorResponseBuilder {
    this.__t = t;
    return this;
  }

  setNotifications(notifications: []): OperatorResponseBuilder {
    this.notifications = notifications;
    return this;
  }

  setEmpties(empties: []): OperatorResponseBuilder {
    this.empties = empties;
    return this;
  }

  setV(v: number): OperatorResponseBuilder {
    this.__v = v;
    return this;
  }

  setUser(user: User): OperatorResponseBuilder {
    this.user = user;
    return this;
  }

  build(): OperatorResponse {
    return new OperatorResponse(this._id, this.__t, this.notifications, this.empties, this.__v, this.user);
  }
}
