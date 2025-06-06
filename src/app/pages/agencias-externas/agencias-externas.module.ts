import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import{AgenciasExternasRoutingModule} from './agencias-externas-routing.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SharedModule } from 'app/_shared/modules/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import {CreacionCNsComponent} from'./creacion-cns/creacion-cns.component';
import { ConsultaCreacionCNsComponent } from './consulta-creacion-cns/consulta-creacion-cns.component';


@NgModule({
  declarations: [
    CreacionCNsComponent,
    ConsultaCreacionCNsComponent
  ],
  imports: [
    CommonModule,
    AgenciasExternasRoutingModule,
    SharedModule,
    ConfirmDialogModule,
    ReactiveFormsModule
  ],
  providers: [ConfirmationService], 
})
export class AgenciasExternasModule { }
