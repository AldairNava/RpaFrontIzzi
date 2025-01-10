import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AjustesYcambioServiciosRoutingModule } from './ajustes-ycambio-servicios-routing.module';
import { BaseDatosAjustesComponent } from './base-datos-ajustes/base-datos-ajustes.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { ReporteComponent } from './reporte/reporte.component';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { MigracionesLinealesComponent } from './migraciones-lineales/migraciones-lineales.component';
import { ConsultaMigracionesComponent } from './consulta-migraciones/consulta-migraciones.component';


@NgModule({
  declarations: [
    BaseDatosAjustesComponent,
    EstadisticasComponent,
    ReporteComponent,
    PantallaConsultaComponent,
    MigracionesLinealesComponent,
    ConsultaMigracionesComponent
  ],
  imports: [
    CommonModule,
    AjustesYcambioServiciosRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AjustesYcambioServiciosModule { }
