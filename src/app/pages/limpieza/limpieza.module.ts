import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimpiezaRoutingModule } from './limpieza-routing.module';
import { RecuperadoresComponent } from './recuperadores/recuperadores.component';
import { SeriesComponent } from './series/series.component';
import { SafeUrlPipe } from './safeUrl.pipe';
import { SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuariosbotsComponent } from './usuariosbots/usuariosbots.component';
import { EditarusrbotComponent } from './editarusrbot/editarusrbot.component';
import { ListboxModule } from 'primeng/listbox'; // Importa el módulo de Listbox
import { DialogModule } from 'primeng/dialog';
import { LimpiezamasivoComponent } from './limpiezamasivo/limpiezamasivo.component'; // Importa el módulo de Dialog


@NgModule({
  declarations: [
    RecuperadoresComponent,
    SafeUrlPipe,
    SeriesComponent,
    UsuariosbotsComponent,
    EditarusrbotComponent,
    LimpiezamasivoComponent,
  ],
  imports: [
    CommonModule,
    LimpiezaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ListboxModule, // Añade el módulo de Listbox a las importaciones
    DialogModule, // Añade el módulo de Dialog a las importaciones
  ],
  providers: [
    ConfirmationService,MessageService,
  ]
})
export class LimpiezaModule { }