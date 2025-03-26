import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './../../_shared/layout/layout/layout.component';
import { DashboardCasosNegocioComponent } from './dashboard-casos-negocio/dashboard-casos-negocio.component';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { ParametrosconfigComponent } from './parametrosconfig/parametrosconfig.component';
import { CancelacionSinValidacionComponent } from './cancelacion-sin-validacion/cancelacion-sin-validacion.component';
import { CasosNegocioSinValidacionComponent } from './casos-negocio-sin-validacion/casos-negocio-sin-validacion.component';
import { ConsultacancelacionSinValidacionComponent } from './consultacancelacion-sin-validacion/consultacancelacion-sin-validacion.component';
import { ConsultacasosNegocioSinValidacionComponent } from './consultacasos-negocio-sin-validacion/consultacasos-negocio-sin-validacion.component';
import { ReprocesarComponent } from './reprocesar/reprocesar.component';
import { ReprocesarsinvalidacionComponent } from './reprocesarsinvalidacion/reprocesarsinvalidacion.component';
import { ReprocesarCasosnegociosinvalidacionComponent } from './reprocesar-casosnegociosinvalidacion/reprocesar-casosnegociosinvalidacion.component';
import { BaseNotdoneComponent } from './base-notdone/base-notdone.component';
import { ImportarNotDoneComponent } from './importar-not-done/importar-not-done.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [{ path: '', component: DashboardCasosNegocioComponent }],
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
		path: 'cancelacionSinValidacion',
		component: LayoutComponent,
		children: [{ path: '', component: CancelacionSinValidacionComponent }],
	},
	{
		path: 'CasosNegocioSinValidacion',
		component: LayoutComponent,
		children: [{ path: '', component: CasosNegocioSinValidacionComponent }],
	},
	{
		path: 'consultaCancelacionSinValidacion',
		component: LayoutComponent,
		children: [{ path: '', component: ConsultacancelacionSinValidacionComponent }],
	},
	{
		path: 'consultaCasosNegocioSinValidacion',
		component: LayoutComponent,
		children: [{ path: '', component: ConsultacasosNegocioSinValidacionComponent }],
	},
	{
		path: 'reprocesarnotdone',
		component: LayoutComponent,
		children: [{ path: '', component: ReprocesarComponent }],
	},
	{
		path: 'reprocesarnotdonesinvalidacion',
		component: LayoutComponent,
		children: [{ path: '', component: ReprocesarsinvalidacionComponent }],
	},
	{
		path: 'reprocesarcasosnegociosinvalidacion',
		component: LayoutComponent,
		children: [{ path: '', component: ReprocesarCasosnegociosinvalidacionComponent }],
	},
	{
		path: 'ImportarNotDone',
		component: LayoutComponent,
		children: [{ path: '', component: ImportarNotDoneComponent }],
	},
	{
		path: 'BasesNotDone',
		component: LayoutComponent,
		children: [{ path: '', component: BaseNotdoneComponent }],
	},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasosNegocioRoutingModule { }
