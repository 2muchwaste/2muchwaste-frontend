import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {map} from "rxjs/operators";
import {AppConstants} from "../utils/constants";
import {ActivatedRoute} from "@angular/router";


@Component({
    selector: 'app-throwgarbage',
    templateUrl: './throwgarbage.component.html',
    styleUrls: ['./throwgarbage.component.css']
})
export class ThrowgarbageComponent {
    cassonetti = [
        { id: 1, nome: 'Cassonetto plastica', capacita: 100, riempimento: 75 },
        { id: 2, nome: 'Cassonetto vetro', capacita: 150, riempimento: 50 }
        // aggiungere altri cassonetti
    ];

    utenti = [
        { id: 1, nome: 'Utente 1', rfid: 'rfid1' },
        { id: 2, nome: 'Utente 2', rfid: 'rfid2' }
        // aggiungere altri utenti
    ];

    rfid = '';
    cassonettoId = 1;
    pesoRifiuti = 0;

    registraRifiuti() {
        // Aggiungere la logica per registrare i rifiuti
    }
}
