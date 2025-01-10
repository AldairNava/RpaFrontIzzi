import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargarComponent } from './cargar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';


@NgModule({
  declarations: [
    CargarComponent
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
    RouterModule,
    ProgressBarModule,
    DropdownModule
  ],
  exports : [
    CargarComponent
  ]
})
export class CargarModule { }
