import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreaordenRoutingModule } from './creaorden-routing.module';
import { CreacionOrdenesComponent } from './creacion-ordenes/creacion-ordenes.component';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PantallaConsultaComponent } from './pantalla-consulta/pantalla-consulta.component';
import { CallTroubleComponent } from './call-trouble/call-trouble.component';
import { ConsultaCallTroubleComponent } from './consulta-call-trouble/consulta-call-trouble.component';
import { ReprocesarCallTroubleComponent } from './reprocesar-call-trouble/reprocesar-call-trouble.component';
import { ReprocesarCreaordenComponent } from './reprocesar-creaorden/reprocesar-creaorden.component';


@NgModule({
  declarations: [
    CreacionOrdenesComponent,
    PantallaConsultaComponent,
    CallTroubleComponent,
    ConsultaCallTroubleComponent,
    ReprocesarCallTroubleComponent,
    ReprocesarCreaordenComponent
  ],
  imports: [
    CommonModule,
    CreaordenRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class CreaordenModule { }
