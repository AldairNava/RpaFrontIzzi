import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/_shared/layout/layout/layout.component';
import { CreacionOrdenesComponent } from './creacion-ordenes/creacion-ordenes.component';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { CallTroubleComponent } from './call-trouble/call-trouble.component';
import { ConsultaCallTroubleComponent } from './consulta-call-trouble/consulta-call-trouble.component';
import { ReprocesarCallTroubleComponent } from './reprocesar-call-trouble/reprocesar-call-trouble.component';
import { ReprocesarCreaordenComponent } from './reprocesar-creaorden/reprocesar-creaorden.component';

const routes: Routes = [
  {
    path: 'creacion-Orden', 
    data: { breadcrumb: 'Creación de Ordenes' },
    component: LayoutComponent,
    children: [{ path: '', component: CreacionOrdenesComponent }],
  },
  {
    path: 'consulta-creacion-Orden', 
    data: { breadcrumb: 'Consulta de Creación de Ordenes' },
    component: LayoutComponent,
    children: [{ path: '', component: PantallaConsultaComponent }],
  },
  {
    path: 'Reprocesar-Creacion-Ordenes', 
    data: { breadcrumb: 'Reprocesamiento de Creacion Ordenes' },
    component: LayoutComponent,
    children: [{ path: '', component: ReprocesarCreaordenComponent }],
  },
  {
    path: 'Ordenes-Call-Trouble', 
    data: { breadcrumb: 'Call Trouble Ordenes' },
    component: LayoutComponent,
    children: [{ path: '', component: CallTroubleComponent }],
  },
  {
    path: 'Consulta-Ordenes-Call-Trouble', 
    data: { breadcrumb: 'Consulta de Call Trouble Ordenes' },
    component: LayoutComponent,
    children: [{ path: '', component: ConsultaCallTroubleComponent }],
  },
  {
    path: 'Reprocesar-Call-Call_Trouble', 
    data: { breadcrumb: 'Reprocesamiento de Call Trouble' },
    component: LayoutComponent,
    children: [{ path: '', component: ReprocesarCallTroubleComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreaordenRoutingModule { }
