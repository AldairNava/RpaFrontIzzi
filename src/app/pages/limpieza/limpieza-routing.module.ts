import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './../../_shared/layout/layout/layout.component';
import { RecuperadoresComponent } from './recuperadores/recuperadores.component';
import { SeriesComponent } from './series/series.component';
import { UsuariosbotsComponent } from './usuariosbots/usuariosbots.component';
import { EditarusrbotComponent } from './editarusrbot/editarusrbot.component';
import { LimpiezamasivoComponent } from './limpiezamasivo/limpiezamasivo.component';

const routes: Routes = [
  {
		path: 'series',
    data: { breadcrumb: 'series' },
		component: LayoutComponent,
		children: [{ path: '', component: SeriesComponent }],
	},
	{
		path: 'limpieza-Externa',
    data: { breadcrumb: 'Limpieza Externa' },
		component: LayoutComponent,
		children: [{ path: '', component: LimpiezamasivoComponent }],
	},
	{
		path: 'usuariosbots',
		data: { breadcrumb: 'Usuarios bots' },
		component: LayoutComponent,
		children: [
		  { path: '', component: UsuariosbotsComponent },
		  { path: 'editar/:idRobot', component: EditarusrbotComponent,data: { breadcrumb: 'Editar' } }],
	  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LimpiezaRoutingModule { }
