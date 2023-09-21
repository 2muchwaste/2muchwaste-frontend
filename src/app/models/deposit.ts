export class Deposit {
  constructor(
    public userID: string,
    public dumpsterID: string,
    public date: Date,
    public type: string,
    public quantity: number,
    public price: number,
    public openingTimeSeconds: number,
  ) {
    // this.date = new Date(date)
  }
}
