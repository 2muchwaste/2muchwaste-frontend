import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Dialog} from "../customerhome/customer-home.component";

@Component({
  selector: 'app-customer-home-position-error',
  template: `
    <div class="container-dialog-error">

      <h1 mat-dialog-title>{{title}}</h1>
      <div mat-dialog-content class="message-error">
        {{message}}
      </div>
      <div mat-dialog-actions>
        <button mat-button mat-dialog-close>Chiudi</button>
      </div>
    </div>

  `
  // styleUrls: ['./customer-home-position-error.scss', './customer-home.component.scss']
})
export class DialogSimpleComponent {

  private readonly CLASS_TAG = 'CustomerHomeDialogComponent'
  public title: string
  public message: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private injectedData: Dialog,
  ) {
    console.log(this.CLASS_TAG + ": injectedData", injectedData)
    this.title = injectedData.title
    this.message = injectedData.message
  }
}
