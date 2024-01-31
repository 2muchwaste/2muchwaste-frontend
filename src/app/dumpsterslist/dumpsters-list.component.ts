import {Component, OnInit} from '@angular/core';
import {TrashTypeManager} from "../models/trashtype";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";
import {PageEvent} from "@angular/material/paginator";
import {DumpsterService} from "../services/backendcalls/dumpsterservice";
import {Dumpster} from "../models/dumpster";
import {DumpsterUtils} from "../utils/dumpsterutils";

@Component({
  selector: 'app-dumpsters-list',
  templateUrl: './dumpsters-list.component.html',
  styleUrls: ['./dumpsters-list.component.scss']
})
export class DumpstersListComponent implements OnInit {

  dumpsters!: Dumpster[]
  lowValue: number = 0
  highValue: number = 10
  trashTypesManager: TrashTypeManager = new TrashTypeManager()
  dumpsterUtils = new DumpsterUtils()

  constructor(
    private authorizationService: Authorizationservice,
    private dumpsterService: DumpsterService,
  ) {
  }

  ngOnInit(): void {
    console.log('UserDepositInformation enter OnInit')
    this.authorizationService.checkAuthDataORRedirect()
    this.setDumpsters()
  }

  private setDumpsters() {
    this.dumpsterService.getDumpsters().subscribe({
      next: res => {
        this.dumpsters = res
      },
      error: err => console.log(err)
    })
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize
    this.highValue = this.lowValue + event.pageSize
    return event
  }
}
