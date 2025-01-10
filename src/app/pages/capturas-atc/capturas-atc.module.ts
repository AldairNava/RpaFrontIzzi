import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapturasAtcRoutingModule } from './capturas-atc-routing.module';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapturasdashComponent } from './capturasdash/capturasdash.component';
import { GeneracionSolicitudComponent } from './generacion-solicitud/generacion-solicitud.component';


@NgModule({
  declarations: [CapturasdashComponent, GeneracionSolicitudComponent],
  imports: [
    CommonModule,
    CapturasAtcRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CapturasAtcModule { }
