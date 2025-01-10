import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './../../_shared/layout/layout/layout.component';
import { ReportesIzziDashComponent } from './reportes-izzi-dash/reportes-izzi-dash.component';

const routes: Routes = [
  {
		path: '',
		component: LayoutComponent,
		children: [{ path: '', component: ReportesIzziDashComponent }],
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesIzziRoutingModule { }
