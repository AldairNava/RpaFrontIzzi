import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivaCuentaComponent } from './activa-cuenta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';


@NgModule({
  declarations: [
    ActivaCuentaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
    DividerModule,
    ButtonModule
  ],
  exports:[
    ActivaCuentaComponent
  ]
})
export class ActivaCuentaModule { }
