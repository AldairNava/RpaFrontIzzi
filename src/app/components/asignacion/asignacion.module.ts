import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { PrimengModule } from '../../primeng.module';
import { AsignacionRoutingModule } from './asignacion-routing.module';
import { AsignacionComponent } from './asignacionAnalistas/asignacion.component';
import { AsignacionIndividualComponent } from './asignacion-individual/asignacion-individual.component';
import { BreadcrumbModule } from '../breadcrumb/bread.module';

@NgModule({
  declarations: [
    AsignacionComponent,
    AsignacionIndividualComponent
  ],
  imports: [
    CommonModule,
    AsignacionRoutingModule,
    SharedModule,
    PrimengModule,
    BreadcrumbModule
  ]
})
export class AsignacionesModule { }
