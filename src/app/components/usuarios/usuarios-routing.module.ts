import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashUsuariosComponent } from './dash-usuarios/dash-usuarios.component';


const routes: Routes = [
  {
    path: '',
    component: DashUsuariosComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
