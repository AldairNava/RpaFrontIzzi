import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './../../_shared/layout/layout/layout.component';
import { DashboardReporteFidelizacionComponent } from './dashboard-reporte-fidelizacion/dashboard-reporte-fidelizacion.component';

const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [{ path: '', component: DashboardReporteFidelizacionComponent }],
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteFidelizacionRoutingModule { }
