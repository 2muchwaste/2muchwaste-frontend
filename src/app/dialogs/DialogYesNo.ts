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
        {{message}}
      </div>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close cdkFocusInitial>Chiudi</button>
        <button mat-button mat-dialog-close>Si</button>
      </mat-dialog-actions>
    </div>
  `,
  // styleUrls: ['./customer-home-position-error.scss', './customer-home.component.scss']
})
export class DialogYesNoComponent {

  private readonly CLASS_TAG = 'CustomerHomeDialogComponent'
  public title: string
  public message: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: Dialog,
    private router: Router,
    private createDepositService: CreateDepositService,
  ) {
    console.log(this.CLASS_TAG + ": injectedData", injectedData)
    this.title = injectedData.title
    this.message = injectedData.message
  }

}
