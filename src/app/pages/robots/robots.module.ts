import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RobotsRoutingModule } from './robots-routing.module';
import { RobotsComponent } from './robots-dasboard/robots.component';
import { SocketIoService } from 'app/_services/socketio.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'environments/environment';
import { RobotsNuevoComponent } from './robots-nuevo/robots-nuevo.component';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RobotLogModalComponent } from './componentes/robot-log-modal/robot-log-modal.component';
import { RobotsEditarComponent } from './robots-editar/robots-editar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProcesosDashboardComponent } from './procesos-dashboard/procesos-dashboard.component';
import { ProcesosNuevoComponent } from './procesos-nuevo/procesos-nuevo.component';
import { ProcesosEditComponent } from './procesos-edit/procesos-edit.component';
const config: SocketIoConfig = { url: environment.SCOCKET_URL };


@NgModule({
  declarations: [
    RobotsComponent,
    RobotsNuevoComponent,
    RobotLogModalComponent,
    RobotsEditarComponent,
    ProcesosDashboardComponent,
    ProcesosNuevoComponent,
    ProcesosEditComponent
  ],
  imports: [
    SharedModule,

    CommonModule,
    RobotsRoutingModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule,
  ], providers: [
    SocketIoService,ConfirmationService,MessageService
  ]
})
export class RobotsModule { }
