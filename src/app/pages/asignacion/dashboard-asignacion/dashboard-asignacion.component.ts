import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'dashboard-asignacion',
  templateUrl: './dashboard-asignacion.component.html',
  styleUrls: ['./dashboard-asignacion.component.scss']
})
export class DashboardAsignacionComponent implements OnInit {
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  msgs: Message[] = [];
  ExcelData:any=[];
  headers:string[]=[
    'Caso de negocio',
    'Categoria',
    'Cuenta',
    'Estado',
    'Fecha de apertura',
    'Medio de contacto',
    'Motivo Cliente',
    'Motivos',
    'Solución',
    'Submotivo'
  ];
  button:boolean=true;
  tabla:boolean=false;

  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }

  toISODate(input: string): string {
  if (!input) return '';
  // Admite fechas con o sin segundos
  const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return '';
  const [, d, m, y, h, min, s] = match;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${h.padStart(2, '0')}:${min.padStart(2, '0')}:${(s ?? '00').padStart(2, '0')}`;
}


  readExcel(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e: any) => {
    let data = e.target.result;
    let rows: any[] = [];

    if (file.name.endsWith('.csv')) {
      const csvText = data;
      const lines = csvText.split(/\r\n|\n/);
      const headers = lines[0].split(';').map((h: string) => h.trim());

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(';');
        let row: any = {};
        headers.forEach((header: string, idx: number) => {
          row[header] = values[idx] ?? '';
        });
        rows.push(row);
      }
    } else {
      // Para XLSX/XLS
      let workbook = XLSX.read(data, { type: 'binary', codepage: 65001 });
      let sheetName = workbook.SheetNames[0];
      let sheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    }

    // Encabezados requeridos
    const headersRequeridos = [
      'Fecha de asiganción',
      'Área de conocimiento',
      'Comentarios CN',
      'Vencimiento',
      'Estado de la asignación',
      'Nº de actividad',
      'Nº de caso de negocio',
      'Cliente'
    ];

    const archivoHeaders = Object.keys(rows[0] || {});
    const faltaHeader = headersRequeridos.find(h => !archivoHeaders.includes(h));
    if (faltaHeader) {
      this.messageService.add({key: 'tst', severity: 'error', summary: 'Error', detail: `Falta el encabezado: ${faltaHeader}` });
      this.ExcelData = [];
      this.tabla = false;
      this.button = true;
      return;
    }

    // Usuario actual
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const email = user?.email || '';

    this.ExcelData = rows.map(row => {
  let fechaAsignacion = row['Fecha de asiganción'];
  let vencimiento = row['Vencimiento'];

  // Si vienen como número (formato Excel)
  if (typeof fechaAsignacion === 'number') {
    fechaAsignacion = this.excelSerialToDate(fechaAsignacion);
  } else {
    fechaAsignacion = this.toISODate(fechaAsignacion);
  }
  if (typeof vencimiento === 'number') {
    vencimiento = this.excelSerialToDate(vencimiento);
  } else {
    vencimiento = this.toISODate(vencimiento);
  }

  return {
    Ip: '',
    OrdenGeneada: '',
    FechaCaptura: null,
    FechaCompletado: null,
    Status: 'Pendiente',
    SubStatus: '',
    Cve_usuario: email,
    Cliente: String(row['Cliente'] ?? ''),
    CasoNegocio: String(row['Nº de caso de negocio'] ?? ''),
    NumActividad: String(row['Nº de actividad'] ?? ''),
    EstadoAsignacion: String(row['Estado de la asignación'] ?? ''),
    Vencimiento: String(vencimiento ?? ''),
    ComentariosCN: String(row['Comentarios CN'] ?? ''),
    AreaConocimiento: String(row['Área de conocimiento'] ?? ''),
    FechaAsignacion: String(fechaAsignacion ?? '')
  };
});


    this.tabla = true;
    this.button = false;
    this.messageService.add({key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Base importada correctamente' });
    console.log(this.ExcelData);
  };

  if (file.name.endsWith('.csv')) {
    reader.readAsText(file, 'latin1');
  } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    reader.readAsBinaryString(file);
  } else {
    this.messageService.add({key: 'tst', severity: 'error', summary: 'Error', detail: 'Tipo de archivo no soportado' });
    this.ExcelData = [];
    this.tabla = false;
    this.button = true;
  }
}

excelSerialToDate(serial: number): string {
  const utc_days  = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

spinner: boolean = false;
  saveExcel() {
  this.spinner = true;
  this.cors.post('AjustesNotDone/InsertarAjustesConValidacion', this.ExcelData)
    .then((response) => {
      this.spinner = false;
      this.messageService.add({key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Base insertada correctamente' });
      this.resetFileInput();
    }).catch((err) => {
      this.spinner = false;
      this.messageService.add({key: 'tst', severity: 'error', summary: 'Error', detail: 'Error al importar' });
    });
}

resetFileInput() {
    (document.getElementById('file') as HTMLInputElement).value = '';
    this.ExcelData = [];
    this.tabla = false;
    this.button = true;
  }



  dateFormat(value:any){
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }


}
