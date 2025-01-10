import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionComponent } from './asignacionAnalistas/asignacion.component';
import { AsignacionIndividualComponent } from './asignacion-individual/asignacion-individual.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'individual/:idAnalista', component: AsignacionIndividualComponent },
      { path: '', redirectTo: 'individual', pathMatch: 'full' }, // Redirigir a 'individual' por defecto
      { path: '', component: AsignacionComponent }, // Componente 'AsignacionComponent' si no coincide ninguna subruta
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionRoutingModule { }
