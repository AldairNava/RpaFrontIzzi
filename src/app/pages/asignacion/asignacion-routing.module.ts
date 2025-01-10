import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './../../_shared/layout/layout/layout.component';
import { DashboardAsignacionComponent } from './dashboard-asignacion/dashboard-asignacion.component';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { ParametrosconfigComponent } from './parametrosconfig/parametrosconfig.component';
import { SubirbaseSinValidacionComponent } from './subirbase-sin-validacion/subirbase-sin-validacion.component';
import { ConsultaSinValidacionComponent } from './consulta-sin-validacion/consulta-sin-validacion.component';
import { ReprocesarComponent } from './reprocesar/reprocesar.component';
import { ReprocesarsinvalidacionComponent } from './reprocesarsinvalidacion/reprocesarsinvalidacion.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [{ path: '', component: DashboardAsignacionComponent }],
	},
	{
		path: 'consulta',
		component: LayoutComponent,
		children: [{ path: '', component: PantallaConsultaComponent }],
	},
	{
		path: 'parametros',
		component: LayoutComponent,
		children: [{ path: '', component: ParametrosconfigComponent }],
	},
	{
		path: 'baseSinValidacion',
		component: LayoutComponent,
		children: [{ path: '', component: SubirbaseSinValidacionComponent }],
	},
	{
		path: 'consultaSinValidacion',
		component: LayoutComponent,
		children: [{ path: '', component: ConsultaSinValidacionComponent }],
	},
	{
		path: 'reprocesar',
		component: LayoutComponent,
		children: [{ path: '', component: ReprocesarComponent }],
	},
	{
		path: 'Reprocesarsinvalidacion',
		component: LayoutComponent,
		children: [{ path: '', component: ReprocesarsinvalidacionComponent }],
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionRoutingModule { }
