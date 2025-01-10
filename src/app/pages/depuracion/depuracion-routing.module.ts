import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './../../_shared/layout/layout/layout.component';
import { BasesDepuradasComponent } from './bases-depuradas/bases-depuradas.component';
import { DashboardDepuracionComponent } from './dashboard-depuracion/dashboard-depuracion.component';
import { BasesCanceladasComponent } from './bases-canceladas/bases-canceladas.component';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { ReportesComponent } from './reportes/reportes.component';
import { PrefijosComponent } from './prefijos/prefijos.component';
import { HobsComponent } from './hobs/hobs.component';
import { FallasDepuracionComponent } from './fallas-depuracion/fallas-depuracion.component';
import { ArchivosCCComponent } from './archivos-cc/archivos-cc.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [{ path: '', component: DashboardDepuracionComponent }],
	},
	{
		path: 'bases',
		component: LayoutComponent,
		children: [{ path: '', component: BasesDepuradasComponent }],
	},
	{
		path: 'basesCanceladas',
		component: LayoutComponent,
		children: [{ path: '', component: BasesCanceladasComponent }],
	},
	{
		path: 'consulta',
		component: LayoutComponent,
		children: [{ path: '', component: PantallaConsultaComponent }],
	},
	{
		path: 'reporte',
		component: LayoutComponent,
		children: [{ path: '', component: ReportesComponent }],
	},
	{
		path: 'prefijos',
		component: LayoutComponent,
		children: [{ path: '', component: PrefijosComponent }],
	},
	{
		path: 'HobsDepuracion',
		component: LayoutComponent,
		children: [{ path: '', component: HobsComponent }],
	},
	{
		path: 'FallasDepuracion',
		component: LayoutComponent,
		children: [{ path: '', component: FallasDepuracionComponent }],
	},
	{
		path: 'Archivos-CC',
		component: LayoutComponent,
		children: [{ path: '', component: ArchivosCCComponent }],
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepuracionRoutingModule { }
