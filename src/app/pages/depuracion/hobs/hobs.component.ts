import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { ConfirmationService,Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'hobs',
  templateUrl: './hobs.component.html',
  styleUrls: ['./hobs.component.scss']
})
export class HobsComponent implements OnInit {
  formReembolso:UntypedFormGroup;
  closeModal: boolean = true;
  display: boolean = false;
  enviando: boolean = false;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["hubs"]
  msgs: Message[] = [];
  validador = [false];
  tablahubs:any=[];
  loading: boolean = false


  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,

  ) {
    this.formReembolso = this.formBuilder.group({
      hubs: [null, Validators.required],
      usuario: [this.usuario.email, Validators.required],
    });

   }

  ngOnInit(): void {
    this.gettablahubs();
  }

  sendData() {
    console.log('click');
    this.closeModal = false;
    this.enviando = true;
    if (this.formReembolso.valid) {
      this.cors
        .post('Bots/guardarformulariohubs', this.formReembolso.value)
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
            detail: 'La solicitud de Reembolso fue guardada',
          });
          this.gettablahubs();
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La solicitud de Reembolso no fue guardada',
          });
        });
    }
  }
  verify() {
    console.log(this.formReembolso)
    this.formReembolso.markAllAsTouched();
    if (this.formReembolso.valid) {
      this.display = true;
    }
  }

  showErrorViaToast() {
    console.log('ERROR');
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

  gettablahubs(){
    this.cors.get('Bots/Obtenertablahubs',{user:this.usuario.email})
    .then((response)=>{
      console.log(response)
      this.tablahubs = response;
    })
    .catch((err)=>{
      console.log(err)
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
  const item = this.tablahubs.find((item: any) => item.id === id);
  const hubsInfo = item ? item.hubs : 'desconocido';
  
  this.confirmationService.confirm({
    key: 'deleteColumn',
    message: `¿Estás seguro de que quieres eliminar el hub <strong>${hubsInfo}</strong>?`,
    accept: () => {
      this.cors.delete(`Bots/EliminarFilabub?id=${id}`, 
        {
          "id": id
        }
      ).then((response) => {
        console.log(response);
        const index = this.tablahubs.findIndex((item: any) => item.id === id);
        if (index !== -1) {
          this.tablahubs.splice(index, 1);
        }
        this.showToastSuccess(`Se eliminó la fila con información ${hubsInfo} correctamente.`)
      }).catch((error) => {
        console.log(error);
        this.showToastError(`No se logró eliminar la fila con información ${hubsInfo}`)
      })
    }
  });
}

}