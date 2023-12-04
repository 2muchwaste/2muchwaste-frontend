import {TrashTypes} from "./trashtype";

export class Deposit {
  constructor(
    public userID: string,
    public dumpsterID: string,
    public date: Date,
    public type: TrashTypes,
    public quantity: number,
    public price: number,
    public openingTimeSeconds: number,
  ) {
  }
}
