import {Component, OnInit} from '@angular/core';
import {CreateDepositService} from "../services/middleware/createdepositservice";
import {Dumpster} from "../models/dumpster";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-deposit',
  templateUrl: './create-deposit.component.html',
  styleUrls: ['./create-deposit.component.scss']
})
export class CreateDepositComponent implements OnInit {

  dumpster: Dumpster
  private createDepositForm!: FormGroup
  quantityFormControl = new FormControl('', [Validators.required])
  timeFormControl = new FormControl('', [Validators.required])

  constructor(
    public createDepositService: CreateDepositService,
    private fb: FormBuilder,
  ) {
    this.dumpster = this.createDepositService.dumpster
  }

  ngOnInit(): void {
    this.createDepositForm = this.fb.group({
      name: this.quantityFormControl,
      surname: this.timeFormControl,
    })
  }

  submit() {
    if (this.createDepositForm.valid) {
      console.log("inizio deposito");
      this.createDepositService.createDeposit(this.quantityFormControl.value, this.timeFormControl.value).subscribe({
        next: (res) => {
          console.log("deposito creato", res);
        }
      })
    }
  }
}
