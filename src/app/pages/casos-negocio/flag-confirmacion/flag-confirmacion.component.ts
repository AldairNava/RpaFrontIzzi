import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { CorsService } from '@services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-flag-confirmacion',
  templateUrl: './flag-confirmacion.component.html',
  styleUrls: ['./flag-confirmacion.component.scss'],
  providers: [MessageService]
})
export class FlagConfirmacionComponent {
  ExcelData: any[] = [];
  tabla: boolean = false;
  button: boolean = true;
  spinner: boolean = false;

  constructor(
    private cors: CorsService,
    private messageService: MessageService
  ) {}

  readExcel(event: any) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = (e: any) => {
    let data = e.target.result;
    let workbook = XLSX.read(data, { type: 'binary', codepage: 65001 });
    let sheetName = workbook.SheetNames[0];
    let sheet = workbook.Sheets[sheetName];
    let rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const headersRequeridos = [
      'Cuenta', 'NomCliente', 'ServicioContratado', 'FechaInstalacion',
      'NumOrden', 'NomCampaña', 'OpcionDigitada', 'DNIS'
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
      let fecha = row['FechaInstalacion'];
      if (typeof fecha === 'number') {
        fecha = this.excelSerialToDate(fecha);

      }
      return {
        Ip: '',
        OrdenGeneada: '',
        FechaCaptura: null,
        FechaCompletado: null,
        Status: 'Pendiente',
        Cve_usuario: email,
        Cuenta: String(row['Cuenta'] ?? ''),
        NomCliente: String(row['NomCliente'] ?? ''),
        ServicioContratado: String(row['ServicioContratado'] ?? ''),
        FechaInstalacion: String(fecha ?? ''),
        NumOrden: String(row['NumOrden'] ?? ''),
        NomCampana: String(row['NomCampaña'] ?? ''),
        OpcionDigitada: String(row['OpcionDigitada'] ?? ''),
        DNIS: String(row['DNIS'] ?? '')
      };
    });


    this.tabla = true;
    this.button = false;
    this.messageService.add({key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Base importada correctamente' });
    console.log(this.ExcelData);
  };

  if (file.name.endsWith('.csv')) {
    reader.readAsBinaryString(file);
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
  return date_info.toISOString().slice(0, 10);
}



  resetFileInput() {
    (document.getElementById('file') as HTMLInputElement).value = '';
    this.ExcelData = [];
    this.tabla = false;
    this.button = true;
  }

  saveExcel() {
  this.spinner = true;
  this.cors.post('AjustesNotDone/InsertarFlagConfirmacion', this.ExcelData)
    .then((response) => {
      this.spinner = false;
      this.messageService.add({key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Base Insertada correctamente' });
      this.resetFileInput();
    }).catch((err) => {
      this.spinner = false;
      this.messageService.add({key: 'tst', severity: 'error', summary: 'Error', detail: 'Error al importar' });
    });
}

}
