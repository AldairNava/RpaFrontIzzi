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
import { FlagConfirmacionComponent } from './flag-confirmacion/flag-confirmacion.component';
import { ConsultarFlagConfirmacionComponent } from './consultar-flag-confirmacion/consultar-flag-confirmacion.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [{ path: '', component: DashboardCasosNegocioComponent }],
	},
	{
		path: 'consulta',
		data: { breadcrumb: 'Consulta' },
		component: LayoutComponent,
		children: [{ path: '', component: PantallaConsultaComponent }],
	},
	{
		path: 'parametros',
		data: { breadcrumb: 'Parámetros' },
		component: LayoutComponent,
		children: [{ path: '', component: ParametrosconfigComponent }],
	},
	{
		path: 'cancelacionSinValidacion',
		data: { breadcrumb: 'Cancelación Sin Validación' },
		component: LayoutComponent,
		children: [{ path: '', component: CancelacionSinValidacionComponent }],
	},
	{
		path: 'CasosNegocioSinValidacion',
		data: { breadcrumb: 'Casos de Negocio Sin Validación' },
		component: LayoutComponent,
		children: [{ path: '', component: CasosNegocioSinValidacionComponent }],
	},
	{
		path: 'consultaCancelacionSinValidacion',
		data: { breadcrumb: 'Consulta Cancelación Sin Validación' },
		component: LayoutComponent,
		children: [{ path: '', component: ConsultacancelacionSinValidacionComponent }],
	},
	{
		path: 'consultaCasosNegocioSinValidacion',
		data: { breadcrumb: 'Consulta Casos de Negocio Sin Validación' },
		component: LayoutComponent,
		children: [{ path: '', component: ConsultacasosNegocioSinValidacionComponent }],
	},
	{
		path: 'ImportarNotDone',
		data: { breadcrumb: 'Importar Not Done Depurado' },
		component: LayoutComponent,
		children: [{ path: '', component: ImportarNotDoneComponent }],
	},
	{
		path: 'BasesNotDone',
		data: { breadcrumb: 'Bases Not Done Depurado' },
		component: LayoutComponent,
		children: [{ path: '', component: BaseNotdoneComponent }],
	},
	{
		path: 'flagConfirmacion',
		data: { breadcrumb: 'Flag de Confirmación' },
		component: LayoutComponent,
		children: [{ path: '', component: FlagConfirmacionComponent }],
	},
	{
		path: 'consultarFlagConfirmacion',
		data: { breadcrumb: 'Consultar Flag de Confirmación' },
		component: LayoutComponent,
		children: [{ path: '', component: ConsultarFlagConfirmacionComponent }],
	},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasosNegocioRoutingModule { }
