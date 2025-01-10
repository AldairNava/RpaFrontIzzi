import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargarPlantillasComponent } from './cargar-plantillas.component';
import { BreadcrumbModule } from '../breadcrumb/bread.module';

import { PrimengModule } from '../../primeng.module';

@NgModule({
  declarations: [
    CargarPlantillasComponent
  ],
  imports: [
    CommonModule,
    PrimengModule, 
    BreadcrumbModule
  ],
  exports:[
    CargarPlantillasComponent
  ]
})
export class CargarPlantillasModule { }
