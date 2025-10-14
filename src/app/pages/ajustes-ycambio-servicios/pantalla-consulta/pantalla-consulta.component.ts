import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Table } from 'primeng/table';


@Component({
  selector: 'pantalla-consulta',
  templateUrl: './pantalla-consulta.component.html',
  styleUrls: ['./pantalla-consulta.component.scss']
})
export class PantallaConsultaComponent implements OnInit {
  tabla:any[]=[];
  stats:any[]=[];
  loading:boolean=false;
  fechaini:string | any=null;
  fechafin:string | any=null;
  export:boolean=false;

  constructor(
    private cors: CorsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getTableAjustesyCambioServicio();
    this.getStatsAjustesyCambioServicio();
    setInterval(()=>{
      this.getStatsAjustesyCambioServicio();
    },10000);
  }

  getTableAjustesyCambioServicio(){
    this.loading= true;
    this.cors.get('AjustesCambiosServicios/getAjustesCambioServicioInfo')
    .then((response)=>{
      // // console.log(response)
      if(response[0]=='SIN INFO'){
        this.tabla=[];

      }else{
        for (let i = 0; i < response.length; i++) {
          const jsonObject = response[i];
          for (let key in jsonObject) {
            if (jsonObject.hasOwnProperty(key) && typeof jsonObject[key] === "object" && !Array.isArray(jsonObject[key])) {
              jsonObject[key] = 0;
            }
          }
        }      
  
        this.tabla=response;
      }
    })
    .catch((err)=>{
      // console.log(err)
    });
    this.loading= false;
  }

  getStatsAjustesyCambioServicio(){
    this.cors.get('AjustesCambiosServicios/getStatsAjustesCambioServicio')
    .then((response)=>{
      // // console.log(response)
      if(response[0]=='SIN INFO'){
        this.stats=[];

      }else{
        for (let i = 0; i < response.length; i++) {
          const jsonObject = response[i];
          for (let key in jsonObject) {
            if (jsonObject.hasOwnProperty(key) && typeof jsonObject[key] === "object" && !Array.isArray(jsonObject[key])) {
              jsonObject[key] = 0;
            }
          }
        }      
  
        this.stats=response;
      }
    })
    .catch((err)=>{
      // console.log(err)
    });
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

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    this.saveAsExcelFile(excelBuffer, fileName);
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, fileName + '.xlsx');
  }

  exportar(){
    // // console.log(this.tabla)
    if(this.fechafin == null || this.fechaini== null){
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'Ingresa dos Fechas!',
        detail: 'Intenta Nuevamente!!!',
      });
    }else{
        this.export=true;
        let fecha1=moment(this.fechaini).format("yyyy-MM-DD HH:mm:ss");
        let fecha2=moment(this.fechafin).format("yyyy-MM-DD HH:mm:ss");
        const resultado = this.tabla.filter(item=>{
          return item.fechaCarga>= fecha1 && item.fechaCarga<=fecha2;
        });
        resultado.sort((a,b)=> a.id-b.id);
        // // console.log(resultado)
        this.exportToExcel(resultado,`AjustesCambioServicio-${fecha1}a${fecha2}`);
        this.export=false;
      }
 
  }

}
