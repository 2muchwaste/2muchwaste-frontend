import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {Observable} from "rxjs";
import {UserNotification} from "../models/UserNotification";
import {UserResponse} from "../models/userresponse";

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private CLASS_TAG = 'SocketService:'
  private socket: any;

  constructor() {
    this.socket = io('http://localhost:3456');
  }

  // Add methods for emitting and handling events
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // on(event: string, callback: (data: any) => void): void {
  //   this.socket.on(event, callback);
  // }

  listen(eventName: string){
    return new Observable<UserResponse>((subscriber) =>{
      this.socket.on(eventName, (data: UserResponse)=> {
        console.log(this.CLASS_TAG, 'socket listen something arrived, eventName:', eventName, ' dataArrived:', data);
        subscriber.next(data)
      })
    })
  }
}
