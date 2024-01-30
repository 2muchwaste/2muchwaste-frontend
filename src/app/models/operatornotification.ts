import {DumpsterErrorType} from "./dumpstererrortype";
import {Dumpster} from "./dumpster";

export class OperatorNotification {
  constructor(
    public _id: string,
    public date: Date,
    public read: Boolean,
    public type: DumpsterErrorType,
    public status: OperatorNotificationStatus,
    public dumpsterID: string,
    public text: String,
    public __v: 0
  ) {
  }
}


export class OperatorNotificationAndDumpster{
  constructor(
    public operatorNotification: OperatorNotification,
    public dumpster: Dumpster
  ) {
  }
}

export enum OperatorNotificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETE = 'complete',
}

export class OperatorNotificationStatusManager{
  public typeItalianName: Map<OperatorNotificationStatus,string> = new Map()

  constructor() {
    this.typeItalianName.set(OperatorNotificationStatus.PENDING, "In attesa")
    this.typeItalianName.set(OperatorNotificationStatus.IN_PROGRESS, "Presa in carico")
    this.typeItalianName.set(OperatorNotificationStatus.COMPLETE, "Sistemata")
  }

  public getItalianStatus(type:OperatorNotificationStatus){
    return this.typeItalianName.get(type)
  }
}
