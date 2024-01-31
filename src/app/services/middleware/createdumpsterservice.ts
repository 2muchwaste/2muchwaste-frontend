import {Injectable} from "@angular/core";
import {OperatorService} from "../backendcalls/operatorservice";
import {HttpRequestService} from "../backendcalls/httprequestservice";
import {DumpsterService} from "../backendcalls/dumpsterservice";
import {Observable} from "rxjs";
import {Empty} from "../../models/empty";
import {LocalStorageService} from "../localstorageservice";
import {Dumpster} from "../../models/dumpster";
import {UserInformationService} from "../userinformationservice";

@Injectable({
  providedIn: 'root',
})
export class CreateDumpsterService {
  private readonly CLASS_TAG = "CreateDumpsterService"
  public dumpster!: Dumpster

  constructor(
    private httpR: HttpRequestService,
    private lStorageService: LocalStorageService,
    private dumpsterService: DumpsterService,
    private userService: UserInformationService,
  ) {

  }

  createDumpster(dumpster: any) {
    return new Observable<any>(obs => {
      this.dumpsterService.createDumpster(
        dumpster
      ).subscribe({
        next: (res) => {
          obs.next(res)
        }
      })
    })
  }

}
