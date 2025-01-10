import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtraccionRoutingModule } from './extraccion-routing.module';
import { DashboardExtraccionComponent } from './dashboard-extraccion/dashboard-extraccion.component';
import { AutomatizadosComponent } from './automatizados/automatizados.component';

import { SharedModule } from 'app/_shared/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeUrlPipe } from './safeUrl.pipe';
import { DividerModule } from 'primeng/divider';
import { PruebaComponent } from './prueba/prueba.component';

@NgModule({
  declarations: [
    DashboardExtraccionComponent,
    SafeUrlPipe,
    AutomatizadosComponent,
    PruebaComponent
  ],
  imports: [
    CommonModule,
    ExtraccionRoutingModule,
	  SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DividerModule
  ]
})
export class ExtraccionModule { }
