import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './../../_shared/layout/layout/layout.component';
import { ReportesIzziDashComponent } from './reportes-izzi-dash/reportes-izzi-dash.component';
import { ReprocesosComponent } from './reprocesos/reprocesos.component';
import { UsuariosCXComponent } from './usuarios-cx/usuarios-cx.component';

const routes: Routes = [
	{
		path: 'reportes',
		data: { breadcrumb: 'Reportes'},
		component: LayoutComponent,
		children: [{ path: '', component: ReportesIzziDashComponent }],
	},
	{
		path: 'reporcesos',
		data: { breadcrumb: 'Reprocesos'},
		component: LayoutComponent,
		children: [{ path: '', component: ReprocesosComponent }],
	},
	{
		path: 'usuarioscx',
		data: { breadcrumb: 'Usuarios RPA CX'},
		component: LayoutComponent,
		children: [{ path: '', component: UsuariosCXComponent }],
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesIzziRoutingModule { }
