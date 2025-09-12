import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './../../_shared/layout/layout/layout.component';
import { OkClienteComponent } from './ok-cliente/ok-cliente.component';
import { ConsultaOkClienteComponent } from './consulta-ok-cliente/consulta-ok-cliente.component';



const routes: Routes = [
  {
    path: 'ImportarOkCliente',
    data: { breadcrumb: 'Importar ok-cliente' },
    component: LayoutComponent,
    children: [{ path: '', component: OkClienteComponent }],
  },
  {
    path: 'ConsultaOKCliente',
    data: { breadcrumb: 'Consultar ok-cliente' },
    component: LayoutComponent,
    children: [{ path: '', component: ConsultaOkClienteComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OkClienteRoutingModule { }
