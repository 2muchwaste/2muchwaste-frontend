import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { verifyToken } from './verifytoken';
import * as io from 'socket.io-client';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io('your_socket_server_url'); // Inserire l'URL corretto del server socket
  }

  readNotification(input: string): Observable<number[][][]> {
    return new Observable<number[][][]>((observer) => {
      this.socket.emit('readNotification', input, (response: number[][][]) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  getNotifications(input: string): Observable<number[]> {
    return new Observable<number[]>(observer => {
      verifyToken().then(res => {
        setInterval(() => {
          this.socket.emit('getNotification', res, (response: number[]) => {
            observer.next(response);
          });
        }, 60 * 1000); // Moltiplica per 1000 per ottenere i millisecondi

      }).catch((error) => {
        console.error(error);
        observer.error(error);
      });
    });
  }

  getNotReadNotification(input: string): Observable<number> {
    return new Observable<number>(observer => {
      verifyToken().then(res => {
        this.socket.emit('getNotReadNotification', res, (response: number) => {
          observer.next(response);
        });
      }).catch((error) => {
        console.error(error);
        observer.error(error);
      });
    });
  }
}
