import socket from './socket';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '@/api';


@Component({
  selector: 'app-notification',
  templateUrl: './customerhome.component.html`,
})

export class NotificationComponent implements OnInit {
  constructor(private Api: api) {}

  ngOnInit(): void {
    this.readNotification('notificationId');
  }

  readNotification(notificationId: string): void {
    this.notificationService.readNotification(notificationId).subscribe(
      (response: number[][][]) => {
        // Fai qualcosa con la risposta ricevuta
      },
      (error) => {
        console.error('Errore durante la lettura della notifica', error);
      }
    );
  }
}
