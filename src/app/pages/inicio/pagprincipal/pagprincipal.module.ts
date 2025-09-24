import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagprincipalComponent } from './pagprincipal.component';
import { SharedModule } from '@shared';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PagprincipalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule
  ],
  exports:[
    PagprincipalComponent
  ]
})
export class PagprincipalModule { }
