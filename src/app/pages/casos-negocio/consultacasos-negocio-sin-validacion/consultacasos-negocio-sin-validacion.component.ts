import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Table } from 'primeng/table';

@Component({
  selector: 'consultacasos-negocio-sin-validacion',
  templateUrl: './consultacasos-negocio-sin-validacion.component.html',
  styleUrls: ['./consultacasos-negocio-sin-validacion.component.scss']
})
export class ConsultacasosNegocioSinValidacionComponent implements OnInit {
  casosNegocio:any[]=[];
  stats:any[]=[];

  constructor(
    private cors: CorsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getTablaCasosNegocio();
    this.statsCasosNegocio();
    setInterval(()=>{
      this.statsCasosNegocio();
      this.getTablaCasosNegocio();
    },60000);
  }



  getTablaCasosNegocio(){
    this.cors.get('AjustesNotDone/getCasosNegocioSinValidacion').then((response) => {
      // console.log(response)
      if(response[0] == 'SIN INFO'){
        this.casosNegocio=[];
      }else{
        this.casosNegocio=response;
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
  statsCasosNegocio(){
    this.cors.get('AjustesNotDone/getStatsCasosNegocioSinValidacion').then((response) => {
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
