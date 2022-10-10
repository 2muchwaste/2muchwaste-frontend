import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";

@Component({
  selector: 'app-customerhome',
  templateUrl: './customerhome.component.html',
  styleUrls: ['./customerhome.component.scss']
})
export class CustomerhomeComponent implements OnInit {

  user = new User('Angelo', '', new Date(), '', '', 'Via mengoli 15'
    , 61122, 'Pesaro', 'customer', '')

  rubbishThrowing = 12
  cumulativeDebt = 75

  constructor() { }

  ngOnInit(): void {
  }

}
