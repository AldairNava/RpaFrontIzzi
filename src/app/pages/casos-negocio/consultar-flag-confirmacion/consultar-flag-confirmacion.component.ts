import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import { Table } from 'primeng/table';

@Component({
  selector: 'consultar-flag-confirmacion',
  templateUrl: './consultar-flag-confirmacion.component.html',
  styleUrls: ['./consultar-flag-confirmacion.component.scss']
})
export class ConsultarFlagConfirmacionComponent implements OnInit {

  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
    msgs: Message[] = [];
    showtable:any;
    stats:any[]=[];
  
    constructor(
      private cors: CorsService,
      private messageService: MessageService,
    ) { }
  
    ngOnInit(): void {
      this.statsAjustesBasesFlagConfirmacion();
      this.getTableAjustesBasesFlagConfirmacion();
      setInterval(()=>{
        this.statsAjustesBasesFlagConfirmacion();
        this.getTableAjustesBasesFlagConfirmacion();
      },60000);
    }
  
  
    getTableAjustesBasesFlagConfirmacion(){
      this.cors.get('AjustesNotDone/getAjustesFlagConfirmacion').then((response) => {
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

    statsAjustesBasesFlagConfirmacion(){
      this.cors.get('AjustesNotDone/statsBasesFlagConfirmacion').then((response) => {
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
  