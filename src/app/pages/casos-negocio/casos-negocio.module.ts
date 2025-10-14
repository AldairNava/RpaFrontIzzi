import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CasosNegocioRoutingModule } from './casos-negocio-routing.module';
import { DashboardCasosNegocioComponent } from './dashboard-casos-negocio/dashboard-casos-negocio.component';
import { SharedModule } from 'app/_shared/modules/shared/shared.module';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { ParametrosconfigComponent } from './parametrosconfig/parametrosconfig.component';
import { CancelacionSinValidacionComponent } from './cancelacion-sin-validacion/cancelacion-sin-validacion.component';
import { CasosNegocioSinValidacionComponent } from './casos-negocio-sin-validacion/casos-negocio-sin-validacion.component';
import { ConsultacancelacionSinValidacionComponent } from './consultacancelacion-sin-validacion/consultacancelacion-sin-validacion.component';
import { ConsultacasosNegocioSinValidacionComponent } from './consultacasos-negocio-sin-validacion/consultacasos-negocio-sin-validacion.component';
import { ReprocesarComponent } from './reprocesar/reprocesar.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SafeUrlPipe } from './safeUrl.pipe';
import { ReprocesarsinvalidacionComponent } from './reprocesarsinvalidacion/reprocesarsinvalidacion.component';
import { ReprocesarCasosnegociosinvalidacionComponent } from './reprocesar-casosnegociosinvalidacion/reprocesar-casosnegociosinvalidacion.component';
import { BaseNotdoneComponent } from './base-notdone/base-notdone.component';
import { ImportarNotDoneComponent } from './importar-not-done/importar-not-done.component';
import { FlagConfirmacionComponent } from './flag-confirmacion/flag-confirmacion.component';
import { ConsultarFlagConfirmacionComponent } from './consultar-flag-confirmacion/consultar-flag-confirmacion.component';


@NgModule({
  declarations: [
    DashboardCasosNegocioComponent,
    PantallaConsultaComponent,
    ParametrosconfigComponent,
    CancelacionSinValidacionComponent,
    CasosNegocioSinValidacionComponent,
    ConsultacancelacionSinValidacionComponent,
    ConsultacasosNegocioSinValidacionComponent,
    ReprocesarComponent,
    ReprocesarsinvalidacionComponent,
    ReprocesarCasosnegociosinvalidacionComponent,
    BaseNotdoneComponent,
    SafeUrlPipe,
    ImportarNotDoneComponent,
    FlagConfirmacionComponent,
    ConsultarFlagConfirmacionComponent,
  ],
  imports: [
    CommonModule,
    CasosNegocioRoutingModule,
    SharedModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
  ],
  providers: [ConfirmationService], 
})
export class CasosNegocioModule { }
