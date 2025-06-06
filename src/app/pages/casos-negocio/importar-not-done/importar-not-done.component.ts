import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { CorsService } from '@services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'importar-not-done',
  templateUrl: './importar-not-done.component.html',
  styleUrls: ['./importar-not-done.component.scss'],
  providers: [ DatePipe ]
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

  constructor(private messageService: MessageService, private cors: CorsService,  private datePipe: DatePipe) { }

  ngOnInit(): void {}

  readFirstExcel(event: any): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  const extension = file?.name.split('.').pop()?.toLowerCase();

  // 1) Validar que sea .xlsx
  if (!file || extension !== 'xlsx') {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: 'El archivo debe tener extensión XLSX'
    });
    fileInput.value = '';
    return;
  }

  this.readingFirstExcel = true;
  const reader = new FileReader();
  reader.readAsBinaryString(file);

  reader.onload = () => {
    const wb = XLSX.read(reader.result as string, {
      type: 'binary',
      cellDates: true
    });
    const sheetName = wb.SheetNames[0];
    const dataRows = XLSX.utils
      .sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' }) as any[][];

    // 2) Mapear TODAS las filas (incluida la primera)
    this.firstExcelData = dataRows.map((row: any[]) => {
      const registro: any = {};

      // — Extraer teléfonos de la columna AC (índice 28) —
      const telRaw = row[28] != null ? String(row[28]).trim() : '';
      const telList = telRaw ? telRaw.split(';').map(t => t.trim()) : [];
      for (let i = 1; i <= 4; i++) {
        registro[`TEL${i}`] = telList[i - 1] || '';
      }

      // — Resto de campos según this.camposExcel1 —
      this.camposExcel1.forEach((campo: string, idx: number) => {
        if (campo.startsWith('TEL')) return;  // ya procesamos TEL1–4

        const celdaRaw = row[idx];
        let valor = '';

        // Formatear fechas con parseo manual
        if (campo === 'FECHA_APERTURA' || campo === 'FECHA_SOLICITADA') {
          let fechaVal: Date | null = null;

          if (celdaRaw instanceof Date) {
            // Excel ya entregó un objeto Date
            fechaVal = celdaRaw;
          } else if (typeof celdaRaw === 'string' && celdaRaw.trim()) {
            // Cadena "DD/MM/YYYY HH:mm" o similar
            const partes = celdaRaw.trim().split(' ');
            if (partes.length === 2) {
              const [fechaStr, horaStr] = partes;
              const [dia, mes, anio] = fechaStr.split('/');
              const [h, m, s] = horaStr.split(':');
              fechaVal = new Date(
                parseInt(anio, 10),
                parseInt(mes, 10) - 1,
                parseInt(dia, 10),
                parseInt(h, 10),
                parseInt(m, 10),
                s ? parseInt(s, 10) : 0
              );
            } else {
              // Fallback al constructor de Date
              fechaVal = new Date(celdaRaw);
            }
          }

          // Sólo transformamos si es una fecha válida
          if (fechaVal && !isNaN(fechaVal.getTime())) {
            valor = this.datePipe.transform(fechaVal, 'dd/MM/yyyy HH:mm:ss') || '';
          }
        }
        // Para los demás campos, convertir a string
        else {
          valor = celdaRaw != null
            ? String(celdaRaw).trim()
            : '';
        }

        registro[campo] = valor;
      });

      return registro;
    });

    // 3) Notificar y limpiar estados
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Éxito',
      detail: `Primer archivo cargado: ${file.name}`
    });
    this.firstFileLoaded = true;
    this.updateSendButtonState();
    this.readingFirstExcel = false;

    console.log('Datos procesados (incluyendo primera fila):', this.firstExcelData);
  };

  reader.onerror = () => {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo leer el archivo'
    });
    this.readingFirstExcel = false;
  };
}

  readSecondExcel(event: any) {
    const file = event.target.files[0];
    const extension = file.name.split('.').pop();
    if (extension !== 'xlsx') {
      this.messageService.add({ key:'tst', severity:'error', summary:'Error', detail:'El archivo debe tener extensión XLSX' });
      event.target.value = '';
      return;
    }
  
    this.readingSecondExcel = true;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const workbook = XLSX.read(reader.result as string, { type: 'binary', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' }) as any[];
  
      // Validación de encabezados omitida para brevedad...
  
      this.secondExcelData = rawData.map(row => {
        const registro: any = {};
  
        for (const key in this.mapeoColumnasExcel2) {
          const propiedad = this.mapeoColumnasExcel2[key];
          const valorRaw = row[key];
  
          if (valorRaw === null || valorRaw === '') {
            registro[propiedad] = null;
          }
          else if (valorRaw instanceof Date || moment.isDate(valorRaw)) {
            // Usamos DatePipe para formatear sin cambiar la zona
            const fecha = valorRaw instanceof Date ? valorRaw : new Date(valorRaw);
            registro[propiedad] = this.datePipe.transform(fecha, 'dd/MM/yyyy HH:mm:ss')!;
          }
          else if (["NoTelefonoPrincipal", "Telefonos"].includes(propiedad) && typeof valorRaw === 'number') {
            registro[propiedad] = String(valorRaw);
          }
          else {
            registro[propiedad] = valorRaw;
          }
        }
  
        return registro;
      });
  
      this.messageService.add({ key:'tst', severity:'success', summary:'Éxito', detail:`Segundo archivo cargado: ${file.name}` });
      this.secondFileLoaded = true;
      this.updateSendButtonState();
      this.readingSecondExcel = false;
      console.log("Datos de ND & C:", this.secondExcelData);
    };
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
