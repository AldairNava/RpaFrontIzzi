import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'migraciones-lineales',
  templateUrl: './migraciones-lineales.component.html',
  styleUrls: ['./migraciones-lineales.component.scss']
})
export class MigracionesLinealesComponent implements OnInit {
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  msgs: Message[] = [];
  ExcelData:any;
  spinner:boolean=false;
  button:boolean=true;
  table:boolean=false;
  headers:string[]=[
    'BENEFICIO OTORGADO',
    'CN',
    'CUENTA',
    'Canal',
    'FECHA BEN OTORGADO',
    'FECHA ENVIO A CIBER',
    'FECHA RECIBIDO BO',
    'Fecha Carga',
    'NOMBRE DEL CLIENTE',
    'OS',
    'PAQUETE ORIGEN',
    'Status',
    'Sub motivo',
    'Usuario',
  ];

  constructor(
    private cors: CorsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  readExcel(event:any){
    let results:any=[];
    let count:any=0;
    let file = event.target.files[0];
    let ultimo = file.name.split('.');
    if(ultimo[ultimo.length-1] != 'xlsx'){
       this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'La extensión del archivo es incorrecta',
        detail: 'Ingresa un archivo con extensión XLSX!!',
      });
    }else if(ultimo[ultimo.length-1] == 'xlsx'){
      let fileReader = new FileReader();
      var pattern = /[\^*@!"#$%&/()=?¡!¿'\\]/gi;
      fileReader.readAsBinaryString(file);
      fileReader.onload= (e)=>{
        // var workBook = XLSX.read(fileReader.result,{type:'binary',cellDates:true, raw: true })
        var workBook = XLSX.read(fileReader.result,{type:'binary',cellDates:true })
        var sheetNames =  workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]],{defval: ''});
        for(let [key,value] of Object.entries(this.ExcelData[0])){
          // // console.log("Esto es cabezera",key)
          for(let i = 0 ; i<this.headers.length;i++){
            if(key == this.headers[i]){
              count++;
            }  
          }
        }

        if(count == 14){
          Object.keys(this.ExcelData).forEach(key => {
            this.ExcelData[key]["FECHA BEN OTORGADO"]=moment(this.ExcelData[key]["FECHA BEN OTORGADO"]).format('yyyy-MM-DD HH:mm:ss');  
            this.ExcelData[key]["FECHA ENVIO A CIBER"]=moment(this.ExcelData[key]["FECHA ENVIO A CIBER"]).format('yyyy-MM-DD HH:mm:ss');  
            this.ExcelData[key]["FECHA RECIBIDO BO"]=moment(this.ExcelData[key]["FECHA RECIBIDO BO"]).format('yyyy-MM-DD HH:mm:ss');  

            this.ExcelData[key]["Status1"]='Pendiente';
            this.ExcelData[key]["Cve_usuario"]=this.usuario.email;
            this.ExcelData[key]["Procesando"]="0";
            this.ExcelData[key]["IP"]="";
            this.ExcelData[key]["FechaCaptura"]=moment(Date.now()).format('yyyy-MM-DD hh:mm:ss');  
    
          });          
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Exito!!!',
            detail: 'El archivo se a cargado completamente!!!',
          });
          this.button=false;
          // // console.log(this.ExcelData)
          this.table=true;
        }else{
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'El formato del archivo es incorrecto!!!',
          });
        }

  
      }
    }

  }

  saveExcel() {
    this.button=true;
    this.cors.post('AjustesCambiosServicios/InsertarBaseDatosMigracionesLineales',this.ExcelData).then((response) => {
      // // console.log(response)
      this.spinner=false;
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Exportado',
        detail: 'Correctamente!!',
      }); 
    }).catch((error) => {
      // console.log(error)
      this.spinner=false;
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Ocurrio un Erro intentalo nuevamente',
        detail: 'Intenta nuevamente!!!',
      });
    });
    this.table=false
    
    

  }

  dateFormat(value:any){
    // // console.log(value)
    if(value != null || value!=""){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }
  dateFormat1(value:any){
    // // console.log(value)
    if(value!=""){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }




}
