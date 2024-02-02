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
  private CLASS_TAG = "NotificationDumpsterService:";
  constructor(
    private httpR: HttpRequestService,
    private dumpsterService: DumpsterService,
  ) {
    super(httpR);
  }

  public getInformativeOperatorNotifications() {
    console.log(this.CLASS_TAG," getInformativeOperatorNotifications");
    return new Observable<OperatorNotificationAndDumpster[]>(obs => {
      this.getOperatorNotifications().subscribe({
        next: (notifications) => {
          let x: OperatorNotificationAndDumpster[] = []
          let len = 0
          notifications.forEach(noti => {
            this.dumpsterService.getDumpsterByID(noti.dumpsterID).subscribe({
              next: (res) => {
                x.push(new OperatorNotificationAndDumpster(noti, res))
                len = len + 1
                if (len >= notifications.length ){
                  obs.next(x)
                }
              }
            })
          })
        }
      })
    })
  }
}
