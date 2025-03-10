import { Component, OnInit } from '@angular/core';
import { Message,MessageService,ConfirmationService } from 'primeng/api';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ReportesComponent implements OnInit {
 formReporte:UntypedFormGroup;
   usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
   msgs: Message[] = [];
   mostrandoResultados: boolean = false
   reportes:any = [];
   url1:string='';
   show:boolean=false;
   button:boolean=false;
 
   constructor(
     private cors: CorsService,
     private formBuilder: UntypedFormBuilder,
     private messageService: MessageService,
     private confirmationService: ConfirmationService,
     private httpClient: HttpClient
   ) { 
     this.formReporte = this.formBuilder.group({
       tipoReporte: [null, Validators.required],
       fechas: [null, Validators.required],
       Cve_usuario: [this.usuario.email, Validators.required],
     });
 
   }
 
   ngOnInit(): void {
     this.getTipoReporte();
   }
   
   confirm2(event: Event) {
     this.confirmationService.confirm({
       key: 'confirm2',
       target: event.target || new EventTarget,
       message: '¿Los datos son correctos?',
       icon: 'pi pi-exclamation-triangle',
       accept: async () => {
         this.button=true;
         // this.show = false;
         // console.log(this.formReporte)
         let fechaini = moment(this.formReporte.value.fechas[0]).format('YYYY-MM-DD');
         let fechafin = moment(this.formReporte.value.fechas[1]).format('YYYY-MM-DD');
         let url=``;
         let para =``;
         let a = {
           "fecha1":fechaini,
           "fecha2":fechafin
         }
         let nomArchivo="";
         // console.log(a)
         console.log(this.formReporte.value)
         if(this.formReporte.value.tipoReporte =='Reporte Sucursales'){
           console.log("Ajustes Sucursales")
           url = `ReportesIzzi/getReporteAjustesCambioServicios`;
           para =`fecha1=${fechaini}&fecha2=${fechafin}`
           nomArchivo="Reporte_Ajustes_Sucursales"
           // console.log(`${url}?${para}`)
         }
         else if(this.formReporte.value.tipoReporte =='Reporte Retencion 0'){
           url = `ReportesIzzi/ReporteRetencion0`;
           para =`fecha1=${fechaini}&fecha2=${fechafin}`
           nomArchivo="Reporte_Retencion_0"
         }
         try {
           const headers = new HttpHeaders({
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': 'https://rpabackizzi.azurewebsites.net/',
            //  'Access-Control-Allow-Origin': 'https://localhost:7198/',
             'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
             'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
           });
           const response: any = await this.httpClient.get(`https://rpabackizzi.azurewebsites.net/${url}?${para}`, {
          //  const response: any = await this.httpClient.get(`https://localhost:7198/${url}?${para}`, {
           headers:headers,  
           responseType: 'arraybuffer',
             observe: 'response'
           }).toPromise();
           const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
           const link = document.createElement('a');
 
           link.href= URL.createObjectURL(blob);
           link.download = `${nomArchivo}`;
           link.click();
           
           URL.revokeObjectURL(link.href);
           link.innerHTML='';
           this.messageService.add({ severity: 'info', summary: 'Generando', detail: 'Se ha generado el reporte' });
 
         } catch (error) {
           console.log(error)
         }
         this.button = false
         this.formReporte.controls['tipoReporte'].reset();
         this.formReporte.controls['fechas'].reset();
         this.show = false;
       },
       reject: () => {
         this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Reporte Cancelado' });
       }
     });
     
     
   }
 
   getTipoReporte(){
     this.cors.get('ReportesIzzi/getTipoReportesSucursales').then((response) => {
       if(response[0]=='SIN INFO'){
         this.reportes=[];
       }else{
         this.reportes=response;
       }
     }).catch((error) => {
       console.log("Error",error)
     })
   }
 }