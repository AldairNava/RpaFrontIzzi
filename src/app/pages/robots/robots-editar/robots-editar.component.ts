import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CorsService } from '@services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'robots-editar',
  templateUrl: './robots-editar.component.html',
  styleUrls: ['./robots-editar.component.scss']
})
export class RobotsEditarComponent implements OnInit, OnDestroy {
  private routeSub: Subscription;
  formNuevoBot: UntypedFormGroup;
  processArr: any[] = [];
  guardando: boolean = false;
  item:any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: UntypedFormBuilder,
    private cors: CorsService) {
    this.formNuevoBot = this.formBuilder.group({
      hostName: [null, Validators.required],
      ip: [null, [Validators.required, Validators.pattern('(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]],
      procesoId: [null, Validators.required],
      comentarios: [null, Validators.required],
      usuarioBot: [null, Validators.required],
      passwordBot: [null, Validators.required],
      // id: [null, Validators.required],
    });
    this.getCats()
    this.routeSub = this.route.params.subscribe((params: any) => {
      // // console.log(params);
      if (params['idRobot'] != undefined) {
        this.cors.get(`Bots/getBotById/${params['idRobot']}`)
          .then((response: any) => {
            // // console.log(response);
            this.item=response;
            this.formNuevoBot.patchValue({
              hostName:response.botHostName,
              procesoId:response.botProcesoId,
              comentarios:response.botComentarios,
              passwordBot:response.procesoPassword,
              usuarioBot:response.procesoUser,
              ip:response.botIp
            });

          })
          .catch((error: any) => {
            // console.log(error);
            this.showToastError('No se encontraron datos de Robot')
          });
      }
    });
  }

  guardarBot() {
    this.formNuevoBot.markAllAsTouched()
    if (this.formNuevoBot.valid) {
      this.guardando = true
      let a ={
        "id": this.item.botId,
        "comentarios": this.formNuevoBot.controls['comentarios'].value,
        "hostName": this.formNuevoBot.controls['hostName'].value,
        "ip": this.formNuevoBot.controls['ip'].value,
        "fechaActualizacion": null,
        "procesoBotId": this.formNuevoBot.controls['procesoId'].value,
        "procesoBot": {
          "id": this.formNuevoBot.controls['procesoId'].value,
          "name_process": null,
          "usuario": this.formNuevoBot.controls['usuarioBot'].value,
          "password": this.formNuevoBot.controls['passwordBot'].value,
          "update_At": null,
          "status": null
        }
      }
      this.cors.put(`Bots/ActualizarBot?id=${this.item.botId}`, a).then((response) => {

        // // console.log(response);
        this.showToastSuccess('Datos Guardados')
        setTimeout(() => {
          this.router.navigate(["/robots"])
        }, 3000);

      }).catch((error) => {
        // console.log(error);
        this.guardando = false
        this.showToastError('No se lograron guardadar los datos de Robot')
      })
    }
    this.guardando = false
  }
  getCats() {
    this.cors.get('Bots/getCatProcesos').then((response) => {
      // // console.log(response);
      if(response[0] == 'SIN INFO'){
        this.processArr = [];
      }else{
        for(var b=0;b<response.length;b++){
          if(response[b].status == "1"){
            let bb = {
              id:response[b].id,
              name_process:response[b].name_process
            }
            this.processArr.push(bb)
          }
        }
      }

    }).catch((error) => {
      // console.log(error)
    });
  }
  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
  showToastSuccess(mensaje: any) {
    this.service.add({ key: 'tst', severity: 'success', summary: 'Correcto!!', detail: mensaje, });
  }
  showToastError(mensaje: any) {
    this.service.add({ key: 'tst', severity: 'error', summary: 'Correcto!!', detail: mensaje, });
  }

  changeProcess(item:any){
    this.cors.get('Bots/getProcessOne',{
      id:item
    }).then((response) => {
      // // console.log(response);
      this.formNuevoBot.patchValue({
        usuarioBot:response.procesoUser,
        passwordBot:response.procesoPassword,
      });

    }).catch((error) => {
      // console.log(error)
    });

  }



}
