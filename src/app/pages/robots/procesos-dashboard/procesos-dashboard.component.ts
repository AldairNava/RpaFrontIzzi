import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { CorsService } from '@services';
import { SocketIoService } from 'app/_services/socketio.service';
import { Socket } from 'ngx-socket-io';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'procesos-dashboard',
  templateUrl: './procesos-dashboard.component.html',
  styleUrls: ['./procesos-dashboard.component.scss']
})
export class ProcesosDashboardComponent implements OnInit {
  dataSource: any[] = []
  loading: boolean = false
  items: any[] = [];
  opcionToAction: any = { };
  opcionIndex: any = null;
  displayLogDialog: boolean = false
  loadingLog: boolean = false
  logContent: any[] = []

  constructor(
    private router: Router,
    private service: MessageService,
    private message: MessageService,
    private confirmationService: ConfirmationService,
    private socket: Socket,
    private cors: CorsService,
  ) {
    this.items = [{
      label: 'Actualizar', icon: 'pi pi-refresh', command: () => {

        this.router.navigate([`/robots/proceso/editar/${this.opcionToAction.id}`])

      }
    },

    // {
    //   label: 'ver Log', icon: 'pi pi-history', command: () => {


    //     this.preguntarLog()
    //   }
    // }, 
    {
      label: ' ', icon: ' '
    },
    {
      label: 'Eliminar', icon: 'pi pi-times', command: () => {


        this.preguntarEliminar()
      }
    },]
   }

  ngOnInit(): void {
    this.getAllProcess();
  }
  showToastSuccess(mensaje: any) {
    this.message.add({ key: 'tst', severity: 'success', summary: 'Correcto!!', detail: mensaje, });
  }
  showToastError(mensaje: any) {
    this.message.add({ key: 'tst', severity: 'error', summary: 'Correcto!!', detail: mensaje, });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  selection(item: any, index: any) {
    this.opcionToAction = item;
    // console.log(this.opcionToAction)
    this.opcionIndex = index;
  }

  deleteMAquina() {
    console.log(this.opcionToAction)

    this.cors.delete(`Bots/EliminarProceso?id=${this.opcionToAction.id}`, this.opcionToAction).then((response) => {
      console.log(response);
      this.dataSource.splice(this.opcionIndex, 1)
      this.showToastSuccess(`Se elimino el proceso ${this.opcionToAction.name_process} correctamente.`)
    }).catch((error) => {
      console.log(error);
      this.showToastError(`No se logro eliminar el proceso ${this.opcionToAction.name_process}`)

    })
  }

  preguntarEliminar() {
    this.confirmationService.confirm({
      key: 'deleteBot',
      message: `Esta seguro que desea eliminar el Proceso <strong>${this.opcionToAction.name_process}</strong> ?`,
      accept: () => {
        this.deleteMAquina()


      }
    })
  }


  getAllProcess(){
    this.cors.get('Bots/getAllProcess').then((response) => {
      if(response[0] == 'SIN INFO'){
        this.showToastError(`No hay registros de procesos!`)

      }else{
        // for(var b=0;b<response.length;b++){
        //   if(response[b].status == "1"){
        //     this.dataSource.push(response[b])
        //   }
        // }
        this.dataSource = response;
      }
    }).catch((error) => {
      console.log(error);
      this.showToastError(`No se logro traer la lista de procesos!`)
    })
  }

}
