import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'call-trouble',
  templateUrl: './call-trouble.component.html',
  styleUrls: ['./call-trouble.component.scss']
})
export class CallTroubleComponent implements OnInit {
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  msgs: Message[] = [];
  ExcelData:any=[];
  headers:string[]=[
    'Cuenta',
    'Tipo',
    'Motivo',
    'Comentarios',
  ];
  button:boolean=true;
  tabla:boolean=false;
  
  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }

  readExcel(event: any) {
    let file = event.target.files[0];
    let ultimo = file.name.split('.');
    if (ultimo[ultimo.length - 1] != 'xlsx') {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'La extensión del archivo es incorrecta',
        detail: 'Ingresa un archivo con extensión XLSX!!',
      });
    } else if (ultimo[ultimo.length - 1] == 'xlsx') {
      let fileReader = new FileReader();
      var pattern = /[\^*@!"#$%&/()=?¡!¿'\\]/gi;
      fileReader.readAsBinaryString(file);
      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary', cellDates: true });
        var sheetNames = workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { defval: '' });
  
        // Eliminar espacios en blanco al inicio y al final de los encabezados
        this.ExcelData = this.ExcelData.map((row: any) => {
          let newRow: any = {};
          Object.keys(row).forEach((key) => {
            let trimmedKey = key.trim();
            newRow[trimmedKey] = row[key];
          });
          return newRow;
        });
  
        let count = 0;
        for (let [key, value] of Object.entries(this.ExcelData[0])) {
          for (let i = 0; i < this.headers.length; i++) {
            if (key == this.headers[i].trim()) {
              count++;
            }
          }
        }
  
        if (count == 4) {
          Object.keys(this.ExcelData).forEach((key) => {
            this.ExcelData[key]["Status"] = 'Pendiente';
            this.ExcelData[key]["Cve_usuario"] = this.usuario.email;
            this.ExcelData[key]["Procesando"] = "0";
            this.ExcelData[key]["IP"] = "";
            this.ExcelData[key]["FechaCaptura"] = moment(Date.now()).format('yyyy-MM-DD HH:mm:ss');
          });
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Exito!!!',
            detail: 'El archivo se ha cargado completamente!!!',
          });
          this.tabla = true;
          this.button = false;
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'El formato del archivo es incorrecto!!!',
          });
        }
      };
    }
  }
  saveExcel() {
    this.cors.post('AjustesNotDone/InsertarBasesOrdenTrouble',this.ExcelData).then((response) => {
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

