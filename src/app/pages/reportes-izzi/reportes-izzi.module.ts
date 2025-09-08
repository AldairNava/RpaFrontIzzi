import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesIzziRoutingModule } from './reportes-izzi-routing.module';
import { ReportesIzziDashComponent } from './reportes-izzi-dash/reportes-izzi-dash.component';
import { SharedModule } from 'app/_shared/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeUrlPipe } from './safeUrl.pipe';
import { ReprocesosComponent } from './reprocesos/reprocesos.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuariosCXComponent } from './usuarios-cx/usuarios-cx.component';
import { RolesComponent } from './roles/roles.component';  
import { ListboxModule } from 'primeng/listbox';
import { environment } from 'environments/environment.prod';
import { SocketIoService } from 'app/_services/socketio.service';
const config: SocketIoConfig = { url: environment.SCOCKET_URL };
  

@NgModule({
  declarations: [
    ReportesIzziDashComponent,
    SafeUrlPipe,
    ReprocesosComponent,
    UsuariosCXComponent,
    RolesComponent
  ],
  imports: [
    CommonModule,
    ReportesIzziRoutingModule,
    SharedModule,
    FormsModule,
    ListboxModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    SelectButtonModule,
    FileUploadModule
  ],
   providers: [
      SocketIoService,ConfirmationService,MessageService
    ]
})
export class ReportesIzziModule { }
