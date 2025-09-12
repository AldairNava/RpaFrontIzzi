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
    'NCuenta',
    'Nº de orden',
    'Comentario',
    'Encuesta',
    'cliente',
    'Tel cel',
    'Tipo',
    'Hub'
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
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files![0];
  const extension = file.name.split('.').pop()?.toLowerCase();

  // 1) Validar extensión
  if (extension !== 'xlsx') {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'La extensión del archivo es incorrecta',
      detail: 'Ingresa un archivo con extensión XLSX!!',
    });
    fileInput.value = '';
    return;
  }

  const fileReader = new FileReader();

  // 2) onload: se dispara cuando ya leyó correctamente el binario
  fileReader.onload = (e: ProgressEvent<FileReader>) => {
    const binaryStr = e.target!.result as string;
    const workBook  = XLSX.read(binaryStr, { type: 'binary', cellDates: true });
    const sheet     = workBook.Sheets[ workBook.SheetNames[0] ];

    // 3) Convertir a JSON desde la fila 9 (range:8)
    this.ExcelData = XLSX.utils.sheet_to_json(sheet, { defval: '', range: 0 });
    // console.log('📥 Datos crudos de Excel:', this.ExcelData);

    // 4) Añadir Status, IP y FechaCaptura (-6 horas)
    const timestamp = moment().subtract(6, 'hours').format('YYYY-MM-DD HH:mm:ss');
    this.ExcelData.forEach((row: any) => {
      row.Status       = 'Registro pendiente';
      row.IP           = '';
      row.FechaCaptura = timestamp;
    });

    // 5) Mapeo final (mismos nombres que tu API .NET espera)
    this.ExcelData = this.ExcelData.map((row: any) => ({
      cuenta:       row['Ncuenta'],         
      orden:        row['Nº de orden'],     
      hub:          row['Hub'],     
      nombre:       row['cliente'],         
      telefono:     row['Cuenta'],          
      tipo:         row['Tipo'],            
      comentario:   row['Comentario']  || '',
      encuesta:     row['Valor']      || '',
      origen:     row['Origen']      || '',
      status:       row['Status'],
      Ip:           row['IP'],
      FechaCaptura: row['FechaCaptura'],
      Usuario_Captura: this.usuario.email || 'usuarion con cookies precargadas',

    }));
    // console.log('✅ Después de map, JSON a enviar:', JSON.stringify(this.ExcelData));

    // 6) Activar UI y permitir enviar
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Éxito!!!',
      detail: 'El archivo se ha procesado correctamente.',
    });
    this.tabla  = true;
    this.button = false;
  };

  // 7) onerror: si falla la lectura
  fileReader.onerror = (err) => {
    console.error('❌ Error leyendo el archivo Excel:', err);
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'No se pudo leer el archivo',
      detail: 'Intenta con otro archivo o revisa su formato.',
    });
    fileInput.value = '';
  };

  // 8) Finalmente lanza la lectura
  fileReader.readAsBinaryString(file);
}




  saveExcel() {
    this.cors.post('okcliente/InsertarBasesOkCliente2RPA',this.ExcelData).then((response) => {
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
