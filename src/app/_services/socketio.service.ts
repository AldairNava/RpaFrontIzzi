import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class SocketIoService {
  constructor(private socket: Socket) {

  }

  changeWork() {
    return this.socket.fromEvent('botChangeWork').pipe(map((data:any) => data));
  }
  getConections() {
    return this.socket.fromEvent('botConected').pipe(map((data:any) => data));
  }
  getDisconections(){
    return this.socket.fromEvent('disconectionBot').pipe(map((data:any) => data));
  }
}