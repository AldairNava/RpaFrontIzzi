import { Component, OnInit,Input } from '@angular/core';
import * as moment from 'moment';
import { PrimeIcons } from 'primeng/api';
moment.locale('es')
@Component({
  selector: 'robot-log-modal',
  templateUrl: './robot-log-modal.component.html',
  styleUrls: ['./robot-log-modal.component.scss']
})
export class RobotLogModalComponent implements OnInit {
  @Input() datasource:any[] = []; 
  
  constructor() { 

 
  }
getDate(fecha:string){
return moment(fecha).format('dddd DD MMMM YYYY h:mm:ss a').toString()
}
  ngOnInit(): void {
  }

}
