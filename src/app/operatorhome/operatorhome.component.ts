import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";

@Component({
  selector: 'app-operatorhome',
  templateUrl: './operatorhome.component.html',
  styleUrls: ['./operatorhome.component.scss']
})
export class OperatorhomeComponent implements OnInit {

  user = new User('', '', new Date(), '', '', 'Via Roma 10', 63900, 'Fermo', 'customer', '')

  garbagebin = 'carta'
  
  constructor() { }

  ngOnInit(): void {
  }

}
