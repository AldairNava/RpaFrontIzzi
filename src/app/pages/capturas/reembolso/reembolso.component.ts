import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'reembolso',
  templateUrl: './reembolso.component.html',
  styleUrls: ['./reembolso.component.scss']
})
export class ReembolsoComponent implements OnInit {
  formReembolso:UntypedFormGroup;
  pais:string[] = [
    'Mexico',
    'Costa Rica',
    'Panama',
    'Nicaragua',
    'El Salvador',
    ' R. Dominicana',
    'Guatemala',
    'Honduras',
  ];
  anioss:string[]=[
    '1',
    '2'
  ];
  closeModal: boolean = true;
  display: boolean = false; //Dialogo de confirmacion
  enviando: boolean = false;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["Cuenta", "Pais","NumeroSolicitud","anios","TipoCuenta"]
  msgs: Message[] = [];
  validador = [false];
  ReembolsoDia:any=[];
  loading: boolean = false


  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) {
    this.formReembolso = this.formBuilder.group({
      Cuenta: [null, Validators.required],
      Pais: [null, Validators.required],
      NumeroSolicitud: [null, Validators.required],
      anios: [null, Validators.required],
      TipoCuenta: [null, Validators.required],
      cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
    });

   }

  ngOnInit(): void {
    this.getDatosReembolso();
  }

  sendData() {
    console.log('click');
    this.closeModal = false;
    this.enviando = true;
    if (this.formReembolso.valid) {
      this.cors
        .post('Formularios/GuardarFormularioReembolso', this.formReembolso.value)
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

  getDatosReembolso(){
    this.cors.get('Formularios/ObtenerReembolsoDia',{user:this.usuario.email})
    .then((response)=>{
      console.log(response)
      this.ReembolsoDia = response;
    })
    .catch((err)=>{
      console.log(err)
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }








}
