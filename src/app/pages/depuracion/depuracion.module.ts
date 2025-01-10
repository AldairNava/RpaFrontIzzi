import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DepuracionRoutingModule } from './depuracion-routing.module';
import { DashboardDepuracionComponent } from './dashboard-depuracion/dashboard-depuracion.component';
import { SharedModule } from 'app/_shared/modules/shared/shared.module';
import { BasesDepuradasComponent } from './bases-depuradas/bases-depuradas.component';
import { SafeUrlPipe } from './safeUrl.pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BasesCanceladasComponent } from './bases-canceladas/bases-canceladas.component';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { ReportesComponent } from './reportes/reportes.component';
import { PrefijosComponent } from './prefijos/prefijos.component';
import { HobsComponent } from './hobs/hobs.component';
import { FallasDepuracionComponent } from './fallas-depuracion/fallas-depuracion.component';
import { ArchivosCCComponent } from './archivos-cc/archivos-cc.component';


@NgModule({
  declarations: [
    DashboardDepuracionComponent,
    BasesDepuradasComponent,
    SafeUrlPipe,
    BasesCanceladasComponent,
    PantallaConsultaComponent,
    ReportesComponent,
    PrefijosComponent,
    HobsComponent,
    FallasDepuracionComponent,
    ArchivosCCComponent
  ],
  imports: [
    CommonModule,
    DepuracionRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ConfirmationService,MessageService,
  ]
})
export class DepuracionModule { }
