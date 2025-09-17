import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CorsService } from '@services';
import { Message, MessageService } from 'primeng/api';

import { Table } from 'primeng/table';

@Component({
  selector: 'ray-se',
  templateUrl: './ray-se.component.html',
  styleUrls: ['./ray-se.component.scss']
})
export class RAySEComponent implements OnInit {
  formPostPago: UntypedFormGroup;
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  toClearControls: string[] = ["cuenta","pais", "motivo","Proceso"]
  mostrandoResultados: boolean = false;
  display: boolean = false; //Dialogo de confirmacion
  closeModal: boolean = true;
  enviando: boolean = false;
  msgs: Message[] = [];
  PostPagoDia:any=[];
  loading: boolean = false



  Pais = [
    'Mexico',
    'Costa Rica',
    'Panama',
    'Nicaragua',
    'El Salvador',
    ' R. Dominicana',
    'Guatemala',
    'Honduras',
  ];
   motivos=[
    'Canal sin decodificación',
    'Crédito insuficiente',
    'Error 80',
    'Error 81',
    'Este servicio ha expirado',
    'Mensaje de Adeudo',
    'Reenvio P5',
    'Pantalla en negro',
    'Para contratar este canal',
    'Tarjeta invalida',
    'Tarjeta no autorizada',
    'Error 22',
    'Canal no disponible',
    'Sin boton continuar',
    'Mosaico incorrecto'
   ]
   tipoProc=[
    'Reenvio de Señal',
    'Reenvio de Tarjeta'
   ];

  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) { 
    this.formPostPago = this.formBuilder.group({
      cuenta: [null, Validators.required],
      pais: [null,Validators.required],
      motivo: [null,Validators.required],
      Proceso: [null,Validators.required],
      cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
      //cve_supervisor: [null, Validators.required],
    });

  }

  ngOnInit(): void {
    this.getDatosPostPago();
  }

  verify() {

    this.formPostPago.markAllAsTouched();
    if (this.formPostPago.valid) {
      this.display = true;
    }
  }

  sendData() {
    this.closeModal = false;
    this.enviando = true;
    if (this.formPostPago.valid) {
      this.cors
        .post('Formularios/GuardarFormularioPostPagoPrePago', this.formPostPago.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {
            // console.log(element);

            this.formPostPago.controls[element].setValue(null)
          })
          
          this.formPostPago.markAsUntouched()
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La solicitud de PostPago PrePago fue guardada',
          });
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La solicitud de PostPago PrePago no fue guardada',
          });
        });
    }
  }

  getDatosPostPago(){
    this.cors.get('Formularios/ObtenerPostPagoPrePagoDia',{user:this.usuario.email})
    .then((response)=>{
      // console.log(response)
      this.PostPagoDia = response;
    })
    .catch((err)=>{
      // console.log(err)
    });

  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }




}
