import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Message,MessageService,ConfirmationService,ConfirmEventType } from 'primeng/api';
import { CorsService } from '@services';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'reprocesarsinvalidacion',
  templateUrl: './reprocesarsinvalidacion.component.html',
  styleUrls: ['./reprocesarsinvalidacion.component.scss']
})
export class ReprocesarsinvalidacionComponent implements OnInit {

  showtable:any=[];
  formReproceso:UntypedFormGroup;
  msgs: Message[] = [];
  fileToUpload: File | null = null;
  idsFromFile: string[] = [];
  displayConfirmMasivo: boolean = false;
  isAdmin: boolean = false;
  // Opciones para el selectButton de tipo de cambio de status
  tipoCambioStatusOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Masivo', value: 'masivo' }
  ];
  tipoCambioStatus: string = 'individual';

  // Opciones de estatus (ajusta según tus valores reales)
  estatusOptions = [
    { label: 'Error Obtencion Status Ajuste', value: 'Error Obtencion Status Ajuste' },
    { label: 'Error al crear cn', value: 'Error al crear cn' },
    { label: 'No aplica ajuste reciente', value: 'No aplica ajuste reciente' }
  ];
  estatusSeleccionado: string = '';
  idCambioStatus: string = '';

  displayConfirmCambioStatus: boolean = false;
  displayConfirmCambioStatusMasivo: boolean = false;

  // Para masivo
  fileToUploadStatus: File | null = null;
  idsStatusFromFile: { id: string, status: string }[] = [];


  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private cors: CorsService,
    private confirmationService: ConfirmationService
  ) {
    this.formReproceso = this.formBuilder.group({
      fecha: [null, Validators.required]
    });
  }
  displayConfirm: boolean = false;
  tipoReprocesoOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Masivo', value: 'masivo' }
    ];
  tipoReproceso: string = 'individual';
  idIndividual: string = '';

  activeTabIndex: number = 0;
  onTabChange(event: any) {
    this.activeTabIndex = event.index;
  }
  confirmarReprocesoIndividual() {
  this.displayConfirm = true;
}

reprocesarIndividual() {
  this.displayConfirm = false;
  if (!this.idIndividual) return;

  // Obtener usuario del localStorage
  const usuario = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!usuario?.email) {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: 'No se puede reprocesar porque se requiere un usuario.',
    });
    return;
  }

  // Aseguramos que id sea un number, no string
  const idNum = typeof this.idIndividual === 'string'
    ? parseInt(this.idIndividual, 10)
    : this.idIndividual;

  this.cors.post('AjustesNotDone/reprocesarIndividual', {
      id: idNum,
      usuario: usuario.email
    })
    .then(response => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Reprocesado',
        detail: response?.message || 'Cuenta reprocesada correctamente'
      });
    })
    .catch(error => {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Error',
        detail: error?.message || 'Ocurrió un error al reprocesar la cuenta'
      });
    });
}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    this.isAdmin = user?.role === 'administrador';
  }

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

        // Busca la columna "id"
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

        // Extrae los IDs
        for (let i = 1; i < json.length; i++) {
          const row = json[i];
          if (row[idIndex] != null && row[idIndex] !== '') {
            this.idsFromFile.push(row[idIndex]);
          }
        }

        // Mensaje de éxito
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Éxito',
          detail: `Se leyeron ${this.idsFromFile.length} ID(s) correctamente.`
        });console.log(this.fileToUpload);
      } catch (err: any) {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error al procesar',
          detail: err.message || 'Ocurrió un error inesperado al leer el archivo.'
        });
      }
    };

    reader.onerror = () => {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Error de lectura',
        detail: 'No se pudo leer el archivo.'
      });
    };

    reader.readAsBinaryString(file);
  }
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

    reprocesarMasivo() {
      this.displayConfirmMasivo = false;
      // Obtener usuario del localStorage
      const usuario = JSON.parse(localStorage.getItem("userData") || "{}");
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
        ids: this.idsFromFile,
        usuario: usuario.email
      })
      .then(response => {
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Reprocesado',
          detail: response?.message || 'Cuentas reprocesadas correctamente'
        });
      })
      .catch(error => {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: error?.message || 'Ocurrió un error al reprocesar las cuentas'
        });
      });
    }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  dateFormat(value:any){
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
    }else{
      return ""
    }
  }

  getAjustesCasoSinValidacion(fecha1:any,fecha2:any){
    this.cors.get(`AjustesNotDone/getCasosSinValidacionError`,{
      fecha1:fecha1,
      fecha2:fecha2,
    }).then((response) => {
      // console.log(response)
      if(response.length == 0){
        this.showtable = [];
        this.messageService.add({
          key: 'tst',
          severity: 'info',
          summary: 'No hay datos para mostrar',
          detail: '',
        });

      }else{
        this.showtable = response;

      }
    }).catch((error) => {
      console.log(error)
    })

  }

  buscar(){
    if(this.formReproceso.controls['fecha'].value == null || this.formReproceso.controls['fecha']?.value[1] == null){
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Se necesita un rango de fechas',
        detail: 'Intentarlo Nuevamente!!',
      });

    }else{
      let fecha1= moment(this.formReproceso.controls['fecha'].value[0]).format('yyyy-MM-DD');
      let fecha2= moment(this.formReproceso.controls['fecha'].value[1]).format('yyyy-MM-DD');
      this.getAjustesCasoSinValidacion(fecha1,fecha2);
    }



  }

  // Individual
  confirmarCambioStatusIndividual() {
    this.displayConfirmCambioStatus = true;
  }

  cambiarStatusIndividual() {
  this.displayConfirmCambioStatus = false;
  const usuario = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!usuario?.email) {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: 'No se puede cambiar el status porque se requiere un usuario.',
    });
    return;
  }

  // Aseguramos que el id sea un number
  const idNum = typeof this.idCambioStatus === 'string'
    ? parseInt(this.idCambioStatus, 10)
    : this.idCambioStatus;

  this.cors.post('AjustesNotDone/cambiarStatusIndividual', {
    id: idNum,
    status: this.estatusSeleccionado,
    usuario: usuario.email
  })
  .then(response => {
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Status cambiado',
      detail: response?.message || 'Status cambiado correctamente'
    });
  })
  .catch(error => {
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Error',
      detail: error?.message || 'Ocurrió un error al cambiar el status'
    });
  });
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
            if (row[idIndex] && row[statusIndex]) {
              this.idsStatusFromFile.push({ id: row[idIndex], status: row[statusIndex] });
            }
          }
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Éxito',
            detail: `Se leyeron ${this.idsStatusFromFile.length} registros correctamente.`
          });
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
    const usuario = JSON.parse(localStorage.getItem("userData") || "{}");
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
      registros: this.idsStatusFromFile,
      usuario: usuario.email
    })
    .then(response => {
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Status cambiado',
        detail: response?.message || 'Status cambiado correctamente'
      });
    })
    .catch(error => {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Error',
        detail: error?.message || 'Ocurrió un error al cambiar el status'
      });
    });
  }

  reprocesar(item:any){
    this.cors.get(`AjustesNotDone/ActualizarStatusCasosSinValidacion`,{
      status:item,
      fecha1:moment(this.formReproceso.controls['fecha'].value[0]).format('yyyy-MM-DD'),
      fecha2:moment(this.formReproceso.controls['fecha'].value[1]).format('yyyy-MM-DD')
    }).then((response) => {
      this.showtable = [];
      this.messageService.add({
        key: 'tst',
        severity: 'info',
        summary: `${response[0].message}`,
        detail: '',
      });

    }).catch((error) => {
      console.log(error)
    })
    let fecha1= moment(this.formReproceso.controls['fecha'].value[0]).format('yyyy-MM-DD');
    let fecha2= moment(this.formReproceso.controls['fecha'].value[1]).format('yyyy-MM-DD');
    this.getAjustesCasoSinValidacion(fecha1,fecha2);
  }

  confirm1(item:any) {
    this.confirmationService.confirm({
        message: `Deseas reprocesar todas las cuentas <br> con el siguiente Estatus: <strong>${item}</strong>?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',     
        accept: () => {
            this.reprocesar(item);
        },
        reject: (type: any) => {
            switch (type as ConfirmEventType) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Ha sido Rechazado' });
                    break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Ha sido Cancelado' });
                    break;        
            }
        }

    });
  }
}