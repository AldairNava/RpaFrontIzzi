import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { CommonModule } from '@angular/common';
import { CancelacionComponent } from './cancelacion/cancelacion.component';
import { CapturasRoutingModule } from './capturas-routing.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SolicitudCancelacionComponent } from './solicitud-cancelacion/solicitud-cancelacion/solicitud-cancelacion.component';
import { ReactivacionComponent } from './reactivacion/reactivacion.component';
import { ServicioscscostoComponent } from './servicioscscosto/servicioscscosto.component';
import { TemporadasComponent } from '../capturas-atc/temporadas/temporadas.component';
import { ReembolsoComponent } from './reembolso/reembolso.component';
import { CambioPaqueteComponent } from './cambio-paquete/cambio-paquete.component';
import { CambioEsquemaComponent } from './cambio-esquema/cambio-esquema.component';
import { RAySEComponent } from '../capturas-atc/ray-se/ray-se.component';
import { BolsaDatosComponent } from '../capturas-atc/bolsa-datos/bolsa-datos.component';



@NgModule({
  declarations: [CancelacionComponent, SolicitudCancelacionComponent, ReactivacionComponent, ServicioscscostoComponent, TemporadasComponent, ReembolsoComponent, CambioPaqueteComponent, CambioEsquemaComponent, RAySEComponent, BolsaDatosComponent],
  imports: [
    SharedModule,
    CommonModule,
    CapturasRoutingModule,
   
    FormsModule,
    ReactiveFormsModule,
  ],
  providers:[]
})
export class CapturasModule {}
