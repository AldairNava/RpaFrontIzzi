import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { CorsService } from '@services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'bots',
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class BotsComponent implements OnInit {
  loading: boolean = false;
  dataSource: any[] = [];
  processArr: any[] = [];
  processArr1: any[] = [];
  excluir: { nombre: any }[] = [];
  @ViewChild('filter') filter!: ElementRef;
  commadArr: any[] = [
    { id: "STARTED", desc: "Iniciar Proceso" },
    { id: "STOPED", desc: "Detener Proceso" }
  ];

  // Propiedades de selección y acciones
  opcionToAction: any = { hostName: null, ipEquipo: null, id: null };
  opcionIndex: any = null;
  loadingLog: boolean = false;
  logContent: any[] = [];
  usuarioInfo = JSON.parse(localStorage.getItem("userData") || "{}");
  items: any[] = [];

  displayEditDialog: boolean = false;
  editForm: UntypedFormGroup;
  editItem: any;
  guardando: boolean = false;

  displayUserSelectionDialog: boolean = false;
  selectedUser: any;
  displayLogDialog: boolean = false;
  comando: any = null;

  constructor(
    private router: Router,
    private service: MessageService,
    private confirmationService: ConfirmationService,
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      hostName: [null, Validators.required],
      ip: [null, [Validators.required, Validators.pattern('(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]],
      procesoId: [null, Validators.required],
      comentarios: [null, Validators.required],
      usuarioBot: [null, Validators.required],
      passwordBot: [null, Validators.required]
    });

    // Configuramos las acciones del splitButton.
    this.items = [
      {
        label: 'Actualizar',
        icon: 'pi pi-refresh',
        command: () => { this.openEditDialog();
          this.obtenerProcesos();
         }
      },
      { label: ' ', icon: ' ' },
      {
        label: 'Eliminar',
        icon: 'pi pi-times',
        command: () => { this.preguntarEliminar(); }
      }
    ];

    this.obtenerProcesos();
  }

  // Método para abrir el modal de edición del bot
  openEditDialog() {
    if (this.opcionToAction && this.opcionToAction.id) {
      this.cors.get(`AjustesCambiosServicios/getBotById/${this.opcionToAction.id}`)
        .then((response: any) => {
          this.editItem = response;
          this.editForm.patchValue({
            hostName: response.botHostName,
            ip: response.botIp,
            procesoId: response.botProcesoId,
            comentarios: response.botComentarios,
            usuarioBot: response.procesoUser,
            passwordBot: response.procesoPassword
          });
          this.displayEditDialog = true;
        })
        .catch((error: any) => {
          // console.log(error);
          this.showToastError('No se encontraron datos del Robot');
        });
    } else {
      this.showToastError('No se ha seleccionado un robot para editar');
    }
  }

  // Guarda los cambios del bot editado
  guardarBotEdit() {
    this.editForm.markAllAsTouched();
    if (this.editForm.valid) {
      this.guardando = true;
      const data = {
        "id": this.editItem.botId,
        "comentarios": this.editForm.controls['comentarios'].value,
        "hostName": this.editForm.controls['hostName'].value,
        "ip": this.editForm.controls['ip'].value,
        "fechaActualizacion": null,
        "procesoBotId": this.editForm.controls['procesoId'].value,
        "procesoBot": {
          "id": this.editForm.controls['procesoId'].value,
          "name_process": null,
          "usuario": this.editForm.controls['usuarioBot'].value,
          "password": this.editForm.controls['passwordBot'].value,
          "update_At": null,
          "status": null
        }
      };
      this.cors.put(`AjustesCambiosServicios/ActualizarBot?id=${this.editItem.botId}`, data)
        .then((response: any) => {
          this.showToastSuccess('Datos guardados');
          this.displayEditDialog = false;
          this.guardando = false;
          // Actualizamos la lista de bots
          this.buscaBots();
        })
        .catch((error: any) => {
          // console.log(error);
          this.guardando = false;
          this.showToastError('No se lograron guardar los datos del Robot');
        });
    }
  }

  changeProcess(procesoId: any) {
    this.cors.get('AjustesCambiosServicios/getProcessOne', { id: procesoId })
      .then((response: any) => {
        this.editForm.patchValue({
          usuarioBot: response.procesoUser,
          passwordBot: response.procesoPassword
        });
      })
      .catch((error: any) => {
        // console.log(error);
      });
  }

  enviarCorreo(dias: number, usuario: string, proceso: string) {
    const correos = ['bnava@cyberideas.com.mx', 'egarcia@cyberideas.com.mx'];
    const subject = 'Contraseña Próxima a Vencer';
    const body = `Al usuario ${usuario} del proceso ${proceso} le faltan ${dias} días para que su contraseña venza, se recomienda actualización de la contraseña para el funcionamiento.`;

    for (let correo of correos) {
      const mail = {
        to: correo,
        subject: subject,
        body: body
      };

      this.cors.post('AjustesCambiosServicios/SendMail', mail)
        .then(response => {
          // console.log(response);
        })
        .catch(error => {
          // console.log(error);
        });
    }
  }

  preguntarEliminar() {
    this.confirmationService.confirm({
      key: 'deleteBot',
      message: `¿Está seguro que desea eliminar el Robot <strong>${this.opcionToAction.hostName}</strong> (${this.opcionToAction.ip})?`,
      accept: () => {
        this.deleteMAquina();
      }
    });
  }

  getDays(fecha: string) {
    let dif = moment().diff(moment(fecha), 'days');
    if (isNaN(dif)) {
      return '';
    } else {
      let di = 180;
      let result = di - dif;
      return result;
    }
  }

  selection(item: any) {
    // console.log(item);
    this.opcionToAction = item;
  }

  // Método agregado para el modal de selección de usuario (si se desea usar)
  onUserSelectedFromButton() {
    this.displayUserSelectionDialog = false;
  }

  ngOnInit() {
    this.buscaBots();
    setInterval(() => {
      this.obtenerBotsEstados();
    }, 5000);
  }

  deleteMAquina() {
    this.cors.delete(`AjustesCambiosServicios/EliminarBotRetecnion?id=${this.opcionToAction.id}`,
      {
        "id": this.opcionToAction.id,
        "comentarios": null,
        "hostName": null,
        "ip": null,
        "fechaActualizacion": null,
        "created_at": null,
        "procesoBotId": this.opcionToAction.procesoId,
        "procesoBot": {
          "id": this.opcionToAction.procesoId,
          "name_process": null,
          "usuario": null,
          "password": null,
          "update_At": null,
          "status": null
        }
      }
    ).then((response: any) => {
      // console.log(response);
      this.dataSource.splice(this.opcionIndex, 1);
      this.showToastSuccess(`Se eliminó el robot ${this.opcionToAction.hostName} correctamente.`);
    }).catch((error: any) => {
      // console.log(error);
      this.showToastError(`No se logró eliminar el robot ${this.opcionToAction.hostName}`);
    });
  }

  preguntarCambiarProceso(process: any, item: any) {
    this.confirmationService.confirm({
      key: 'changeProcess',
      message: '¿Está seguro que desea cambiar el proceso?',
      accept: () => {
        this.sendProcess(item, process);
        this.obtenerProcesos();
      }
    });
  }

  preguntarEnviar(command: any, item: any) {
    // console.log('Contenido de item en preguntarEnviar:', item);
    this.confirmationService.confirm({
      key: 'senCommand',
      message: '¿Está seguro que desea enviar el comando?',
      accept: () => {
        this.comando = null;
        this.sendCommand(item, command);
      },
      reject: () => {
        this.comando = null;
      }
    });
  }

  sendCommand(item: any, command: any) {
  item.sendingComand = true;
  let a = "";
  if (command == 'STARTED') {
    a = '1';
  } else if (command == 'STOPED') {
    a = '0';
  }
  this.cors.get('AjustesCambiosServicios/cambiarProcesosIzziRetencion', {
    ip: `${item.ip}`,
    proceso: `${item.procesoBotId}`,
    status: `${command}`
  })
    .then((response: any) => {
      this.cors.get('AjustesCambiosServicios/updateProcessStatusBotsRetencion', {
        ip: `${item.ip}`,
        estado: `${a}`
      }).then((response1: any) => {
        // Refresca la tabla después de actualizar el estado
        this.buscaBots();
      }).catch((error: any) => {
        // console.log(error);
      });
    })
    .catch((error: any) => {
      this.cors.get('AjustesCambiosServicios/updateProcessStatusBotsRetencion', {
        ip: `${item.ip}`,
        estado: `3`
      }).then((response1: any) => {
        this.buscaBots();
      }).catch((error: any) => {
        // console.log(error);
      });
    });
  item.sendingComand = false;
}

  sendProcess(item: any, idProceso: any) {
    item.sendingProcess = true;
    let proceso = this.processArr.find(p => p.id == idProceso);
    this.cors.put(`AjustesCambiosServicios/ActualizarBotProcessRetencion?id=${item.botId}`,
      {
        "id": item.botId,
        "comentarios": null,
        "hostName": null,
        "ip": null,
        "fechaActualizacion": null,
        "created_at": null,
        "procesoBotId": idProceso,
        "procesoBot": {
          "id": idProceso,
          "name_process": null,
          "usuario": null,
          "password": null,
          "update_At": null,
          "status": null
        }
      }
    ).then((response: any) => {
      item.sendingProcess = false;
      this.buscaBots();
      this.obtenerProcesos();
      this.showToastSuccess(`Se guardó el cambio de proceso del Robot ${item.botIp}`);
    }).catch((error: any) => {
      // console.log(error);
      item.sendingProcess = false;
      this.showToastError(`No se logró guardar el proceso del Robot ${item.botIp}`);
    });
  }

  buscaBots() {
    this.cors.get('AjustesCambiosServicios/getBotsRetencion')
      .then((response: any) => {
        if (response[0] == 'SIN INFO') {
          this.dataSource = [];
        } else {
          this.dataSource = [...response];
          for (let bot of this.dataSource) {
            let dias = this.getDays(bot.fechaActualizacion);
            if (typeof dias === 'number') {
              if (dias <= 5) {
                // this.enviarCorreo(dias, bot.ProcesoUser, bot.ProcesoName);
              }
            } else {
              // console.log('dias no es un número:', dias);
            }
          }
        }
      })
      .catch((error: any) => {
        // console.log(error);
        this.showToastError(`No se logró traer el listado de Robots`);
      });
  }

  statsValidation(item: any) {
    if (JSON.stringify(item) !== '{}') {
      return item;
    } else {
      return 0;
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  showToastSuccess(mensaje: any) {
    this.service.add({ key: 'tst', severity: 'success', summary: 'Correcto!!', detail: mensaje });
  }

  showToastError(mensaje: any) {
    this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: mensaje });
  }

  getProcessText(process: any) {
    let proccesFind = this.processArr.find(item => item.id == process);
    return proccesFind?.name_process || "Sin proceso asignado";
  }
  
  validacionProceso() {
    this.processArr1 = [];
    this.processArr1 = this.processArr;
    this.cors.get('AjustesCambiosServicios/getValidationProcesosRetencion')
      .then((response: any) => {
        this.excluir = [];
        for (let i = 0; i < response.length; i++) {
          if (response[i].num >= 3) {
            let b = { nombre: response[i].procesoName };
            this.excluir.push(b);
          }
        }
        for (let i = 0; i < this.processArr1.length; i++) {
          for (let j = 0; j < this.excluir.length; j++) {
            if (this.processArr1[i].name_process == this.excluir[j].nombre) {
              this.processArr1.splice(i, 1);
            }
          }
        }
      })
      .catch((error: any) => {
        // console.log(error);
      });
  }

  obtenerProcesos() {
    this.cors.get('AjustesCambiosServicios/getCatProcesosRetencion')
      .then((response: any) => {
        if (response[0] == 'SIN INFO') {
          this.processArr = [];
        } else {
          this.processArr = [];
          for (var b = 0; b < response.length; b++) {
            if (response[b].status == "1") {
              let bb = {
                id: response[b].id,
                name_process: response[b].name_process,
                name_usuario: response[b].name_usuario
              };
              this.processArr.push(bb);
            }
          }
          this.validacionProceso();
        }
      })
      .catch((error: any) => {
        // console.log(error);
        this.showToastError(`No se logró traer la lista de procesos`);
      });
  }

  obtenerBotsEstados() {
    this.cors.get('AjustesCambiosServicios/getBotsEstadoRetencion')
      .then((response: any) => {
        if (response[0] == 'SIN INFO') {
          // No se hace nada
        } else if (response.length > 0) {
          for (let i = 0; i < this.dataSource.length; i++) {
            for (let j = 0; j < response.length; j++) {
              if (response[j].botIp == this.dataSource[i].botIp) {
                this.dataSource[i].botEstado = response[j].botEstado;
              }
            }
          }
        }
      })
      .catch((error: any) => {
        // console.log(error);
      });
  }
}
