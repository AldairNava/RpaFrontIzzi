import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrosComponent } from './parametrosComponent/parametros.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { BreadcrumbModule } from '../breadcrumb/bread.module';
import { ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../../primeng.module';

@NgModule({
  declarations: [
     ParametrosComponent,
     CategoriasComponent
  ],
  imports: [
    CommonModule,
    PrimengModule, 
    BreadcrumbModule,
    ReactiveFormsModule
  ],
  exports:[
    ParametrosComponent,
     CategoriasComponent
  ]
})
export class ParametrosModule { }
