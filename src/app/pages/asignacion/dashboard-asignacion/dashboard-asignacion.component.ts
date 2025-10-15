import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'dashboard-asignacion',
  templateUrl: './dashboard-asignacion.component.html',
  styleUrls: ['./dashboard-asignacion.component.scss']
})
export class DashboardAsignacionComponent implements OnInit {
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}");
  msgs: Message[] = [];
  ExcelData: any = [];
  button: boolean = true;
  tabla: boolean = false;
  spinner: boolean = false;

  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {}

  // Convierte fechas dd/MM/yyyy HH:mm:ss a ISO 8601 (UTC)
  toISODate(input: string): string {
    if (!input) return '';
    const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return input;
    const [_, dd, mm, yyyy, hh, min, ss] = match;
    return `${yyyy}-${mm}-${dd}T${hh.padStart(2, '0')}:${min}:${(ss || '00').padStart(2, '0')}.000Z`;
  }

  // Convierte número serial de Excel a Date
  excelSerialToDate(serial: number): Date {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
    return date;
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
        const workbook = XLSX.read(data, { type: 'binary', codepage: 65001 });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      }

      const headersRequeridos = [
        'Fecha de asignación',
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
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: `Falta el encabezado: ${faltaHeader}` });
        this.ExcelData = [];
        this.tabla = false;
        this.button = true;
        return;
      }

      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const email = user?.email || '';

      this.ExcelData = rows.map(row => {
        let fechaAsignacion = row['Fecha de asignación'];
        let vencimiento = row['Vencimiento'];

        if (typeof fechaAsignacion === 'number') {
          fechaAsignacion = this.excelSerialToDate(fechaAsignacion).toISOString();
        } else if (fechaAsignacion instanceof Date) {
          fechaAsignacion = fechaAsignacion.toISOString();
        } else {
          const parsed = this.toISODate(fechaAsignacion);
          fechaAsignacion = parsed ? new Date(parsed).toISOString() : null;
        }

        if (typeof vencimiento === 'number') {
          vencimiento = this.excelSerialToDate(vencimiento).toISOString();
        } else if (vencimiento instanceof Date) {
          vencimiento = vencimiento.toISOString();
        } else {
          const parsed = this.toISODate(vencimiento);
          vencimiento = parsed ? new Date(parsed).toISOString() : null;
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
          vencimiento,
          ComentariosCN: String(row['Comentarios CN'] ?? ''),
          AreaConocimiento: String(row['Área de conocimiento'] ?? ''),
          fechaAsignacion
        };
      });

      this.tabla = true;
      this.button = false;
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Base importada correctamente' });
      console.log(this.ExcelData);
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file, 'latin1');
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsBinaryString(file);
    } else {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Tipo de archivo no soportado' });
      this.ExcelData = [];
      this.tabla = false;
      this.button = true;
    }
  }

  saveExcel() {
    this.spinner = true;
    this.cors.post('AjustesNotDone/InsertarAjustesConValidacion', this.ExcelData)
      .then(() => {
        this.spinner = false;
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Base insertada correctamente' });
        this.resetFileInput();
      })
      .catch(() => {
        this.spinner = false;
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Error al importar' });
      });
  }

  resetFileInput() {
    (document.getElementById('file') as HTMLInputElement).value = '';
    this.ExcelData = [];
    this.tabla = false;
    this.button = true;
  }

  dateFormat(value: any) {
    return value ? moment(value).format('DD/MM/YYYY HH:mm:ss') : '';
  }
}
