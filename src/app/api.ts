import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io('your_socket_server_url'); // Assicurati di inserire l'URL corretto del server socket
  }

  readNotification(input: string): Observable<number[][][]> {
    return new Observable<number[][][]>((observer) => {
      this.socket.emit('readNotification', input, (response: number[][][]) => {
        observer.next(response);
        observer.complete();
      });
    });
  }
}
