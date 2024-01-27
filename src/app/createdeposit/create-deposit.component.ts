import {Component, OnInit} from '@angular/core';
import {CreateDepositService} from "../services/middleware/createdepositservice";
import {Dumpster} from "../models/dumpster";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DumpsterService} from "../services/backendcalls/dumpsterservice";
import {TrashTypeManager} from "../models/trashtype";
import {UserInformationService} from "../services/userinformationservice";
import {MatDialog} from "@angular/material/dialog";
import {DialogSimpleComponent} from "../dialogs/DialogSimple";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-deposit',
  templateUrl: './create-deposit.component.html',
  styleUrls: ['./create-deposit.component.scss']
})
export class CreateDepositComponent implements OnInit {
  private readonly CLASS_TAG = "CreateDepositComponent"
  private readonly dumpsterIDKey = "dumpsterID"
  readonly trashTypeManager = new TrashTypeManager()
  dumpster: Dumpster
  private createDepositForm!: FormGroup
  quantityFormControl = new FormControl('', [Validators.required])
  timeFormControl = new FormControl('', [Validators.required])

  constructor(
    public createDepositService: CreateDepositService,
    private fb: FormBuilder,
    private dumpsterService: DumpsterService,
    public userInfoService: UserInformationService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.dumpster = this.createDepositService.dumpster
  }

  ngOnInit(): void {
    if (!this.dumpster) {
      // @ts-ignore
      this.dumpsterService.getDumpsterByID(localStorage.getItem(this.dumpsterIDKey)).subscribe({
        next: (res) => {
          this.dumpster = res
          localStorage.setItem(this.dumpsterIDKey, this.dumpster._id)
          this.createDepositService.dumpster = res
          console.log(this.CLASS_TAG + ": this.dumpster", this.dumpster)
        }
      })
    } else {
      localStorage.setItem(this.dumpsterIDKey, this.dumpster._id)
      this.createDepositService.dumpster = this.dumpster
    }
    this.createDepositForm = this.fb.group({
      name: this.quantityFormControl,
      surname: this.timeFormControl,
    })
  }

  submit() {
    if (this.createDepositForm.valid) {
      console.log("inizio deposito");
      console.log(this.CLASS_TAG + ": this.dumpster", this.dumpster)
      this.createDepositService.createDeposit(this.quantityFormControl.value, this.timeFormControl.value).subscribe({
        next: (res) => {
          console.log("deposito creato", res);
          let dialogRef = this.dialog.open(DialogSimpleComponent,{
            data: {
              title: "Deposito avvenuto",
              message: "Deposito avvenuto con successo"
            }
          })
          dialogRef.afterClosed().subscribe({
            next:(res)=>{
              this.router.navigate(['/customerhome'])
            }
          })
        }
      })
    }
  }
}
