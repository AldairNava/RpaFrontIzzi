import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/_shared/layout/layout/layout.component';
import { RobotsComponent } from './robots-dasboard/robots.component';
import { RobotsEditarComponent } from './robots-editar/robots-editar.component';
import { RobotsNuevoComponent } from './robots-nuevo/robots-nuevo.component';
import { ProcesosDashboardComponent } from './procesos-dashboard/procesos-dashboard.component';
import { ProcesosNuevoComponent } from './procesos-nuevo/procesos-nuevo.component';
import { ProcesosEditComponent } from './procesos-edit/procesos-edit.component';




const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Dashboard Robots' },
    component: LayoutComponent,
    children: [
      { path: '', component: RobotsComponent,data: { breadcrumb: 'Actividad' }}, 
      { path: 'nuevo', component: RobotsNuevoComponent,data: { breadcrumb: 'Nuevo'  }}, 
      { path: 'editar/:idRobot', component: RobotsEditarComponent,data: { breadcrumb: 'Editar' } }],
  },
  {
    path: 'proceso',
    data: { breadcrumb: 'Dashboard Procesos' },
    component: LayoutComponent,
    children: [
      { path: '', component: ProcesosDashboardComponent,data: { breadcrumb: 'Actividad' }}, 
      { path: 'nuevo', component: ProcesosNuevoComponent,data: { breadcrumb: 'Nuevo'  }}, 
      { path: 'editar/:idRobot', component: ProcesosEditComponent,data: { breadcrumb: 'Editar' } }],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RobotsRoutingModule { }
