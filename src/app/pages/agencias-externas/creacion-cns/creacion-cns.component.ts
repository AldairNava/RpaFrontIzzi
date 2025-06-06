import { Component, OnInit } from '@angular/core';
import { Message,MessageService } from 'primeng/api';
import { CorsService } from '@services';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'creacion-cns',
  templateUrl: './creacion-cns.component.html',
  styleUrls: ['./creacion-cns.component.scss']
})
export class CreacionCNsComponent implements OnInit {
usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  msgs: Message[] = [];
  ExcelData:any=[];
  button:boolean=true;
  tabla:boolean=false;

  constructor(
    private cors: CorsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
  }

readExcel(event: any) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // 1) Validar extensión
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext !== 'xlsx') {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Extensión incorrecta',
      detail: 'El archivo debe ser .xlsx'
    });
    input.value = '';
    return;
  }

  const reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = () => {
    const wb = XLSX.read(reader.result, { type: 'binary', cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];

    // Encabezados requeridos (sin espacios al inicio o fin)
    const required = [
      'CUENTA', 'FECHA SUBIDA', 'CATEGORIA', 'MOTIVO',
      'SUB MOTIVO', 'SOLUCIÓN', 'SALDO INCOBRABLE',
      'PROMOCION', 'AJUSTE', 'FECHA GESTIÓN', 'TIPO'
    ];

    // 2) Lectura HORIZONTAL usando la primera fila como header
    let horizontalRaw: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
    // Normalizar claves (trim de espacios)
    const horizontal = horizontalRaw.map(row => {
      const obj: any = {};
      Object.entries(row).forEach(([k, v]) => {
        obj[String(k).trim()] = v;
      });
      return obj;
    });

    const actualH = Object.keys(horizontal[0] || {});
    const faltanH = required.filter(h => !actualH.includes(h));

    if (faltanH.length === 0) {
      // --- Mapeo HORIZONTAL corregido ---
      this.ExcelData = horizontal.map(row => ({
        Status: 'Registro pendiente',
        Cve_usuario: this.usuario.email,
        Ip: '',
        Cuenta: row['CUENTA'],
        FechaSubida: moment(row['FECHA SUBIDA'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
        Categoria: row['CATEGORIA'],
        Mootivo: row['MOTIVO'],
        SubMotivo: row['SUB MOTIVO'],
        Solucion: row['SOLUCIÓN'],
        SaldoIncobrable: row['SALDO INCOBRABLE'],
        Promocion: row['PROMOCION'],
        Ajuste: row['AJUSTE'],
        FechaGestion: moment(row['FECHA GESTIÓN'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
        Tipo: row['TIPO']
      }));
    } else {
      // --- Fallback VERTICAL (igual que antes) ---
      const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      const record: Record<string, any> = {};
      for (let i = 1; i < rows.length; i++) {
        const [key, val] = rows[i];
        if (key) record[String(key).trim()] = val;
      }
      const faltanV = required.filter(k => !(k in record));
      if (faltanV.length) {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Faltan columnas',
          detail: `No se encontró: (${faltanV.join(', ')})`
        });
        input.value = '';
        return;
      }
      this.ExcelData = [{
        Status: 'Registro pendiente',
        Cve_usuario: this.usuario.email,
        Ip: '',
        Cuenta: record['CUENTA'],
        FechaSubida: moment(record['FECHA SUBIDA'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
        Categoria: record['CATEGORIA'],
        Mootivo: record['MOTIVO'],
        SubMotivo: record['SUB MOTIVO'],
        Solucion: record['SOLUCIÓN'],
        SaldoIncobrable: record['SALDO INCOBRABLE'],
        Promocion: record['PROMOCION'],
        Ajuste: record['AJUSTE'],
        FechaGestion: moment(record['FECHA GESTIÓN'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
        Tipo: record['TIPO']
      }];
    }

    // 3) Notificar y mostrar tabla
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Archivo procesado',
      detail: 'Datos listos para enviar al servicio.'
    });
    this.tabla = true;
    this.button = false;

    console.log(this.ExcelData);
  };
}


  saveExcel() {
    this.cors.post('AgenciasExternas/InsertarBasesCrearCNs',this.ExcelData).then((response) => {
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
