import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/_shared/layout/layout/layout.component';
import { BolsaDatosComponent } from './bolsa-datos/bolsa-datos.component';
import { CapturasdashComponent } from './capturasdash/capturasdash.component';
import { GeneracionSolicitudComponent } from './generacion-solicitud/generacion-solicitud.component';
import { RAySEComponent } from './ray-se/ray-se.component';
import { TemporadasComponent } from './temporadas/temporadas.component';

const routes: Routes = [
  {
    path: 'temporadas', 
    data: { breadcrumb: 'Temporadas NFL' },
    component: LayoutComponent,
    children: [{ path: '', component: TemporadasComponent }],
  },
  // {
  //   path: 'PostPagoPrepago',
  //   data: { breadcrumb: 'RA y SE PostPago Prepago' },
  //   component: LayoutComponent,
  //   children: [{ path: '', component: RAySEComponent}],
  // },
  {
    path: 'bolsaDatos',
    data: { breadcrumb: 'Bolsa de Datos' },
    component: LayoutComponent,
    children: [{ path: '', component: BolsaDatosComponent}],
  },
  {
    path: 'garantia',
    data: { breadcrumb: 'Garantía' },
    component: LayoutComponent,
    children: [{ path: '', component: GeneracionSolicitudComponent}],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapturasAtcRoutingModule { }
