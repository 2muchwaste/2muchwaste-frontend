export class Payment {
  constructor(
    public _id: string,
    public userID: string,
    public invoiceIssueDate: Date,
    public value: number,
    public status: string,
    public paymentDate: Date
  ) {}
}
