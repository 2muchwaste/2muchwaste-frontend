import {Injectable} from "@angular/core";
import {OperatorService} from "../backendcalls/operatorservice";
import {HttpRequestService} from "../backendcalls/httprequestservice";
import {DumpsterService} from "../backendcalls/dumpsterservice";
import {Observable} from "rxjs";
import {Empty} from "../../models/empty";
import {LocalStorageService} from "../localstorageservice";
import {Dumpster} from "../../models/dumpster";
import {DepositService} from "../backendcalls/depositservice";
import {UserInformationService} from "../userinformationservice";
import {Deposit} from "../../models/deposit";

@Injectable({
  providedIn: 'root',
})
export class CreateDepositService {
  private readonly CLASS_TAG = "CreateDepositService"
  public dumpster!: Dumpster

  constructor(
    private httpR: HttpRequestService,
    private lStorageService: LocalStorageService,
    private dumpsterService: DumpsterService,
    private depositService: DepositService,
    private userService: UserInformationService,
  ) {

  }

  createDeposit(quantity: number, time: number) {
    console.log(this.CLASS_TAG + ": this.dumpster._id", this.dumpster._id)
    return new Observable<Deposit>(obs => {
      this.depositService.createDeposit(
        quantity, time, this.dumpster._id, this.userService.user._id
      ).subscribe({
        next: (res) => {
          obs.next(res)
        }
      })
    })
  }

  // public getEmptiesWithSpecificDumpsterByCF(operatorCF: string) {
  //   return new Observable<Empty[]>(obs => {
  //     this.getOperatorEmptiesByCFRaw(operatorCF).subscribe({
  //       next: (res) => {
  //         let empties: Empty[] = []
  //         res.empties.forEach(empty => {
  //           this.dumpsterService.getDumpsterByID(empty.dumpsterID).subscribe({
  //             next: (res) => {
  //               empties.push({
  //                 // @ts-ignore
  //                 userID: this.lStorageService.getUserID(),
  //                 dumpster: res,
  //                 date: new Date(empty.date),
  //                 quantity: 0
  //               })
  //             }
  //           })
  //         })
  //         obs.next(empties)
  //       }
  //     })
  //   })

}
