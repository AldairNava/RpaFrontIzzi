import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CorsService } from '@services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'procesos-nuevo',
  templateUrl: './procesos-nuevo.component.html',
  styleUrls: ['./procesos-nuevo.component.scss']
})
export class ProcesosNuevoComponent implements OnInit {
  formNuevoProceso: UntypedFormGroup;
  procesoStatus:any[]=[
    {
      id:1,
      label:'Activo'
    },
    {
      id:0,
      label:'Desactivado'
    }
  ];
  guardando:boolean=false;


  constructor(
    private message: MessageService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private cors: CorsService
  ) { 

    this.formNuevoProceso = this.formBuilder.group({
      name_process: [null, Validators.required],
      usuario: [null, Validators.required],
      password: [null, Validators.required],
      status: [null, Validators.required],
      // passwordBot: [null, Validators.required],

    });

  }

  ngOnInit(): void {
  }
  showToastSuccess(mensaje: any) {
    this.message.add({ key: 'tst', severity: 'success', summary: 'Correcto!!', detail: mensaje, });
  }
  showToastError(mensaje: any) {
    this.message.add({ key: 'tst', severity: 'error', summary: 'Correcto!!', detail: mensaje, });
  }

  guardarBot(){
    this.formNuevoProceso.markAllAsTouched();
    if(this.formNuevoProceso.valid){
      this.guardando=true;
      let a = `${this.formNuevoProceso.controls['status'].value}`;
      this.formNuevoProceso.patchValue({
        status:a
      });
      this.cors.post('Bots/GuardarProceso', this.formNuevoProceso.value).then((response) => {
        this.showToastSuccess('Proceso guardado correctamente.' );
        setTimeout(() => {
          this.router.navigate(["/robots/proceso"])
        }, 1000);

      }).catch((error) => {
        console.log(error);
        this.showToastError('No se logro guardar, intente de nuevo.');
      })

    }
  }

}
