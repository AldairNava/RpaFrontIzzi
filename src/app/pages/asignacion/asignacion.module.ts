import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AsignacionRoutingModule } from './asignacion-routing.module';
import { DashboardAsignacionComponent } from './dashboard-asignacion/dashboard-asignacion.component';
import { SharedModule } from 'app/_shared/modules/shared/shared.module';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { ParametrosconfigComponent } from './parametrosconfig/parametrosconfig.component';
import { SubirbaseSinValidacionComponent } from './subirbase-sin-validacion/subirbase-sin-validacion.component';
import { ConsultaSinValidacionComponent } from './consulta-sin-validacion/consulta-sin-validacion.component';
import { ReprocesarComponent } from './reprocesar/reprocesar.component';
import { ReprocesarsinvalidacionComponent } from './reprocesarsinvalidacion/reprocesarsinvalidacion.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';


@NgModule({
  declarations: [
    DashboardAsignacionComponent,
    PantallaConsultaComponent,
    ParametrosconfigComponent,
    SubirbaseSinValidacionComponent,
    ConsultaSinValidacionComponent,
    ReprocesarComponent,
    ReprocesarsinvalidacionComponent
  ],
  imports: [
    CommonModule,
    AsignacionRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    SelectButtonModule
  ],
  providers: [ConfirmationService], 
})
export class AsignacionModule { }
