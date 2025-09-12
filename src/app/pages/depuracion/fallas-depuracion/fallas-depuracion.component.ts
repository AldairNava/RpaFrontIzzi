import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { ConfirmationService,Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'fallas-depuracion',
  templateUrl: './fallas-depuracion.component.html',
  styleUrls: ['./fallas-depuracion.component.scss']
})
export class FallasDepuracionComponent implements OnInit {

  formReembolso:UntypedFormGroup;
  closeModal: boolean = true;
  display: boolean = false;
  enviando: boolean = false;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["falla"]
  msgs: Message[] = [];
  validador = [false];
  tablafallas:any=[];
  loading: boolean = false


  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,

  ) {
    this.formReembolso = this.formBuilder.group({
      falla: [null, Validators.required],
    });

   }

  ngOnInit(): void {
    this.gettablafallas();
  }

  sendData() {
    // console.log('click');
    this.closeModal = false;
    this.enviando = true;
    if (this.formReembolso.valid) {
      let formValue = { ...this.formReembolso.value };
    for (let field in formValue) {
      if (typeof formValue[field] === 'string') {
        formValue[field] = formValue[field].trim();
      }
    }
      this.cors
        .post('Bots/guardarformulariofallasdepuracion', this.formReembolso.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {
            this.formReembolso.controls[element].setValue(null)
          })
          this.formReembolso.markAsUntouched()
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La nueva Falla fe guardada Correctamente',
          });
          this.gettablafallas();
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'la nueva Falla no se agrego',
          });
        });
    }
  }
  verify() {
    // console.log(this.formReembolso)
    this.formReembolso.markAllAsTouched();
    if (this.formReembolso.valid) {
      this.display = true;
    }
  }

  showErrorViaToast() {
    // console.log('ERROR');
    this.messageService.add({
      key: 'tst',
      severity: 'error',
      summary: 'Faltan datos',
      detail: 'Ingrese todos todos los campos',
    });
  }
  load(index: number) {
    this.validador[index] = true;
    setTimeout(() => (this.validador[index] = false), 1000);
  }

  gettablafallas(){
    this.cors.get('Bots/Obtenertablafallas',{user:this.usuario.email})
    .then((response)=>{
      // console.log(response)
      this.tablafallas = response;
    })
    .catch((err)=>{
      // console.log(err)
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  showToastSuccess(message: string) {
    this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Éxito',
        detail: message
    });
}

showToastError(message: string) {
    this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Error',
        detail: message
    });
}


eliminarColumna(id: any){
  const item = this.tablafallas.find((item: any) => item.id === id);
  const fallaInfo = item ? item.falla : 'desconocido';
  
  this.confirmationService.confirm({
    key: 'deleteColumn',
    message: `¿Estás seguro de que quieres eliminar el Tipo de falla <strong>${fallaInfo}</strong>?`,
    accept: () => {
      this.cors.delete(`Bots/EliminarFilafalladepuracion?id=${id}`, 
        {
          "id": id
        }
      ).then((response) => {
        // console.log(response);
        const index = this.tablafallas.findIndex((item: any) => item.id === id);
        if (index !== -1) {
          this.tablafallas.splice(index, 1);
        }
        this.showToastSuccess(`Se eliminó la fila con información ${fallaInfo} correctamente.`)
      }).catch((error) => {
        // console.log(error);
        this.showToastError(`No se logró eliminar la fila con información ${fallaInfo}`)
      })
    }
  });
}

}
