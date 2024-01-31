import {Injectable} from "@angular/core";
import {OperatorService} from "../backendcalls/operatorservice";
import {HttpRequestService} from "../backendcalls/httprequestservice";
import {DumpsterService} from "../backendcalls/dumpsterservice";
import {Observable} from "rxjs";
import {Empty} from "../../models/empty";
import {LocalStorageService} from "../localstorageservice";

@Injectable({
  providedIn: 'root',
})
export class OperatorDumpsterService extends OperatorService {
  constructor(
    private httpR: HttpRequestService,
    private lStorageService: LocalStorageService,
    private dumpsterService: DumpsterService) {
    super(httpR);
  }

  public getEmptiesWithSpecificDumpsterByCF(operatorCF: string) {
    return new Observable<Empty[]>(obs => {
      this.getOperatorEmptiesByCFRaw(operatorCF).subscribe({
        next: (emptyServerResponse) => {
          let empties: Empty[] = []
          let len = 0
          emptyServerResponse.empties.forEach(empty => {
            this.dumpsterService.getDumpsterByID(empty.dumpsterID).subscribe({
              next: (res) => {
                empties.push({
                  // @ts-ignore
                  userID: this.lStorageService.getUserID(),
                  dumpster: res,
                  date: new Date(empty.date),
                  quantity: 0
                })
                len = len + 1
                if (len >= emptyServerResponse.empties.length){
                  obs.next(empties)
                }
              }
            })
          })
          // obs.next(empties)
        }
      })
    })
  }

  public getEmptiesSortedByDate(operatorCF: string) {
    return new Observable<Empty[]>(obs => {
      this.getEmptiesWithSpecificDumpsterByCF(operatorCF).subscribe({
        next: (res) => {
          let sortedEmpties = res.sort((emp1, emp2) => emp2.date.getTime() - emp1.date.getTime())
          obs.next(sortedEmpties)
        }
      })
    })
  }
}
