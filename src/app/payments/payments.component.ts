import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core'
import {UserInformationService} from "../services/userinformationservice"
import {PaymentService} from "../services/backendcalls/paymentservice"
import {UserResponse} from "../models/userresponse"
import {DepositService} from "../services/backendcalls/depositservice"
import {Deposit} from "../models/deposit"
import {Subscription} from "rxjs"
import {PageEvent} from "@angular/material/paginator"
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog"
import {PaymentStatus} from "../models/payment"
import {Authorizationservice} from "../services/backendcalls/authorizationservice"

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {
  private userDeposits!: Deposit[]
  private userSetSubscription!: Subscription
  public totalDebit!: number
  public totalAlreadyPaid!: number
  public lowValue = 0
  public highValue = 10

  constructor(
    private matDialog: MatDialog,
    private authorizationService: Authorizationservice,
    private depositsService: DepositService,
    private paymentsService: PaymentService,
    public userInfoService: UserInformationService,
  ) {
  }

  ngOnInit(): void {
    this.authorizationService.checkAuthDataORRedirect()
    this.userSetSubscription = this.userInfoService.userSetObservable.subscribe({
      next: (res) => {
        this.setPayments(res)
        this.setDeposits(res)
      }
    })
    if (this.userInfoService.user) {
      this.setPayments(this.userInfoService.user)
      this.setDeposits(this.userInfoService.user)
    }
  }

  ngOnDestroy(): void {
    this.userSetSubscription.unsubscribe()
  }

  private setPayments(userResponse: UserResponse) {
    this.paymentsService.getPayments().subscribe({
      next: (res) => {
        this.userInfoService.payments = res.filter(p => p.userID === this.userInfoService.user._id)
        console.log("this.userInfoService.payments", this.userInfoService.payments)
        this.totalAlreadyPaid = this.userInfoService.payments
          .filter(p => p.status === PaymentStatus.COMPLETE)
          .map(p => p.value)
          .reduce((a, b) => a + b, 0)
        console.log("this.totalAlreadyPaid", this.totalAlreadyPaid)
        console.log(this.userInfoService)
      }
    })
  }

  private setDeposits(userResponse: UserResponse) {
    this.depositsService.getDepositsFromUser(userResponse._id).subscribe({
      next: (res) => {
        this.userDeposits = res
        this.totalDebit = this.userDeposits.map(d => d.price).reduce((a, b) => a + b, 0)
        console.log(this.userInfoService.payments)
      },
      error: (err) => {
      }
    })
  }

  getPaginatorData(event: PageEvent) {
    this.lowValue = event.pageIndex * event.pageSize
    this.highValue = this.lowValue + event.pageSize
    return event
  }

  payDebit(amountToPay: number) {
    amountToPay = Math.round(amountToPay * 100) / 100
    let dialogRef = this.matDialog.open(PaymentDialogComponent, {
      data: {
        amountToPay: amountToPay
      }
    })
    let sub = dialogRef.componentInstance.paymentFinished.subscribe(() => {
      console.log("Reloading bro")
      this.setPayments(this.userInfoService.user)
      this.setDeposits(this.userInfoService.user)
    })
    dialogRef.afterClosed().subscribe(() => sub.unsubscribe())
  }
}

@Component({
  selector: 'app-payment',
  templateUrl: './payments-dialog.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentDialogComponent {

  public title: string
  public message: string
  public amountToPay: number
  @Output() paymentFinished = new EventEmitter<boolean>()
  justStart = true
  paymentLoading = false
  paymentDone = false
  paymentError = false

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: any,
    private paymentService: PaymentService,
    private userInfoService: UserInformationService
  ) {
    this.title = "Pagamento"
    this.amountToPay = injectedData.amountToPay
    this.message = `Stai per effettuare un pagamento di ${this.amountToPay.toFixed(2)}€, sicurƏ di volere procedere?`
  }

  pay() {
    this.justStart = false
    this.message = ""
    this.title = "Pagamento in corso"
    this.paymentLoading = true
    setTimeout(() => {
      this.paymentService.createPayment(this.userInfoService.user._id, new Date(), this.amountToPay).subscribe({
        next: (res) => {
          // @ts-ignore
          if (res.errors) {
            console.log("Payment not ok")
            this.paymentError = true
          } else {
            console.log("Emitting payment finished")
            this.paymentFinished.emit(true)

            console.log("Payment ok", res)
            this.paymentDone = true
            this.title = `Pagamento avvenuto con successo`
          }
          this.paymentLoading = false
        }
      })
    }, 3000)
  }
}
