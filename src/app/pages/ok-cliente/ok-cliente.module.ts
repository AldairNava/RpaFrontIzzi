import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkClienteComponent } from './ok-cliente/ok-cliente.component';
import { OkClienteRoutingModule } from './ok-cliente-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConsultaOkClienteComponent } from './consulta-ok-cliente/consulta-ok-cliente.component';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    OkClienteComponent,
    ConsultaOkClienteComponent
  ],
  imports: [
    CommonModule,
    OkClienteRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
      ConfirmationService,MessageService,
    ]
})
export class OkClienteModule { }
