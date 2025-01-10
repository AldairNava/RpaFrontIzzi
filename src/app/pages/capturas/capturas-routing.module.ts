import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/_shared/layout/layout/layout.component';
import { BolsaDatosComponent } from '../capturas-atc/bolsa-datos/bolsa-datos.component';
import { CambioEsquemaComponent } from './cambio-esquema/cambio-esquema.component';
import { CambioPaqueteComponent } from './cambio-paquete/cambio-paquete.component';
import { CancelacionComponent } from './cancelacion/cancelacion.component';
import { RAySEComponent } from '../capturas-atc/ray-se/ray-se.component';
import { ReactivacionComponent } from './reactivacion/reactivacion.component';
import { ReembolsoComponent } from './reembolso/reembolso.component';
import { ServicioscscostoComponent } from './servicioscscosto/servicioscscosto.component';
import { SolicitudCancelacionComponent } from './solicitud-cancelacion/solicitud-cancelacion/solicitud-cancelacion.component';
import { TemporadasComponent } from '../capturas-atc/temporadas/temporadas.component';


const routes: Routes = [
  {
    path: 'cancelacion',
    data: { breadcrumb: 'Cancelación' },
    component: LayoutComponent,
    children: [{ path: '', component: CancelacionComponent }],
  },
  {
    path: 'solicitud-cancelacion',
    data: { breadcrumb: 'Solicitud' },
    component: LayoutComponent,
    children: [{ path: '', component: SolicitudCancelacionComponent }],
  },
  {
    path: 'reactivacion',
    data: { breadcrumb: 'Reactivación' },
    component: LayoutComponent,
    children: [{ path: '', component: ReactivacionComponent}],
  },
  {
    path: 'servicioscosto',
    data: { breadcrumb: 'Servicios c/s costo' },
    component: LayoutComponent,
    children: [{ path: '', component: ServicioscscostoComponent}],
  },
  {
    path: 'reembolso',
    data: { breadcrumb: 'Reembolso' },
    component: LayoutComponent,
    children: [{ path: '', component: ReembolsoComponent}],
  },
  {
    path: 'cambioPaquete',
    data: { breadcrumb: 'Cambio de Paquete' },
    component: LayoutComponent,
    children: [{ path: '', component: CambioPaqueteComponent}],
  },
  {
    path: 'cambioEsquema',
    data: { breadcrumb: 'Cambio de Esquema VeTV / VeTV HD' },
    component: LayoutComponent,
    children: [{ path: '', component: CambioEsquemaComponent}],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapturasRoutingModule { }
