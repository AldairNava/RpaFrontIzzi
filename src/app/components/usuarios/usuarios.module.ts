import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UsuariosRoutingModule } from './usuarios-routing.module';
import { SharedModule } from 'primeng/api';
import { BreadcrumbModule } from '../breadcrumb/bread.module';
import { MenuModule } from 'primeng/menu';  // Importa MenuModule
import { ButtonModule } from 'primeng/button';  // Importa ButtonModule
import { PrimengModule } from '../../primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';






@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    // UsuariosRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    PrimengModule,
    MenuModule,  // Agrega MenuModule aquí
    ButtonModule,  // Agrega ButtonModule aquí
    BreadcrumbModule
  ],
})
export class UsuariosModule { }
