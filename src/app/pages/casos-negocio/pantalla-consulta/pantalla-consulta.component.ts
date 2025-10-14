import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Table } from 'primeng/table';


@Component({
  selector: 'pantalla-consulta',
  templateUrl: './pantalla-consulta.component.html',
  styleUrls: ['./pantalla-consulta.component.scss']
})
export class PantallaConsultaComponent implements OnInit {
  notdone:any[]=[];
  stats:any[]=[];


  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getTablaNotDone();
    this.statsNotDone();
    setInterval(()=>{
      this.statsNotDone();
      this.getTablaNotDone();
    },60000);
  }

  getTablaNotDone(){
    this.cors.get('AjustesNotDone/getAllEjecucionNotDone').then((response) => {
      // // console.log(response)
      if(response[0] == 'SIN INFO'){
        this.notdone=[];
      }else{
        this.notdone=response;
      }
    }).catch((error) => {
      // console.log(error)
    })
  }
  dateFormat(value:any){
    // // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  statsNotDone(){
    this.cors.get('AjustesNotDone/getStatsNotDone').then((response) => {
      for (let i = 0; i < response.length; i++) {
        const jsonObject = response[i];
        for (let key in jsonObject) {
          if (jsonObject.hasOwnProperty(key) && typeof jsonObject[key] === "object" && !Array.isArray(jsonObject[key])) {
            jsonObject[key] = 0;
          }
        }
      }      
      this.stats=response;
    }).catch((error) => {
      // console.log(error)
    })
  }

  


}
