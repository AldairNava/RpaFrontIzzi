import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Table } from 'primeng/table';

@Component({
  selector: 'consulta-sin-validacion',
  templateUrl: './consulta-sin-validacion.component.html',
  styleUrls: ['./consulta-sin-validacion.component.scss']
})
export class ConsultaSinValidacionComponent implements OnInit {
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  msgs: Message[] = [];
  showtable:any;
  stats:any[]=[];

  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.statsAjustesBasesSinValidacion();
    this.getTableAjustesBasesSinValidacion();
    setInterval(()=>{
      this.statsAjustesBasesSinValidacion();
      this.getTableAjustesBasesSinValidacion();
    },60000);
  }


  getTableAjustesBasesSinValidacion(){
    this.cors.get('AjustesNotDone/getAjustesSinValidacion').then((response) => {
      // console.log(response)
      if(response[0] =='SIN INFO'){
        this.showtable = [];

      }else{
        this.showtable = response;

      }
    }).catch((error) => {
      console.log(error)
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  dateFormat(value:any){
    // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }

  statsAjustesBasesSinValidacion(){
    this.cors.get('AjustesNotDone/statsBasesSinValidacion').then((response) => {
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
