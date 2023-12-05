import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AppConstants} from "../utils/constants";

@Component({
  selector: 'app-sourcenotfound',
  templateUrl: './sourcenotfound.component.html',
  styleUrls: ['./sourcenotfound.component.scss']
})
export class SourcenotfoundComponent implements OnInit {

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
