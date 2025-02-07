import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ZingchartAngularModule } from 'zingchart-angular';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
    FormsModule,
    TableModule,
    CalendarModule,
    ToastModule,
    DividerModule,
    ButtonModule,
    ChartModule,
    ZingchartAngularModule
  ],
  exports : [
    DashboardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule { }
