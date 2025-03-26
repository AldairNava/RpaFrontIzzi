import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'retencion',
  templateUrl: './retencion.component.html',
  styleUrls: ['./retencion.component.scss']
})
export class RetencionComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}");
  msgs: Message[] = [];
  ExcelData: any = [];
  headers: string[] = [
    'Cuenta',
    'CasoNegocio'
  ];
  button: boolean = true;
  tabla: boolean = false;
  // Variable para almacenar la selección del radio button
  procesoSeleccionado: string = '';

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
      fileInput.value = '';
    } else if (ultimo[ultimo.length - 1] == 'xlsx') {
      let fileReader = new FileReader();
      var pattern = /[^0-9a-zA-Z-]/g;
      fileReader.readAsBinaryString(file);
      fileReader.onload = (e) => {
        var workBook = XLSX.read(fileReader.result, { type: 'binary', cellDates: true });
        var sheetNames = workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]], { defval: '' });
        
        // Construir el arreglo de encabezados esperados según el proceso seleccionado
        let expectedHeaders = [...this.headers];
        if (this.procesoSeleccionado === 'retencion 0') {
          expectedHeaders.push('EQUIPO');
        }
        
        // Convertir los encabezados del archivo y los esperados a minúsculas para compararlos sin distinción de mayúsculas/minúsculas
        const fileHeaders = Object.keys(this.ExcelData[0]).map(header => header.toLowerCase());
        const expectedHeadersLower = expectedHeaders.map(header => header.toLowerCase());
    
        // Verificar encabezados adicionales (se mostrarán advertencias)
        let extraHeaders: string[] = [];
        for (let key of Object.keys(this.ExcelData[0])) {
          if (!expectedHeadersLower.includes(key.toLowerCase())) {
            extraHeaders.push(key);
          }
        }
        // Si la única columna extra es "EQUIPO" y se seleccionó retencion 0, no se muestra el mensaje
        if (extraHeaders.length > 0) {
          if (!(this.procesoSeleccionado === 'retencion 0' && extraHeaders.length === 1 && extraHeaders[0].toLowerCase() === 'equipo')) {
            this.messageService.add({
              key: 'tst',
              severity: 'warn',
              summary: 'Advertencia',
              detail: 'El archivo contiene ' + extraHeaders.length + ' columnas adicionales: (' + extraHeaders.join(', ') + '). Serán ignoradas.',
            });
          }
        }
    
        // Verificar que no falten encabezados requeridos (comparación insensible a mayúsculas/minúsculas)
        let missingHeaders = expectedHeaders.filter(header => {
          return !Object.keys(this.ExcelData[0]).some(key => key.toLowerCase() === header.toLowerCase());
        });
    
        if (missingHeaders.length > 0) {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo no contiene las columnas requeridas: (' + missingHeaders.join(', ') + ')',
          });
          fileInput.value = '';
        } else {
          // Procesar cada fila y agregar la columna "Proceso" y el valor de "EQUIPO" según corresponda
          this.ExcelData.forEach((row: any, index: number) => {
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
            // Agregar la columna "Proceso" con el valor seleccionado
            row["Proceso"] = this.procesoSeleccionado;
            
            // Si el proceso es Convenio Cobranza, asignar null a "EQUIPO"
            if (this.procesoSeleccionado === 'Convenio Cobranza') {
              row["EQUIPO"] = null;
            }
            // Si el proceso es retencion 0, se conserva el valor leído del Excel en "EQUIPO"
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
  
  getEquipoValue(row: any): any {
    // Busca dentro de 'row' una propiedad que, en minúsculas, sea 'equipo'
    const equipoKey = Object.keys(row).find(k => k.toLowerCase() === 'equipo');
    return equipoKey ? row[equipoKey] : '';
  }
  
  
  resetFileInput() {
    const inputElement = document.getElementById("file") as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
    this.ExcelData = [];
    this.tabla = false;
    // (Opcional) Resetear la selección del radio button si se requiere
    this.procesoSeleccionado = '';
  }
  
  saveExcel() {
    this.cors.post('AjustesCambiosServicios/InsertarBasesRetencion0', this.ExcelData).then((response) => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Excel Importado',
        detail: 'Correctamente!!',
      }); 
    }).catch((error) => {
      console.log(error);
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Ocurrió un error, inténtalo nuevamente',
        detail: 'Intenta nuevamente!!!',
      });
      this.fileInput.nativeElement.value = '';
    });
    this.tabla = false;
    this.button = true;
  }

  dateFormat(value: any) {
    if (value != null) {
      return moment(value).format('DD/MM/yyyy HH:mm:ss');
    } else {
      return "";
    }
  }
}
