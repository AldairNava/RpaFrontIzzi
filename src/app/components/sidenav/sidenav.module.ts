import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SidenavComponent,
    SublevelMenuComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
    ToastModule,
    DividerModule,
    ButtonModule,
    RouterModule
  ],
  exports: [
    SidenavComponent,
    SublevelMenuComponent
  ]
})
export class SidenavModule { }
