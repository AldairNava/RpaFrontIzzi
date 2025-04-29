import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { CorsService } from '@services';

@Component({
  selector: 'importar-not-done',
  templateUrl: './importar-not-done.component.html',
  styleUrls: ['./importar-not-done.component.scss']
})
export class ImportarNotDoneComponent implements OnInit {
  firstExcelData: any[] = [];
  secondExcelData: any[] = [];
  firstFileLoaded: boolean = false;
  secondFileLoaded: boolean = false;
  sendButtonDisabled: boolean = true;
  loading: boolean = false; // Controla el spinner al enviar datos

  // Nuevas propiedades para indicar que se está leyendo el archivo
  readingFirstExcel: boolean = false;
  readingSecondExcel: boolean = false;

  private camposExcel1: string[] = [
    "CUENTA", "NOMBRE_CLIENTE", "TIPO_CLIENTE", "SUBTIPO_CLIENTE", "DIRECCION",
    "TIPO_ORDEN", "SUBTIPO_ORDEN", "PAQUETE", "NUMERO_ORDEN", "ESTADO_ORDEN",
    "FECHA_APERTURA", "FECHA_SOLICITADA", "MOTIVO_ORDEN", "HUB", "RPT",
    "CIUDAD", "PLAZA", "VENDEDOR", "TECNICO", "CREADO_POR", "ULTIMA_MOD_POR",
    "REFERIDO", "NUM_REPRO", "MOTIVO_REPROGRAMACION", "MOTIVO_CANCELACION",
    "SITUACION_ANTICIPO", "PERFIL_PAGO", "COMENTARIOS", "TEL1", "TEL2", "TEL3", "TEL4"
  ];
  private mapeoColumnasExcel2: any = {
    "Canal de Ingreso": "CanalDeIngreso",
    "Estado Admision": "EstadoAdmision",
    "Fecha Admision": "FechaAdmision",
    "Tipo de Cuenta": "TipoDeCuenta",
    "No. Telefono principal": "NoTelefonoPrincipal",
    "Teléfonos": "Telefonos",
    "Tipo EMTA": "TipoEMTA",
    "Cta. Especial": "CtaEspecial",
    "Hub": "Hub",
    "Motivo de la orden": "MotivoDeLaOrden",
    "Orden de Portabilidad": "OrdenDePortabilidad",
    "Referido": "Referido",
    "Motivo de la cancelacion": "MotivoDeLaCancelacion",
    "Sistema": "Sistema",
    "Sub-Estado": "SubEstado",
    "No. VTS": "NoVTS",
    "Clave Vendedor": "ClaveVendedor",
    "Mensualidad total": "MensualidadTotal",
    "Total de CNR": "TotalDeCNR",
    "Documento de prueba": "DocumentoDePrueba",
    "Estado en fecha": "EstadoEnFecha",
    "Código de tipo de orden": "CodigoDeTipoDeOrden",
    "Revisión": "Revision",
    "Cuenta de facturación": "CuentaDeFacturacion",
    "Transferido al libro de trabajo de transacciones": "TransferidoAlLibroDeTrabajoDeTransacciones",
    "Equipo": "Equipo",
    "Fecha de la orden": "FechaDeLaOrden",
    "Activo": "Activo",
    "Aplica Tablet": "AplicaTablet",
    "Confirmación de Instalacion": "ConfirmacionDeInstalacion",
    "Nº de orden": "NumeroDeOrden",
    "Clave del Tecnico Principal": "ClaveDelTecnicoPrincipal",
    "Tipo": "Tipo",
    "Estado de asignación de crédito": "EstadoDeAsignacionDeCredito",
    "No. Programaciones": "NoProgramaciones",
    "Estado": "Estado",
    "Compañía": "Compania",
    "Centro": "Centro",
    "Lista de impuestos": "ListaDeImpuestos",
    "Dirección": "Direccion",
    "Apellidos": "Apellidos",
    "Nombre": "Nombre",
    "Prioridad": "Prioridad",
    "Nº de cuenta": "NumeroDeCuenta",
    "Aprobado": "Aprobado",
    "Aprobado por": "AprobadoPor",
    "Moneda": "Moneda",
    "Lista de precios": "ListaDePrecios",
    "% de descuento": "PorcentajeDeDescuento",
    "Completada Por": "CompletadaPor",
    "Motivo de reprogramacion": "MotivoDeReprogramacion",
    "Enviada Por": "EnviadaPor",
    "Ultima Modificacion Por": "UltimaModificacionPor",
    "Ultima Modificacion": "UltimaModificacion",
    "Comentarios": "Comentarios",
    "Creado por": "CreadoPor",
    "Creado": "Creado",
    "Fecha solicitada": "FechaSolicitada"
  };

  constructor(private messageService: MessageService, private cors: CorsService) { }

  ngOnInit(): void {}

  readFirstExcel(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const extension = file.name.split('.').pop();
  
    if (extension !== 'xlsx') {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'El archivo debe tener extensión XLSX' });
      fileInput.value = '';
      return;
    }
  
    this.readingFirstExcel = true;
  
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const binaryData = reader.result;
      const workbook = XLSX.read(binaryData, { type: 'binary', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const dataRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' }) as any[];
  
      this.firstExcelData = dataRows.map((row: any) => {
        let registro: any = {};
  
        // Separamos la primer columna y validamos el último campo
        const firstCol = row[0] || '';
        const values = firstCol.split(',');
        const lastValue = values[values.length - 1].trim();
        const isValidTel = /^\d{10}$/.test(lastValue); // true si es un número de 10 dígitos
  
        this.camposExcel1.forEach((campo: string, index: number) => {
          if (campo.startsWith('TEL')) {
            if (isValidTel) {
              if (campo === 'TEL1') {
                // Si es válido, TEL1 proviene del último campo de la primer columna
                registro[campo] = lastValue;
              } else {
                // Para TEL2, TEL3, etc., se leen desde las siguientes columnas:
                // Se extrae el número del campo (ej. TEL2 -> 2) y se ajusta:
                // TEL2 se asigna desde row[1], TEL3 desde row[2], etc.
                const telNum = parseInt(campo.replace('TEL', ''), 10);
                const colIndex = telNum - 1; // TEL2 => 1, TEL3 => 2, etc.
                registro[campo] = row[colIndex] && row[colIndex] !== undefined && row[colIndex] !== null
                  ? row[colIndex].toString().trim()
                  : "";
              }
            } else {
              // Si el último campo no es un teléfono válido,
              // se leen los teléfonos empezando desde la columna B (índice 1):
              const telNum = parseInt(campo.replace('TEL', ''), 10);
              const colIndex = telNum; // TEL1 => 1, TEL2 => 2, etc.
              registro[campo] = row[colIndex] && row[colIndex] !== undefined && row[colIndex] !== null
                ? row[colIndex].toString().trim()
                : "";
            }
          } else {
            // Para los demás campos se utilizan los valores separados de la primer columna
            registro[campo] = values[index] && values[index] !== undefined && values[index] !== null
              ? values[index].trim()
              : "";
          }
        });
  
        return registro;
      });
  
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Primer archivo cargado: ' + file.name });
      this.firstFileLoaded = true;
      this.updateSendButtonState();
      this.readingFirstExcel = false;
      console.log("Datos de sin encabezado: ", this.firstExcelData);
    }
  }
  

  
  
  convertToDateFormat(dateStr: string): string {
    if (dateStr == null || dateStr === '') {
      return dateStr;
    }
    const date = moment(dateStr, moment.ISO_8601);
    return date.isValid() ? date.toISOString() : dateStr;
  }
  



  readSecondExcel(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const extension = file.name.split('.').pop();

    if (extension !== 'xlsx') {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'El archivo debe tener extensión XLSX' });
      fileInput.value = '';
      return;
    }

    this.readingSecondExcel = true; // Indicar que se está leyendo el archivo

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const binaryData = reader.result;
      const workbook = XLSX.read(binaryData, { type: 'binary', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' }) as any[];

      if (rawData.length > 0) {
        const headerKeys = Object.keys(rawData[0]);
        const requiredKeys = Object.keys(this.mapeoColumnasExcel2);
        const missingKeys = requiredKeys.filter(key => !headerKeys.includes(key));

        if (missingKeys.length > 0) {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo no contiene las columnas requeridas: ' + missingKeys.join(', ')
          });
          fileInput.value = '';
          this.readingSecondExcel = false;
          return;
        }
      }

      this.secondExcelData = rawData.map((row: any) => {
        let registro: any = {};
        
        for (let key in this.mapeoColumnasExcel2) {
          let propiedad = this.mapeoColumnasExcel2[key];
          let valor = row[key];

          // Verificar si el valor es nulo o vacío
          if (valor === undefined || valor === null || valor === '') {
            registro[propiedad] = null;
          } else if (moment.isDate(valor) || valor instanceof Date) {
            // Convertir fechas a formato ISO
            registro[propiedad] = moment(valor).toISOString();
          } else {
            // Convertir ciertos valores como teléfonos en cadenas
            if (["NoTelefonoPrincipal", "Telefonos"].includes(propiedad) && typeof valor === 'number') {
              registro[propiedad] = String(valor);
            } else {
              registro[propiedad] = valor;
            }
          }
        }

        if (registro["FechaAdmision"]) {
          registro["FechaAdmision"] = this.convertToDateFormat(registro["FechaAdmision"]);
        }
        if (registro["FechaDeLaOrden"]) {
          registro["FechaDeLaOrden"] = this.convertToDateFormat(registro["FechaDeLaOrden"]);
        }
        if (registro["FechaSolicitada"]) {
          registro["FechaSolicitada"] = this.convertToDateFormat(registro["FechaSolicitada"]);
        }
        if (registro["UltimaModificacion"]) {
          registro["UltimaModificacion"] = this.convertToDateFormat(registro["UltimaModificacion"]);
        }

        return registro;
      });

      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Segundo archivo cargado: ' + file.name });
      this.secondFileLoaded = true;
      this.updateSendButtonState();
      this.readingSecondExcel = false;
      console.log("Datos de ND & C: ", this.secondExcelData);
    }
  }

  updateSendButtonState() {
    this.sendButtonDisabled = !(this.firstFileLoaded && this.secondFileLoaded);
  }

  sendData() {
    this.loading = true;
    this.cors.post('DepuracionNotdone/InsertarBasesDepuracionNotDoneOriginal', this.secondExcelData)
      .then(response1 => {
        this.cors.post('DepuracionNotdone/InsertarBasesDepuracionNotdone', this.firstExcelData)
          .then(response2 => {
            this.cors.get('DepuracionNotdone/ProcedimientoNotdone')
              .then(response3 => {
                this.messageService.add({
                  key: 'tst',
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Datos enviados y procedimiento ejecutado correctamente.'
                });
                this.firstFileLoaded = false;
                this.secondFileLoaded = false;
                this.sendButtonDisabled = true;
                this.loading = false;
              })
              .catch(error => {
                this.messageService.add({
                  key: 'tst',
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Datos enviados y procedimiento ejecutado correctamente.'
                });
                this.loading = false;
              });
          })
          .catch(error => {
            this.messageService.add({
              key: 'tst',
              severity: 'error',
              summary: 'Error',
              detail: 'Error al enviar datos del segundo Excel.'
            });
            this.loading = false;
          });
      })
      .catch(error => {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Error al enviar datos del primer Excel.'
        });
        this.loading = false;
      });
  }
  
}
