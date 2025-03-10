import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AjustesYcambioServiciosRoutingModule } from './ajustes-ycambio-servicios-routing.module';
import { BaseDatosAjustesComponent } from './base-datos-ajustes/base-datos-ajustes.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { MigracionesLinealesComponent } from './migraciones-lineales/migraciones-lineales.component';
import { ConsultaMigracionesComponent } from './consulta-migraciones/consulta-migraciones.component';
import { RetencionComponent } from './retencion/retencion.component';
import { ConsultarRetencionComponent } from './consultar-retencion/consultar-retencion.component';
import { ReportesComponent } from './reportes/reportes.component';
import { SafeUrlPipe } from './safeUrl.pipe';
import { ListboxModule } from 'primeng/listbox';
import { BotsComponent } from './bots/bots.component';


@NgModule({
  declarations: [
    BaseDatosAjustesComponent,
    EstadisticasComponent,
    PantallaConsultaComponent,
    MigracionesLinealesComponent,
    ConsultaMigracionesComponent,
    RetencionComponent,
    ConsultarRetencionComponent,
    ReportesComponent,
    SafeUrlPipe,
    BotsComponent
  ],
  imports: [
    CommonModule,
    AjustesYcambioServiciosRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ListboxModule
  ]
})
export class AjustesYcambioServiciosModule { }
