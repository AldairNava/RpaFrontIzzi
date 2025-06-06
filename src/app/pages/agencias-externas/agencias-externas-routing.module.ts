import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'app/_shared/layout/layout/layout.component';
import { CreacionCNsComponent } from './creacion-cns/creacion-cns.component';
import { ConsultaCreacionCNsComponent } from './consulta-creacion-cns/consulta-creacion-cns.component';

const routes: Routes = [
  {
    path: 'CreacionCNs', 
    data: { breadcrumb: 'Creacion Casos de Negocio' },
    component: LayoutComponent,
    children: [{ path: '', component: CreacionCNsComponent }],
  },
  {
    path: 'PantallaConsulta', 
    data: { breadcrumb: 'Pantalla de consulta de Creacion Casos de Negocio' },
    component: LayoutComponent,
    children: [{ path: '', component: ConsultaCreacionCNsComponent }],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgenciasExternasRoutingModule { }
