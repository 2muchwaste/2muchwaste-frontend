import {DumpsterErrorType} from "./dumpstererrortype";

export class OperatorNotification {
  constructor(
    public _id: string,
    public type: DumpsterErrorType,
    public status: OperatorNotification,
    public dumpsterID: string,
    public __v: 0
  ) {
  }
}

export enum OperatorNotificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETE = 'complete',
}
