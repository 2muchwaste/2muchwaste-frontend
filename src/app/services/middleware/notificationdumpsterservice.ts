import {Injectable} from "@angular/core";
import {HttpRequestService} from "../backendcalls/httprequestservice";
import {DumpsterService} from "../backendcalls/dumpsterservice";
import {Observable} from "rxjs";
import {OperatorNotificationService} from "../backendcalls/operatornotificationservice";
import {OperatorNotificationAndDumpster} from "../../models/operatornotification";

@Injectable({
  providedIn: 'root',
})
export class NotificationDumpsterService extends OperatorNotificationService {
  constructor(
    private httpR: HttpRequestService,
    private dumpsterService: DumpsterService,
  ) {
    super(httpR);
  }

  public getInformativeOperatorNotifications() {
    return new Observable<OperatorNotificationAndDumpster[]>(obs => {
      this.getOperatorNotifications().subscribe({
        next: (notifications) => {
          let x: OperatorNotificationAndDumpster[] = []
          for (let i = 0; i < notifications.length; i++) {
            this.dumpsterService.getDumpsterByID(notifications[i].dumpsterID).subscribe({
              next: (res) => {
                x.push(new OperatorNotificationAndDumpster(notifications[i], res))
                if (i+1 >= notifications.length ){
                  obs.next(x)
                }
              }
            })
          }
        }
      })
    })
  }
}
