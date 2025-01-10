import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrarUsuarioComponent } from './registrar-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    RegistrarUsuarioComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
    ToastModule,
    DividerModule,
    ButtonModule
  ],
  exports: [
    RegistrarUsuarioComponent
  ]
})
export class RegistrarUsuarioModule { }
