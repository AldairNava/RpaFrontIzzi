import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Table } from 'primeng/table';

@Component({
  selector: 'consulta-migraciones',
  templateUrl: './consulta-migraciones.component.html',
  styleUrls: ['./consulta-migraciones.component.scss']
})
export class ConsultaMigracionesComponent implements OnInit {
  migraciones:any[]=[];
  stats:any[]=[];

  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getTablaMigracionesLineales();
    this.statsMigracionesLineales();
    setInterval(()=>{
      this.statsMigracionesLineales();
    },10000);
  }


  getTablaMigracionesLineales(){
    this.cors.get('AjustesCambiosServicios/getMigracionesLineales').then((response) => {
      // console.log(response)
      if(response[0] == 'SIN INFO'){
        this.migraciones=[];
      }else{
        this.migraciones=response;
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  dateFormat(value:any){
    // console.log(value)
    if(value != null || value!=""){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }
  dateFormat1(value:any){
    // console.log(value)
    if(value!=""){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  statsMigracionesLineales(){
    this.cors.get('AjustesCambiosServicios/getStatsMigracionesLineales').then((response) => {
      // console.log(response)
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
