import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { CorsService } from '@services';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'bots',
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class BotsComponent implements OnInit {

  loading: boolean = false
  dataSource: any[] = []
  processArr: any[] = []
  processArr1: any[] = []
  @ViewChild('filter') filter!: ElementRef
  commadArr: any[] = [
    {
      id: "STARTED",
      desc: "Iniciar Proceso"
    },
    {
      id: "STOPED",
      desc: "Detener Proceso"
    }
  ]

  comando: any = null;
  opcionToAction: any = {
    hostName: null,
    ipEquipo: null
  };
  opcionIndex: any = null;
  loadingLog: boolean = false
  logContent: any[] = []
  usuarioInfo = JSON.parse(localStorage.getItem("userData") || "{}")
  items: any[] = [];
  displayLogDialog: boolean = false
  statsBots:any=[];
  loading1: boolean = false
  excluir:any=[];
  displayUserSelectionDialog: boolean = false;// Aquí deberías cargar la lista de usuarios
selectedUser: any; // Aquí se almacenará el usuario seleccionado

  constructor(
    private router: Router,
    private service: MessageService,
    private confirmationService: ConfirmationService,
    private cors: CorsService,
  ) {

    this.obtenerProcesos();
    this.items = [{
      label: 'Actualizar', 
      icon: 'pi pi-refresh', 
      command: () => {
        this.openUserSelectionDialog();
      }
    },
    {
      label: ' ', icon: ' '
    },
    {
      label: 'Eliminar', icon: 'pi pi-times', command: () => {
        this.preguntarEliminar()
      }
    }]
  }

  openUserSelectionDialog() {
    this.buscaBots();
    this.displayUserSelectionDialog = true;
  }

  onUserSelectedFromButton() {
    if (this.selectedUser) {
        this.displayUserSelectionDialog = false;
        this.router.navigate([`/limpieza/usuariosbots/editar/${this.selectedUser.id}`]); // Usa el id del selectedUser
    } else {
        this.showToastError('No se ha seleccionado ningún usuario');
    }
}




  enviarCorreo(dias: number, usuario: string, proceso: string) {
    const correos = ['bnava@cyberideas.com.mx', 'egarcia@cyberideas.com.mx'];
    const subject = 'Contraseña Proxima a Vencer';
    const body = `Al usuario ${usuario} del proceso ${proceso} le faltan ${dias} dias para que su contraseña venza, se recomienda actualización de la contraseña para el funcionamiento.`;

    for (let correo of correos) {
        const mail = {
            to: correo,
            subject: subject,
            body: body
        };

        this.cors.post('Bots/SendMail', mail).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }
}

  preguntarEliminar() {
    this.confirmationService.confirm({
      key: 'deleteBot',
      message: `Esta seguro que desea eliminar el Robot <strong>${this.opcionToAction.botHostName}</strong>(${this.opcionToAction.botIp}) ?`,
      accept: () => {
        this.deleteMAquina()
      }
    })
  }  
  getDays(fecha:string){
    let dif = moment().diff(moment(fecha),'days')
    if (isNaN(dif)) {
      return ''
    }else{
      let di =180;
      let result = di-dif
      return result
    }
  }
  selection(item: any) {
    this.opcionToAction = item;
  }

  ngOnInit() {
    this.buscaBots();
    setInterval(() => {
      this.obtenerBotsEstados();
    },5000);
  }

  deleteMAquina() {
    this.cors.delete(`Bots/EliminarBotLimpieza?id=${this.opcionToAction.botId}`, 
      {
        "id": this.opcionToAction.botId,
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
    ).then((response) => {
      console.log(response);
      this.dataSource.splice(this.opcionIndex, 1)
      this.showToastSuccess(`Se elimino el robot ${this.opcionToAction.botHostName} correctamente.`)
    }).catch((error) => {
      console.log(error);
      this.showToastError(`No se logro eliminar el robot ${this.opcionToAction.botHostName}`)
    })
  }

  preguntarCambiarProceso(process: any, item: any) {
    this.confirmationService.confirm({
      key: 'changeProcess',
      message: 'Esta seguro que desea cambiar el proceso?',
      accept: () => {
        this.sendProcess(item, process)
        this.obtenerProcesos();
      }
    })
  }

  preguntarEnviar(command: any, item: any) {
    this.confirmationService.confirm({
      key: 'senCommand',
      message: 'Esta seguro que desea enviar el comando?',
      accept: () => {
        this.comando = null
        this.sendCommand(item, command)
      },
      reject: () => {
        this.comando = null
      }
    })
  }

  sendCommand(item: any, command: any) {
    item.sendingComand = true
    let a ="";
    if(command == 'STARTED'){
      a = '1';
    }else if(command == 'STOPED'){
      a= '0'
    }
    this.cors.get('Reporte/cambiarProcesosIzziLimpieza',{
        ip:`${item.botIp}`,
        proceso:`${item.procesoId}`,
        status:`${command}`
      })
      .then((response) => {
          console.log(response)
          this.cors.get('Bots/updateProcessStatusBotLimpieza',{
            ip:`${item.botIp}`,
            estado:`${a}`
          }).then((response1) => {
            console.log(response1)
          }).catch((error) => {
            console.log(error);
          });    
      })
      .catch((error) => {
        console.log(error);
        this.cors.get('Bots/updateProcessStatusBotLimpieza',{
          ip:`${item.botIp}`,
          estado:`3`
        }).then((response1) => {
          console.log(response1)
        }).catch((error) => {
          console.log(error);
        });
      })
    item.sendingComand = false
  }

  sendProcess(item: any, idProceso: any) {
    item.sendingProcess = true
    let proceso = this.processArr.find(item => item.id == idProceso)
    this.cors.put(`Bots/ActualizarBotProcessLimpieza?id=${item.botId}` , 
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
    ).then((response) => {
      item.sendingProcess = false
      this.buscaBots()
      this.obtenerProcesos()
      this.showToastSuccess(`Se guardo el cambio de proceso del Robot ${item.botIp}`)
    }).catch((error) => {
      console.log(error);
      item.sendingProcess = false
      this.showToastError(`No se logro guardar el proceso del Robot ${item.botIp}`)
    })
  }

  buscaBots() {
    this.cors.get('Bots/getBotsLimpieza').then((response) => {
      if(response[0] == 'SIN INFO'){
        this.dataSource = []
      }else{
        this.dataSource = response;
        for (let bot of this.dataSource) {
          let dias = this.getDays(bot.fechaActualizacion);
          if (typeof dias === 'number') {
            if (dias <= 5) {
              // this.enviarCorreo(dias, bot.ProcesoUser, bot.ProcesoName);
            }
          } else {
            console.log('dias no es un número:', dias);
          }
        }
      }
    }).catch((error) => {
      console.log(error);
      this.showToastError(`No se logro traer el listado de Robots`)
    })
}

  statsValidation(item:any){
    if(JSON.stringify(item) !== '{}'){
      return item
    }else{
      return 0
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
    this.service.add({ key: 'tst', severity: 'success', summary: 'Correcto!!', detail: mensaje, });
  }
  showToastError(mensaje: any) {
    this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: mensaje, });
  }
  
  getProcessText(process: any) {
    let proccesFind = this.processArr.find(item => item.id == process)
    return proccesFind?.name_process || "Sin proceso asignado"
  }

  validacionProceso(){
    this.processArr1=[];
    this.processArr1 = this.processArr;
    this.cors.get('Bots/getValidationProcesosLimpieza').then((response) => {
      this.excluir= [];
      for(let i =0 ; i< response.length ;i++){
        if(response[i].num >= 3){
          let b ={
            nombre:response[i].procesoName
          }
          this.excluir.push(b);
        }
      }
      for(let i=0;i<this.processArr1.length ; i++){
        for(let j=0;j<this.excluir.length ; j++){
          if(this.processArr1[i].name_process == this.excluir[j].nombre){
            this.processArr1.splice(i,1);
          }
        }
      }  
    }).catch((error) => {
      console.log(error);
    })
  }

  obtenerProcesos() {
    this.cors.get('Bots/getCatProcesosLimpieza').then((response) => {
        if(response[0] == 'SIN INFO') {
            this.processArr = [];
        } else {
            this.processArr = [];
            for(var b = 0; b < response.length; b++) {
                if(response[b].status == "1") {
                    let bb = {
                        id: response[b].id,
                        name_process: response[b].name_process,
                        name_usuario: response[b].name_usuario  // Incluyendo name_usuario
                    }
                    this.processArr.push(bb);
                }
            }
            this.validacionProceso();
        }
    }).catch((error) => {
        console.log(error);
        this.showToastError(`No se logró traer la lista de procesos`);
    });
}

  obtenerBotsEstados(){
    this.cors.get('Bots/getBotsEstadoLimpieza').then((response) => {
      if(response[0] == 'SIN INFO'){
      }else if(response.length>0){
        for(let i =0;i< this.dataSource.length;i++){
          for(let j =0; j<response.length;j++){
            if(response[j].botIp == this.dataSource[i].botIp){
              this.dataSource[i].botEstado = response[j].botEstado;
            }}}}
    }).catch((error) => {
      console.log(error);
    })
}
}
