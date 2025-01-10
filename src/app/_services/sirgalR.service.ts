import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

interface NewMessage {
    userName: string;
    message: string;
    groupName?: string;
  }

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
    public userName = 'eder';
    public groupName = 'all';
    public messageToSend = 'q pedo';
    public joined = false;
    public conversation: NewMessage[] = [{
      message: 'Bienvenido',
      userName: 'Sistema'
    }];
  
    private connection?: HubConnection;
  constructor() {

    this.connection = new HubConnectionBuilder()
    .withUrl('https://localhost:44372/botHub')
    .build();

    this.connection.start()
    .then(_ => {console.log(_);
    
      console.log('Connection Started');
    }).catch(error => {
      return console.error(error);
    });

    this.connection?.on("joinBot", message => {
        console.log(message);
        
    });
    this.connection?.on("lostConection", message => {
        console.log(message);
        
    });
    this.connection?.on("NewUser", message => {
        console.log(message);
        
    });
    this.connection?.on("NewMessage", message => {
        console.log(message);
        
        
    });
    this.connection?.on("LeftUser", message => this.leftUser(message));

    
   }


   
 conect(){
   
 }

    join() {
        console.log("click");
        
    this.connection?.invoke('JoinGroup', this.groupName, this.userName)
      .then(_ => {
        this.joined = true;
      });

      setTimeout(() => {
        this.connection?.invoke('OnClose')
      .then(_ => {
        this.joined = true;
      });
      }, 2000);
  }

   sendMessage() {
    const newMessage: NewMessage = {
      message: this.messageToSend,
      userName: this.userName,
      groupName: 'this.groupName'
    };

    this.connection?.invoke('SendMessage', newMessage)
      .then(_ => this.messageToSend = '');
  }

   leave() {
    this.connection?.invoke('LeaveGroup', this.groupName, this.userName)
      .then(_ => this.joined = false);
  }

   newUser(message: string) {
    console.log(message);
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

   newMessage(message: NewMessage) {
    console.log(message);
    this.conversation.push(message);
  }

   leftUser(message: string) {
    console.log(message);
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

  
}