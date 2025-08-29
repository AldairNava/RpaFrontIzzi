import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

@Component({
  selector: 'subirbase-sin-validacion',
  templateUrl: './subirbase-sin-validacion.component.html',
  styleUrls: ['./subirbase-sin-validacion.component.scss']
})
export class SubirbaseSinValidacionComponent implements OnInit {
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  msgs: Message[] = [];
  ExcelData:any=[];
  headers:string[]=[
    'Cuenta',
    'Motivo ajuste',
    'Comentario ajuste',
    'Cantidad a ajustar',
    'Tipo de Ajuste',
    'Prioridad'
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
        return;
    }

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
        let workBook = XLSX.read(fileReader.result, { type: 'binary', cellDates: true });
        let sheetNames = workBook.SheetNames;
        let rawData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { defval: '' }) as any[];

        let fileHeaders = Object.keys(rawData[0] || {});
        let expectedHeaders = this.headers; // Incluye 'Prioridad'

        // Columnas que no sean 'Prioridad'
        let headersSinPrioridad = expectedHeaders.filter(h => h !== 'Prioridad');
        let missingHeaders = headersSinPrioridad.filter(h => !fileHeaders.includes(h));
        let faltaPrioridad = !fileHeaders.includes('Prioridad');

        if (missingHeaders.length > 0) {
            this.messageService.add({
                key: 'tst',
                severity: 'error',
                summary: 'Error de columnas',
                detail: `El archivo no contiene las siguientes columnas obligatorias: ${missingHeaders.join(', ')}`,
            });
            return;
        }

        if (faltaPrioridad) {
            this.messageService.add({
                key: 'tst',
                severity: 'warn',
                summary: 'Atención',
                detail: 'El campo PRIORIDAD no viene en el archivo. Se asignará prioridad = 2 por default.',
            });
        }

        let regex = /^[a-zA-Z0-9% ]+$/;
        let regex1 = /^[0-9.]+$/;
        for (let i = 0; i < rawData.length; i++) {
            let status = 'Registro pendiente';
            let item = rawData[i];

            let motivo = item['Motivo ajuste'];
            let comentario = item['Comentario ajuste'];
            let cantidad = item['Cantidad a ajustar'];
            let tipo = item['Tipo de Ajuste'];

            if (motivo && motivo.toUpperCase() !== 'CONVENIO DE COBRANZA' &&
                motivo.toUpperCase() !== 'CARGO POR PAGO EXTEMPORANEO' &&
                motivo.toUpperCase() !== 'AJUSTE POR PROMOCIONES') {
                status = 'Error Base Motivo ajuste incorrecto';
            }
            if (comentario && !regex.test(comentario)) {
                status = 'Error Base Comentario ajuste incorrecto';
            }
            if (cantidad && !regex1.test(cantidad)) {
                status = 'Error Base Cantidad a ajustar incorrecto';
            }
            if (tipo && tipo.toLowerCase() != 'a favor' &&
                tipo.toLowerCase() != 'en contra') {
                status = 'Error Base Tipo de Ajuste incorrecto';
            }

            item["Status"] = status;
            item["Cve_usuario"] = this.usuario.email;
            item["Procesando"] = "0";
            item["IP"] = "";
            item["fechaCaptura"] = moment(Date.now()).format('yyyy-MM-DD HH:mm:ss');
        }

        this.ExcelData = rawData.map(item => ({
            cuenta: item['Cuenta'],
            motivoAjuste: item['Motivo ajuste'],
            comentarioAjuste: item['Comentario ajuste'],
            cantidadAjustar: item['Cantidad a ajustar'],
            tipoAplicacion: item['Tipo de Ajuste'],
            Cve_usuario: item['Cve_usuario'],
            IP: item['IP'],
            Procesando: item['Procesando'],
            Status: item['Status'],
            FechaCaptura: item['fechaCaptura'],
            prioridad: typeof item['Prioridad'] !== "undefined" && item['Prioridad'] !== "" ? item['Prioridad'] : null
        }));

        this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Éxito!!!',
            detail: 'El archivo se ha cargado completamente!!!',
        });

        this.tabla = true;
        this.button = false;
    }
}





resetFileInput() {
  const inputElement = document.getElementById("file") as HTMLInputElement;
  if (inputElement) {
      inputElement.value = "";
  }
  this.ExcelData = [];
  this.tabla = false;
}



  saveExcel() {
    this.cors.post('AjustesNotDone/InsertarBasesAjustesSinValidacion',this.ExcelData).then((response) => {
      // console.log(response)
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Importado',
        detail: 'Correctamente!!',
      }); 
    }).catch((error) => {
      console.log(error)
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
    const inputElement = document.getElementById("file") as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }

  }

  dateFormat(value:any){
    // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }


}
