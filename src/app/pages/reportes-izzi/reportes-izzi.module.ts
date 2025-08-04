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


@NgModule({
  declarations: [
    ReportesIzziDashComponent,
    SafeUrlPipe,
    ReprocesosComponent
  ],
  imports: [
    CommonModule,
    ReportesIzziRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    FileUploadModule,

  ]
})
export class ReportesIzziModule { }
