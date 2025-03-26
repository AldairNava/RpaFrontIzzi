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
    
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const binaryData = reader.result;
      const workbook = XLSX.read(binaryData, { type: 'binary', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const dataRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' }) as any[];
      this.firstExcelData = dataRows.map((row: any) => {
        const line = row[0] || '';
        const values = line.split(',');
        let registro: any = {};
        this.camposExcel1.forEach((campo: string, index: number) => {
          registro[campo] = values[index] ? values[index].trim() : "";
        });
        return registro;
      });
      
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Primer archivo cargado: ' + file.name });
      this.firstFileLoaded = true;
      this.updateSendButtonState();
    }
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
          return;
        }
      }
      this.secondExcelData = rawData.map((row: any) => {
        let registro: any = {};
        for (let key in this.mapeoColumnasExcel2) {
          let propiedad = this.mapeoColumnasExcel2[key];
          let valor = row[key];
          if (valor === undefined || valor === null || valor === '') {
            registro[propiedad] = null;
          } else if (moment.isDate(valor) || valor instanceof Date) {
            registro[propiedad] = moment(valor).toISOString();
          } else {
            if (["NoTelefonoPrincipal", "Telefonos"].includes(propiedad) && typeof valor === 'number') {
              registro[propiedad] = Number.isInteger(valor) ? String(valor) : String(valor);
            } else {
              registro[propiedad] = valor;
            }
          }
        }
        return registro;
      });
      
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Segundo archivo cargado: ' + file.name });
      this.secondFileLoaded = true;
      this.updateSendButtonState();
    }
  }
  
  updateSendButtonState() {
    this.sendButtonDisabled = !(this.firstFileLoaded && this.secondFileLoaded);
  }

  sendData() {
    this.cors.post('DepuracionNotdoneController1/InsertarBasesDepuracionNotdone', this.firstExcelData)
      .then(response1 => {
        this.cors.post('DepuracionNotdoneController1/InsertarBasesDepuracionNotDoneOriginal', this.secondExcelData)
          .then(response2 => {
            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: 'Datos enviados correctamente.' });
            this.firstFileLoaded = false;
            this.secondFileLoaded = false;
            this.sendButtonDisabled = true;
          })
          .catch(error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Error al enviar datos del segundo Excel.' });
          });
      })
      .catch(error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Error al enviar datos del primer Excel.' });
      });
  }
  
}