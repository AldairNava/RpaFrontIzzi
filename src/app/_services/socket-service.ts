import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket?: WebSocket;
  squares$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  announcement$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  name$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private name: string = "";
  constructor() { }

  startSocket() {
    this.socket = new WebSocket('wss://localhost:44372/ws');

 
    
    this.socket.addEventListener("open", (ev => {
      // console.log('opened')
    }));
    this.socket.addEventListener("message", (ev => {
        
      var messageBox: any = JSON.parse(ev.data);
      // console.log('message object', messageBox);
      
    }));

    this.socket.addEventListener("close",ev =>{
      // console.log(ev);
      
    })
  }

  sendSquareChangeRequest(req: any) {
    
    var requestAsJson = JSON.stringify(req);
    this.socket?.send(requestAsJson);
  }
}