import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'ok-cliente',
  templateUrl: './ok-cliente.component.html',
  styleUrls: ['./ok-cliente.component.scss']
})
export class OkClienteComponent implements OnInit {
usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  msgs: Message[] = [];
  ExcelData:any=[];
  headers:string[]=[
    'Cuenta',
    'numeroOrden'
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
    let fileInput = event.target;
    let file = fileInput.files[0];
    let ultimo = file.name.split('.');
    if (ultimo[ultimo.length - 1] != 'xlsx') {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'La extensión del archivo es incorrecta',
        detail: 'Ingresa un archivo con extensión XLSX!!',
      });
      fileInput.value = ''; // Limpiar el input
    } else if (ultimo[ultimo.length - 1] == 'xlsx') {
      let fileReader = new FileReader();
      var pattern = /[^0-9a-zA-Z-]/g; // Patrón para encontrar caracteres no permitidos
      fileReader.readAsBinaryString(file);
      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary', cellDates: true });
        var sheetNames = workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { defval: '' });
        let extraHeaders = [];
        for (let [key, value] of Object.entries(this.ExcelData[0])) {
          if (!this.headers.includes(key)) {
            extraHeaders.push(key);
          }
        }
        if (extraHeaders.length > 0) {
          this.messageService.add({
            key: 'tst',
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'El archivo contiene ' + extraHeaders.length + ' columnas adicionales: (' + extraHeaders.join(', ') + '). Serán ignoradas.',
          });
        }
  
        let missingHeaders = this.headers.filter(header => !Object.keys(this.ExcelData[0]).includes(header));
  
        if (missingHeaders.length > 0) {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo no contiene las columnas requeridas: (' + missingHeaders.join(', ') + ')',
          });
          fileInput.value = ''; // Limpiar el input
        } else {
          this.ExcelData.forEach((row: any, index: number) => { // Especificar los tipos explícitamente
            let conflict = false;
            let conflictColumn = '';
            for (let [key, value] of Object.entries(row)) {
              if (pattern.test(value as string)) {
                conflict = true;
                conflictColumn = key;
                break;
              }
            }
            if (conflict) {
              row["Status"] = `Error base en Columna: ${conflictColumn}`;
            } else {
              row["Status"] = 'Registro pendiente';
            }
            row["Cve_usuario"] = this.usuario.email;
            row["IP"] = "";
            row["fechaCaptura"] = moment(Date.now()).format('yyyy-MM-DD HH:mm:ss');
          });
  
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
    }
  }
  


  saveExcel() {
    this.cors.post('okcliente/InsertarBasesOkCliente',this.ExcelData).then((response) => {
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
