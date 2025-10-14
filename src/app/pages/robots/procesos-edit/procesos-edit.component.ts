import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CorsService } from '@services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'procesos-edit',
  templateUrl: './procesos-edit.component.html',
  styleUrls: ['./procesos-edit.component.scss']
})
export class ProcesosEditComponent implements OnInit {
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  routeSub: Subscription;
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
    private router: Router,
    private route: ActivatedRoute,
    private service: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: UntypedFormBuilder,
    private cors: CorsService
  ) { 
    this.formNuevoProceso = this.formBuilder.group({
      name_process: [null, Validators.required],
      usuario: [null, Validators.required],
      password: [null, Validators.required],
      status: [null, Validators.required],
      id: [null, Validators.required],
      update_At:[null]

    });
    this.routeSub = this.route.params.subscribe((params: any) => {
      if (params['idRobot'] != undefined) {
        this.cors.get(`Bots/getOneProceso`,{
          id:params['idRobot']
        })
          .then((response: any) => {
            // // console.log(response);
            this.formNuevoProceso.patchValue({
              name_process: response.procesoName,
              usuario:response.procesoUser,
              password:response.procesoPassword,
              status: parseInt(response.procesoStatus),
              id:response.procesoID
            });

          })
          .catch((error: any) => {
            // console.log(error);
            this.showToastError('No se encontraron datos de Robot')
          });
      }
    });

  }

  showToastSuccess(mensaje: any) {
    this.service.add({ key: 'tst', severity: 'success', summary: 'Correcto!!', detail: mensaje, });
  }
  showToastError(mensaje: any) {
    this.service.add({ key: 'tst', severity: 'error', summary: 'Correcto!!', detail: mensaje, });
  }

  ngOnInit(): void {
  }

  guardarBot() {
    this.guardando = true;
    this.formNuevoProceso.markAllAsTouched();
    if (this.formNuevoProceso.valid) {
        let a = `${this.formNuevoProceso.controls['status'].value}`;
        let b = {
            "Id": this.formNuevoProceso.controls['id'].value,
            "Name_process": this.formNuevoProceso.controls['name_process'].value,
            "usuario": this.formNuevoProceso.controls['usuario'].value,
            "password": this.formNuevoProceso.controls['password'].value,
            "status": a
        };

        // Obtener el usuario actualizador desde el localStorage
        let usuarioActualizador = this.usuario ? this.usuario.email  : "Desconocido";

        this.cors.put(`Bots/ActualizarProceso?id=${b.Id}&usuarioActualizador=${usuarioActualizador}`, b)
            .then((response) => {
                // // console.log(response)
                this.showToastSuccess('Proceso editado correctamente.');
                setTimeout(() => {
                    this.router.navigate(["/robots/proceso"]);
                }, 1000);
            })
            .catch((error) => {
                // console.log(error);
                this.showToastError('No se logró editar, intente de nuevo.');
            });

    }
}


}
