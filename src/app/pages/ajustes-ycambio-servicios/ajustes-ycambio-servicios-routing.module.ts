import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/_shared/layout/layout/layout.component';
import { BaseDatosAjustesComponent } from './base-datos-ajustes/base-datos-ajustes.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { MigracionesLinealesComponent } from './migraciones-lineales/migraciones-lineales.component';
import { ConsultaMigracionesComponent } from './consulta-migraciones/consulta-migraciones.component';
import { RetencionComponent } from './retencion/retencion.component';
import { ConsultarRetencionComponent } from './consultar-retencion/consultar-retencion.component';
import { ReportesComponent } from './reportes/reportes.component';
import { BotsComponent } from './bots/bots.component';

const routes: Routes = [
  {
    path: 'BDajustes', 
    data: { breadcrumb: 'Base de Datos Ajustes' },
    component: LayoutComponent,
    children: [{ path: '', component: BaseDatosAjustesComponent }],
  },
  {
    path: 'consultaretencion', 
    data: { breadcrumb: 'Consulta Retencion' },
    component: LayoutComponent,
    children: [{ path: '', component: ConsultarRetencionComponent }],
  },
  {
    path: 'Retencion', 
    data: { breadcrumb: 'Retencion 0' },
    component: LayoutComponent,
    children: [{ path: '', component: RetencionComponent }],
  },
  {
    path: 'consulta', 
    data: { breadcrumb: 'Pantalla Consulta' },
    component: LayoutComponent,
    children: [{ path: '', component: PantallaConsultaComponent }],
  },
  {
    path: 'migracionesLineales', 
    data: { breadcrumb: 'Bases de Datos de Migraciones Lineales' },
    component: LayoutComponent,
    children: [{ path: '', component: MigracionesLinealesComponent }],
  },
  {
    path: 'consultaMigracionesLineales', 
    data: { breadcrumb: 'Pantalla Consulta de Migraciones Lineales' },
    component: LayoutComponent,
    children: [{ path: '', component: ConsultaMigracionesComponent }],
  },
  {
    path: 'Reportes', 
    data: { breadcrumb: 'Reportes' },
    component: LayoutComponent,
    children: [{ path: '', component: ReportesComponent }],
  },
  {
    path: 'actividad-rpa', 
    data: { breadcrumb: 'Actividad-RPA' },
    component: LayoutComponent,
    children: [{ path: '', component: BotsComponent }],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjustesYcambioServiciosRoutingModule { }
