import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";

@Component({
  selector: 'app-operatorhome',
  templateUrl: './operatorhome.component.html',
  styleUrls: ['./operatorhome.component.scss']
})
export class OperatorhomeComponent implements OnInit {

  user = new User('', '', new Date(), '', '', 'Via Roma 10'
    , 63900, 'Fermo', 'customer', '')

  garbagebin = 'carta'
  // Component che cambiano:
  // 1. Bidoni pieni
  // 2. Notifiche
  // 3. Dati operatore (gestire a pagine gli scarichi effettuati)
  // 4. Statistiche
  // 5. Gestione eccezione ricevuta tramite notifiche

  constructor() { }

  ngOnInit(): void {
  }

}
