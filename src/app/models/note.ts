export class Note {
  constructor(
    public id: string,
    public date: Date,
    public email: string,
    public isRead: boolean,
    public text: string,
    public type: string,
  ) {
  }
}
