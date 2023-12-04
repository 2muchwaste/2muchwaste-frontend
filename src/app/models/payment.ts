export class Payment {
  constructor(
    public _id: string,
    public userID: string,
    public invoiceIssueDate: Date,
    public value: number,
    public status: string,
    public paymentDate: Date
  ) {
  }
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
}

export class PaymentStatusManager{
  private paymentStatus : Map<string,PaymentStatus> = new Map()
  public static status : Map<PaymentStatus,{englishName: string,italianName: string}> = new Map()

  constructor() {
    PaymentStatusManager.status.set(PaymentStatus.PENDING, {englishName: PaymentStatus.PENDING,italianName:'Non contabilizzato'})
    PaymentStatusManager.status.set(PaymentStatus.COMPLETE, {englishName: PaymentStatus.COMPLETE,italianName:'Completato'})
    // this.paymentStatus.set(PaymentStatus.COMPLETE, {englishName: PaymentStatus.COMPLETE,italianName:'Completato'})
  }
}
