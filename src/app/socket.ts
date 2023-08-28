import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: SocketIOClient.Socket;
  connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  fooEvents: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  barEvents: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() {
    this.socket = io('http://localhost:8080', { path: '/socket.io/', transports: ['websocket'] });

    this.socket.on('connect', () => {
      this.connected.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connected.next(false);
    });

    this.socket.on('foo', (...args) => {
      const currentFooEvents = this.fooEvents.getValue();
      this.fooEvents.next([...currentFooEvents, args]);
    });

    this.socket.on('bar', (...args) => {
      const currentBarEvents = this.barEvents.getValue();
      this.barEvents.next([...currentBarEvents, args]);
    });
  }

}
