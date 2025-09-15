import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Message,MessageService,ConfirmationService,ConfirmEventType } from 'primeng/api';
import { CorsService } from '@services';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'reprocesos',
  templateUrl: './reprocesos.component.html',
  styleUrls: ['./reprocesos.component.scss']
})
export class ReprocesosComponent implements OnInit {

  constructor(
    private messageService: MessageService,
    private cors: CorsService,
  ) { }
  showtable:any=[];
  tipoReprocesoOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Masivo', value: 'masivo' }
    ];
    tipoCambioStatusOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Masivo', value: 'masivo' }
  ];
  estatusOptions = [
    { label: 'Error Obtencion Status Ajuste', value: 'Error Obtencion Status Ajuste' },
    { label: 'Error al crear cn', value: 'Error al crear cn' },
    { label: 'No aplica ajuste reciente', value: 'No aplica ajuste reciente' }
  ];
  
  tipoCambioStatus: string = 'individual';
  procesoSeleccionadoStatus: string = '';
  procesoSeleccionadoStatusMasivo: string = '';
  tipoReproceso: string = 'individual';
  idIndividual: string = '';
  displayConfirm: boolean = false;
  idsStatusFromFile: any[] = [];
  displayConfirmCambioStatusMasivo: boolean = false;
  displayConfirmCambioStatus: boolean = false;
  fileToUpload: File | null = null;
  fileToUploadStatus: File | null = null;
  displayConfirmMasivo: boolean = false;
  estatusSeleccionado: string = '';
  idCambioStatus: string = '';
  isAdmin: boolean = false;
  activeTabIndex: number = 0;
  idsFromFile: any[] = [];
  procesoSeleccionado: string = '';
  procesoSeleccionadoMasivo: string = '';
  loading = false;
  

  // Mapeo de proceso a status
  procesoStatusMap: { [key: string]: string } = {
    'okCliente2': 'Registro pendiente',
    'AjustesSinValidacion': 'Registro pendiente',
    'EjecucionNotDone': 'Pendiente',
    'CancelacionSinValidacion': 'Registro pendiente',
    'CasosNegocioSinValidacion': 'Pendiente',
    'AjustesBasesCasosNeogcioCobranza': 'Registro pendiente',
    'AjustesCambioServicios': 'Pendiente',
    'NotDoneCreacionOrdenModel': 'Pendiente',
    'DepuracionBasesCanceladasOSExt': 'Registro pendiente',
    'DepuracionBasesCanceladasOS': 'Registro pendiente',
    'OrdenTroubleCall': 'Pendiente'
  };

  private rawProcesos = [
    'Not Done Cancelacion - EjecucionNotDone',
    'Not Done Generacion CN - CasosNegocioSinValidacion',
    'Ajustes CV - AjustesBasesCasosNeogcioCobranza',
    'Ajustes SV - AjustesSinValidacion',
    'Depuracion EXT - DepuracionBasesCanceladasOSExt',
    'Depuracion CC - DepuracionBasesCanceladasOS',
    'Ok Cliente - okCliente2',
    'Trouble Call - OrdenTroubleCall'
  ];
  procesosOptions: { label: string; value: string }[] = [];

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
  }
  confirmarReprocesoIndividual() {
  this.displayConfirm = true;
}

  ngOnInit(): void {

    this.procesosOptions = this.rawProcesos.map(item => {
      const parts = item.split(' - ');
      return {
        label: parts[0].trim(),
        value: (parts[1] ?? parts[0]).trim()
      };
    });

    let user = JSON.parse(sessionStorage.getItem("user") || "{}")
    this.isAdmin = ['administrador', 'admin-cx', 'Administrador'].includes(user?.role);
  }

  cambiarStatusIndividual() {
  this.displayConfirmCambioStatus = false;
  this.loading = true;
  let usuario = JSON.parse(sessionStorage.getItem("user") || "{}")
  if (!usuario?.email) {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: 'No se puede cambiar el status porque se requiere un usuario.',
    });
    return;
  }

  const idNum = typeof this.idCambioStatus === 'string'
    ? parseInt(this.idCambioStatus, 10)
    : this.idCambioStatus;

  // El status es el seleccionado en el dropdown
  const status = this.estatusSeleccionado || 'Sin definir';

  this.cors.post('AjustesNotDone/cambiarStatusIndividual', {
    id: idNum,
    status: status,
    proceso: this.procesoSeleccionadoStatus,
    usuario: usuario.email
  })
  .then(response => {
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Status cambiado',
      detail: response?.message || 'Status cambiado correctamente'
    });this.loading = false;
  })
  .catch(error => {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Ocurrió un error al cambiar el status'
    });this.loading = false;
  });
}

confirmarReprocesoMasivo() {
      if (!this.idsFromFile.length) {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'No se encontraron IDs en el archivo.'
        });
        return;
      }
      this.displayConfirmMasivo = true;
    }

    // Masivo
onFileChange(event: any) {
  const file = event.target.files[0];
  this.fileToUpload = file;
  this.idsFromFile = [];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        const header = json[0] as string[];
        const idIndex = header.findIndex(h => h.toLowerCase() === 'id');
        if (idIndex === -1) {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo debe contener una columna llamada "id".'
          });
          return;
        }

        // Asigna el status a cada registro según el proceso seleccionado
        const status = this.procesoStatusMap[this.procesoSeleccionadoMasivo] || 'Pendiente';
        for (let i = 1; i < json.length; i++) {
          const row = json[i];
          if (row[idIndex] != null && row[idIndex] !== '') {
            this.idsFromFile.push({ id: row[idIndex], status: status, proceso: this.procesoSeleccionadoMasivo });
          }
        }

        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Éxito',
          detail: `Se leyeron ${this.idsFromFile.length} ID(s) correctamente.`
        });
      } catch (err: any) {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error al procesar',
          detail: err.message || 'Ocurrió un error inesperado al leer el archivo.'
        });
      }
    };
    reader.readAsBinaryString(file);
  }
}

  // Masivo
onFileChangeStatus(event: any) {
  const file = event.target.files[0];
  this.fileToUploadStatus = file;
  this.idsStatusFromFile = [];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        let data = e.target.result;
        let workbook = XLSX.read(data, { type: 'binary' });
        let sheetName = workbook.SheetNames[0];
        let sheet = workbook.Sheets[sheetName];
        let json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        const header = json[0] as string[];
        const idIndex = header.findIndex(h => h.toLowerCase() === 'id');
        const statusIndex = header.findIndex(h => h.toLowerCase() === 'status');
        if (idIndex === -1 || statusIndex === -1) {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'El archivo debe contener columnas llamadas "id" y "status".'
          });
          return;
        }
        for (let i = 1; i < json.length; i++) {
          const row = json[i] as any[];
          if (row[idIndex]) {
            this.idsStatusFromFile.push({
              id: row[idIndex],
              status: row[statusIndex],
              proceso: this.procesoSeleccionadoStatusMasivo
            });
          }
        }
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Éxito',
          detail: `Se leyeron ${this.idsStatusFromFile.length} registros correctamente.`
        });
        // console.log(this.idsStatusFromFile);
      } catch (err: any) {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo leer el archivo.'
        });
      }
    };
    reader.readAsBinaryString(file);
  }
}

    reprocesarMasivo() {
  this.displayConfirmMasivo = false;
  this.loading = true;
  const usuario = JSON.parse(sessionStorage.getItem("user") || "{}");
  if (!usuario?.email) {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: 'No se puede reprocesar porque se requiere un usuario.',
    });
    return;
  }
  this.cors.post('AjustesNotDone/reprocesarMasivo', {
    registros: this.idsFromFile,
    usuario: usuario.email,
    proceso: this.procesoSeleccionadoMasivo
  })
  .then(response => {
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Reprocesado',
      detail: response?.message || 'Cuentas reprocesadas correctamente'
    });this.loading = false;
  })
  .catch(error => {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Ocurrió un error al reprocesar las cuentas'
    });this.loading = false;
  });
}
    
      onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }

  confirmarCambioStatusMasivo() {
    if (!this.idsStatusFromFile.length) {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontraron registros en el archivo.'
      });
      return;
    }
    this.displayConfirmCambioStatusMasivo = true;
  }

  cambiarStatusMasivo() {
  this.displayConfirmCambioStatusMasivo = false;
  this.loading = true;
  const usuario = JSON.parse(sessionStorage.getItem("user") || "{}");
  if (!usuario?.email) {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: 'No se puede cambiar el status porque se requiere un usuario.',
    });
    return;
  }
  this.cors.post('AjustesNotDone/CambiarStatusMasivo', {
    registros: this.idsStatusFromFile, // [{id, status, proceso}, ...]
    usuario: usuario.email
  })
  .then(response => {
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Status cambiado',
      detail: response?.message || 'Status cambiado correctamente'
    });this.loading = false;
  })
  .catch(error => {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Ocurrió un error al cambiar el status'
    });this.loading = false;
  });
}

  // Individual
  confirmarCambioStatusIndividual() {
    this.displayConfirmCambioStatus = true;
  }

  // Individual
reprocesarIndividual() {
  this.displayConfirm = false;
  this.loading = true;
  if (!this.idIndividual || !this.procesoSeleccionado) return;

  const usuario = JSON.parse(sessionStorage.getItem("user") || "{}");
  if (!usuario?.email) {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: 'No se puede reprocesar porque se requiere un usuario.',
    });
    return;
  }

  const idNum = typeof this.idIndividual === 'string'
    ? parseInt(this.idIndividual, 10)
    : this.idIndividual;

  // Asigna el status según el proceso seleccionado
  const status = this.procesoStatusMap[this.procesoSeleccionado] || 'Pendiente';

  this.cors.post('AjustesNotDone/reprocesarIndividual', {
    id: idNum,
    usuario: usuario.email,
    proceso: this.procesoSeleccionado,
    status: status
  })
  .then(response => {
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Reprocesado',
      detail: response?.message || 'Cuenta reprocesada correctamente'
    });this.loading = false;
  })
  .catch(error => {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Ocurrió un error al reprocesar la cuenta'
    });this.loading = false;
  });
}

}
