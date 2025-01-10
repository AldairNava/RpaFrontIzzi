import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/_shared/layout/layout/layout.component';
import { BaseDatosAjustesComponent } from './base-datos-ajustes/base-datos-ajustes.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { ReporteComponent } from './reporte/reporte.component';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { MigracionesLinealesComponent } from './migraciones-lineales/migraciones-lineales.component';
import { ConsultaMigracionesComponent } from './consulta-migraciones/consulta-migraciones.component';

const routes: Routes = [
  {
    path: 'BDajustes', 
    data: { breadcrumb: 'Base de Datos Ajustes' },
    component: LayoutComponent,
    children: [{ path: '', component: BaseDatosAjustesComponent }],
  },
  // {
  //   path: 'estadisticas', 
  //   data: { breadcrumb: 'Estadisticas' },
  //   component: LayoutComponent,
  //   children: [{ path: '', component: EstadisticasComponent }],
  // },
  // {
  //   path: 'reporte', 
  //   data: { breadcrumb: 'Reportes' },
  //   component: LayoutComponent,
  //   children: [{ path: '', component: ReporteComponent }],
  // },
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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjustesYcambioServiciosRoutingModule { }
