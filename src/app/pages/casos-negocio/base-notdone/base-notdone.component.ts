import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CorsService } from '@services';
import * as moment from 'moment';
moment.lang('es');
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'base-notdone',
  templateUrl: './base-notdone.component.html',
  styleUrls: ['./base-notdone.component.scss']
})
export class BaseNotdoneComponent implements OnInit {

  horarios:any[]=[];
  first:any=null;
  second:any=null;
  tablaArchivos:any[]=[];
  loading: boolean = false
  show:boolean=false;
  url1:any;
  archivoSeleccionado:string="";
  loading2:boolean=false;
  time:any=null;
  timeCI:any=null;
  timeCF:any=null;
  nuevo:boolean=false;
  constructor(private cors: CorsService,private messageService: MessageService,private http:HttpClient) {
  }
  ngOnInit(): void {
    this.gettablaArchivos();
  }
  gettablaArchivos(){
    this.cors.get('DepuracionNotdone/getBasesNotDone')
    .then((response) => {
      // console.log(response)
      if(response[0]=="SIN INFO"){
        this.tablaArchivos = [];
      }else{
        for(let i =0;i<response.length;i++){
          if(response[i].procesando == "1"){
            response[i].procesando = "Si"
          }else{
            response[i].procesando="No"
          }
        }
      this.tablaArchivos = response;
      }
    })
    .catch((error) => {
    console.log(error)
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  dateFormat(value:any){
    if(value != null || value != ""){
      return moment(value).format('DD-MM-yyyy HH:mm:ss')
    }else{
      return "---"
    }
  }
  descargarArchivo(archivo:string){
    this.archivoSeleccionado = archivo;
    this.loading2 = true;
  
    this.cors.get2(`DepuracionNotdone/BajarExcelFTPArchivosNotDone`,{
      "nombre":archivo
    })
    .then((response) => {
      // console.log(response)
      this.show = true;
      this.url1 = `https://rpabackizzi.azurewebsites.net/DepuracionNotdone/BajarExcelFTPArchivosNotDone?nombre=${archivo}`;
      setTimeout(()=> {
      this.loading2 = false;
      this.archivoSeleccionado = '';
      this.messageService.add({
        key:'tst',
        severity: 'success',
        summary: 'Se descargo el archivo',
        detail: 'Con exito!!',
        });
      }, 5000);
    })
    .catch((error) => {
      console.log(error)
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'No se logro descargar',
        detail: 'Intenta Nuevamente!!!',
      });
      this.loading2 = false;
      this.archivoSeleccionado = '';
    });
    this.show=false;	
  }
  estaSiendoDescargado(archivo: string): boolean {
    return this.archivoSeleccionado === archivo && this.loading2;
  }
  async con(){
    this.cors.get3('')
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    });
  }
}


