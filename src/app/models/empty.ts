import {TrashTypes} from "./trashtype";

export class Empty {
  constructor(
    public userID: string,
    public dumpsterID: string,
    public date: Date,
    public type: TrashTypes,
    public quantity: number,
  ) {
  }
}

export enum EmptyStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
}
