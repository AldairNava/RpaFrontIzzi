import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'casos-negocio-sin-validacion',
  templateUrl: './casos-negocio-sin-validacion.component.html',
  styleUrls: ['./casos-negocio-sin-validacion.component.scss']
})
export class CasosNegocioSinValidacionComponent implements OnInit {
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  msgs: Message[] = [];
  ExcelData:any=[];
  headers:string[]=[
    'Categoria',
    'Cuenta',
    'Motivo Cliente',
    'Motivos',
    'Estado',
    'Solucion',
    'Submotivo',
    'Comentarios',
  ];
  button:boolean=true;
  tabla:boolean=false;

  constructor(
    private cors: CorsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  readExcel(event:any){
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
        // // console.log(this.ExcelData)
        let count=0;
        for(let [key,value] of Object.entries(this.ExcelData[0])){
          // // console.log("Esto es cabezera",key)
          for(let i = 0 ; i<this.headers.length;i++){
            if(key == this.headers[i]){
              count++;
              // // console.log(key)
              // // console.log(this.headers[i])
            }
          }
        }
        if(count == 8){ 
          Object.keys(this.ExcelData).forEach(key => {
            this.ExcelData[key]["Status"]='Pendiente';
            this.ExcelData[key]["Cve_usuario"]=this.usuario.email;
            this.ExcelData[key]["Procesando"]="0";
            this.ExcelData[key]["IP"]="";
            this.ExcelData[key]["fechaCaptura"]=moment(Date.now()).format('yyyy-MM-DD HH:mm:ss');
          });
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Exito!!!',
            detail: 'El archivo se a cargado completamente!!!',
          });
          // // console.log(this.ExcelData)
          this.tabla=true;
          this.button=false;
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
    this.cors.post('AjustesNotDone/InsertarBaseDatosCasosNegocioSinValidacion',this.ExcelData).then((response) => {
      // // console.log(response)
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Importado',
        detail: 'Correctamente!!',
      });
    }).catch((error) => {
      // console.log(error)
      // this.spinner=false;
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Ocurrio un Erro intentalo nuevamente',
        detail: 'Intenta nuevamente!!!',
      });
    })
    this.tabla=false;
    this.button=true;


  }

  dateFormat(value:any){
    // // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }



}
