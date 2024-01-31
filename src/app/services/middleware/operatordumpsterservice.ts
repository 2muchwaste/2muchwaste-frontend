import {Injectable} from "@angular/core";
import {OperatorService} from "../backendcalls/operatorservice";
import {HttpRequestService} from "../backendcalls/httprequestservice";
import {DumpsterService} from "../backendcalls/dumpsterservice";
import {Observable} from "rxjs";
import { TrashTypes, TrashTypeManager } from "src/app/models/trashtype";
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
        next: (res) => {
          let empties: Empty[] = []
          res.empties.forEach(empty => {
            this.dumpsterService.getDumpsterByID(empty.dumpsterID).subscribe({
              next: (res) => {
                empties.push({
                  // @ts-ignore
                  userID: this.lStorageService.getUserID(),
                  dumpster: res,
                  date: new Date(empty.date),
                  type: empty.type,
                  quantity: 0
                })
              }
            })
          })
          obs.next(empties)
        }
      })
    })
  }
}
