import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';

import { ReportesComponent } from './reportes.component';
import { SharedModule } from '@shared';
import { SafeUrlPipe } from './safeUrl.pipe';


@NgModule({
  declarations: [
    ReportesComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    SharedModule,
  ]
})
export class ReportesModule { }
