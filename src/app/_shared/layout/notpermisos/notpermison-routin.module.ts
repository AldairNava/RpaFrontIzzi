import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotpermisosComponent } from './notpermisos.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: NotpermisosComponent }
    ])],
    exports: [RouterModule]
})
export class NotfoundRoutingModule { }