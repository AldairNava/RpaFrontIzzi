import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesIzziRoutingModule } from './reportes-izzi-routing.module';
import { ReportesIzziDashComponent } from './reportes-izzi-dash/reportes-izzi-dash.component';
import { SharedModule } from 'app/_shared/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeUrlPipe } from './safeUrl.pipe';


@NgModule({
  declarations: [
    ReportesIzziDashComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    ReportesIzziRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class ReportesIzziModule { }
