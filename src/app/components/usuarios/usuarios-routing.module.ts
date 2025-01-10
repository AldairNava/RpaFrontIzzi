import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashUsuariosComponent } from './dash-usuarios/dash-usuarios.component';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dash-usuarios', component: DashUsuariosComponent },
      { path: 'nuevo-usuario', component: NuevoUsuarioComponent },
      { path: 'editar', component: EditarUsuarioComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
