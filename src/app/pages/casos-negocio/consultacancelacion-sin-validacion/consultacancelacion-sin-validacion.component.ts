import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Table } from 'primeng/table';

@Component({
  selector: 'consultacancelacion-sin-validacion',
  templateUrl: './consultacancelacion-sin-validacion.component.html',
  styleUrls: ['./consultacancelacion-sin-validacion.component.scss']
})
export class ConsultacancelacionSinValidacionComponent implements OnInit {
  cancelacion:any[]=[];
  stats:any[]=[];

  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getTablaCancelacion();
    this.statsCancelacion();
    setInterval(()=>{
      this.statsCancelacion();
      this.getTablaCancelacion();
    },60000);

  }


  getTablaCancelacion(){
    this.cors.get('AjustesNotDone/getCancelacionSinValidacion').then((response) => {
      // console.log(response)
      if(response[0] == 'SIN INFO'){
        this.cancelacion=[];
      }else{
        this.cancelacion=response;
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  dateFormat(value:any){
    // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  statsCancelacion(){
    this.cors.get('AjustesNotDone/getStatsCancelacionSinValidacion').then((response) => {
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
      console.log(error)
    })
  }

  
}
