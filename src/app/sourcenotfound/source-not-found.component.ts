import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppConstants} from "../utils/constants";

@Component({
  selector: 'app-source-not-found',
  templateUrl: './source-not-found.component.html',
  styleUrls: ['./source-not-found.component.scss']
})
export class SourceNotFoundComponent implements OnInit {

  public resRequested: string = ''

  constructor(
    public router: Router
  ) {
  }

  ngOnInit(): void {
    this.resRequested = this.router.url
  }

  protected readonly AppConstants = AppConstants;
}
