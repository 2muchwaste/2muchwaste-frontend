export class UserNotification {
  constructor(
    public _id: string,
    public date: Date,
    public read: Boolean,
    public text: String
  ) {
  }
}
