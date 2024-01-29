import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {CreateDepositService} from "../services/middleware/createdepositservice";
import {Dialog} from "../customerhome/customer-home.component";

@Component({
  selector: 'app-dialog-yes-no',
  template: `
    <div class="container-dialog-error">
      <h1 mat-dialog-title>{{title}}</h1>
      <div mat-dialog-content class="message-error">
        {{dialog.message}}
      </div>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close cdkFocusInitial>Chiudi</button>
        <button mat-button [disabled]=finished.finish (click)="pF()">Si</button>
      </mat-dialog-actions>
    </div>
  `,
  // styleUrls: ['./customer-home-position-error.scss', './customer-home.component.scss']
})
export class DialogYesNoComponent {

  private readonly CLASS_TAG = 'CustomerHomeDialogComponent'
  public title: string
  public message: string
  public dialog: Dialog
  public positiveFunction: () => void
  public finished :{finish:boolean}

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: {
      content: Dialog,
      positiveFunction: () => void,
      finished: {finish:boolean}
    },
    private router: Router,
    private createDepositService: CreateDepositService,
  ) {
    console.log(this.CLASS_TAG + ": injectedData", injectedData)
    this.dialog = injectedData.content
    this.title = injectedData.content.title
    this.message = injectedData.content.message
    this.positiveFunction = injectedData.positiveFunction
    this.finished = injectedData.finished
    console.log(this.CLASS_TAG + ": injectedData", injectedData)
  }

  pF() {
    this.positiveFunction()
  }

}
