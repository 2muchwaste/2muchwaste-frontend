import {DumpsterErrorType} from "./dumpstererrortype";

export class OperatorNotification {
  constructor(
    public _id: string,
    public date: Date,
    public read: Boolean,
    public type: DumpsterErrorType,
    public status: OperatorNotification,
    public dumpsterID: string,
    public text: String,
    public __v: 0
  ) {
  }
}

export enum OperatorNotificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETE = 'complete',
}
