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
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  msgs: Message[] = [];
  showtable:any;
  stats:any[]=[];
  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getTableCrearCuenta();
    this.statsCrearCuenta();
    setInterval(()=>{
      this.getTableCrearCuenta();
      this.statsCrearCuenta();
    },60000);
  }

  getTableCrearCuenta(){
    this.cors.get('AjustesNotDone/getAllCrearCuenta').then((response) => {
      // // console.log(response)
      if(response[0] =='SIN INFO'){
        this.showtable = [];

      }else{
        this.showtable = response;

      }
    }).catch((error) => {
      // console.log(error)
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  dateFormat(value:any){
    // // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }

  statsCrearCuenta(){
    this.cors.get('AjustesNotDone/getStatsCrearCuenta').then((response) => {
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
