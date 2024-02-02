import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {CostService} from "../services/backendcalls/costservice";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";
import {TrashTypeManager, TrashTypes} from "../models/trashtype";
import {MatDialog} from "@angular/material/dialog";
import {DialogSimpleComponent} from "../dialogs/DialogSimple";
import {Dialog} from "../dialogs/Dialog";

@Component({
  selector: 'app-create-cost',
  templateUrl: './create-cost.component.html',
  styleUrls: ['./create-cost.component.scss']
})
export class CreateCostComponent implements OnInit {
  typeFormControl = new FormControl('' ,[Validators.required])
  costFormControl = new FormControl('',[Validators.required])
  trashTypes = Object.values(TrashTypes)
  trashTypeManager = new TrashTypeManager()

  constructor(
    private costService: CostService,
    private authorizationService: Authorizationservice,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.authorizationService.checkAuthDataORRedirect()
  }

  createCost(){
    this.costService.addPrice(this.typeFormControl.value,this.costFormControl.value).subscribe({
      next:(res)=>{
        let d: Dialog = {title:"Costo creato",message:"Costo creato con successo!"}
        this.dialog.open(DialogSimpleComponent,{
          data:d
        })
      }
    })
  }

}
