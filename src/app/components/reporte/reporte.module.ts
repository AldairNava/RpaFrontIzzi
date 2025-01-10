import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteComponent } from './reporte.component';
import { BreadcrumbModule } from '../breadcrumb/bread.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccordionModule } from 'primeng/accordion';
import { ChartModule } from 'primeng/chart';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';




@NgModule({
  declarations: [
     ReporteComponent,
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    SidebarModule,
    ToastModule,
    ProgressBarModule,
    TableModule,
    InputSwitchModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    MenubarModule,
    TooltipModule,
    InputTextareaModule,
    AccordionModule,
    ChartModule,
    BrowserAnimationsModule,
    MultiSelectModule,
    FileUploadModule
  ],
  exports:[
    ReporteComponent
  ]
})
export class ReporteModule { }
