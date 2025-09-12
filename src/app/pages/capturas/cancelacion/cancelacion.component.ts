import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CorsService } from '@services';
import { SocketService } from 'app/_services/socket-service';
import { Message, MessageService } from 'primeng/api';
import { APIService } from '../../../_services/api.service';

import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { SignalRService } from 'app/_services/sirgalR.service';
import { SocketIoService } from 'app/_services/socketio.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'cancelacion',
  templateUrl: './cancelacion.component.html',
  styleUrls: ['./cancelacion.component.scss'],
})
export class CancelacionComponent implements OnInit {
  formCancelacion: UntypedFormGroup;
  agenteID = 123456; //Debe salir del direcotrio activo
  telefonosNd?: string[];
  enviando: boolean = false;
  closeModal: boolean = true;
  tiposCancelacion = [
    {
      value: 'single_video',
      nombre: 'Sigle Video',
    },
    {
      value: 'modem_combo',
      nombre: 'Módem Combo',
    },
    {
      value: 'btcel_combo',
      nombre: 'BTCEL Combo',
    },
  ];

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

  equipos = [
    '1',
    '2',
    '3',
   
  ];

  recar=[
    'Más de 12',
    'Menos de 12',
    'Sin Costo'
  ];

  aplicacion = [
    'Inmediato',
    'Corte',
   
  ];

  confirmacion: any; //Mensaje de confirmmacion de datos

  mostrandoResultados: boolean = false;
  display: boolean = false; //Dialogo de confirmacion
  formulario_valido: boolean | undefined;
  today = new Date();
  minDate =
    this.today.getFullYear() +
    '-' +
    this.today.getMonth +
    '-' +
    this.today.getDay();
  //Alertas y mensajes
  msgs: Message[] = [];
  msgs1: any;
  validador = [false];
  aux: string | undefined;
  aux2: string | undefined;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["recargas","tipoCancelacion", "cuenta", "ordenServicio", "pais", "fechaCorte", "cve_supervisor", "nd","equipos", "aplicacion"]


  offers: any[] = [];
  cancelacionDia:any=[];
  loading: boolean = false

  constructor(

    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) {
    //this.socket.startSocket()

    this.formCancelacion = this.formBuilder.group({
      tipoCancelacion: [null, Validators.required],
      cuenta: [null, Validators.required],
      ordenServicio: [null],
      pais: [null, Validators.required],
      fechaCorte: [null, Validators.required], //Esta fecha es la del dia de la maquina
      cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
      //cve_supervisor: [null, Validators.required],
      nd: [null],
      equipos: [null],
      aplicacion: [null],
      recargas:[null],
      // deducible:[null],
    });
  }

  ngOnInit() {
    this.getDatosCancelacion();
  }



  verify() {

    this.formCancelacion.markAllAsTouched();
    if (this.formCancelacion.valid) {
      this.display = true;
    }
  }
  resetCampos(){
    this.formCancelacion.controls['cuenta'].reset()
    this.formCancelacion.controls['ordenServicio'].reset()
    this.formCancelacion.controls['pais'].reset()
    this.formCancelacion.controls['fechaCorte'].reset()
    this.formCancelacion.controls['equipos'].reset()
    this.formCancelacion.controls['aplicacion'].reset()
    this.formCancelacion.controls['recargas'].reset()
    this.formCancelacion.controls['deducible'].reset()
  }
  tipoCancelacion(evento: any) {
    
    this.resetCampos()
    if (evento == 'BTCel Combo') {
      this.formCancelacion.controls['nd'].setValidators(Validators.required);
      this.formCancelacion.controls['nd'].updateValueAndValidity();
      this.formCancelacion.controls['ordenServicio'].setValidators(Validators.required);
      this.formCancelacion.controls['ordenServicio'].updateValueAndValidity();
      this.formCancelacion.controls['recargas'].clearValidators();
      this.formCancelacion.controls['recargas'].updateValueAndValidity();

    }
    else if (evento == 'Equipos Adicionales'){
      this.formCancelacion.controls['equipos'].setValidators(Validators.required);
      this.formCancelacion.controls['aplicacion'].setValidators(Validators.required);
      this.formCancelacion.controls['equipos'].updateValueAndValidity();
      this.formCancelacion.controls['aplicacion'].updateValueAndValidity();
      this.formCancelacion.controls['ordenServicio'].setValidators(Validators.required);
      this.formCancelacion.controls['ordenServicio'].updateValueAndValidity();
      this.formCancelacion.controls['recargas'].clearValidators();
      this.formCancelacion.controls['recargas'].updateValueAndValidity();
      this.formCancelacion.controls['nd'].clearValidators();
      this.formCancelacion.controls['nd'].updateValueAndValidity();

    }
    else if(evento == 'Single Video'){
      this.formCancelacion.controls['ordenServicio'].setValidators(Validators.required);
      this.formCancelacion.controls['ordenServicio'].updateValueAndValidity();
      this.formCancelacion.controls['recargas'].clearValidators();
      this.formCancelacion.controls['recargas'].updateValueAndValidity();
      this.formCancelacion.controls['nd'].clearValidators();
      this.formCancelacion.controls['nd'].updateValueAndValidity();

    }
    else if(evento == 'Modem Combo'){
      this.formCancelacion.controls['ordenServicio'].setValidators(Validators.required);
      this.formCancelacion.controls['ordenServicio'].updateValueAndValidity();
      this.formCancelacion.controls['recargas'].clearValidators();
      this.formCancelacion.controls['recargas'].updateValueAndValidity();
      this.formCancelacion.controls['nd'].clearValidators();
      this.formCancelacion.controls['nd'].updateValueAndValidity();

    }
    else if(evento== 'Equipo Adicional VeTV'){
      this.formCancelacion.controls['recargas'].setValidators(Validators.required);
      this.formCancelacion.controls['recargas'].updateValueAndValidity();
      this.formCancelacion.controls['nd'].clearValidators();
      this.formCancelacion.controls['nd'].updateValueAndValidity();

    }
    else if(evento=='BTCel Combo VeTV'){
      this.formCancelacion.controls['nd'].setValidators(Validators.required);
      this.formCancelacion.controls['nd'].updateValueAndValidity();

    }
    else {
      this.formCancelacion.controls['nd'].clearValidators();
      this.formCancelacion.controls['equipos'].clearValidators();
      this.formCancelacion.controls['aplicacion'].clearValidators();
      this.formCancelacion.controls['nd'].updateValueAndValidity();
      this.formCancelacion.controls['equipos'].updateValueAndValidity();
      this.formCancelacion.controls['aplicacion'].updateValueAndValidity();
      this.formCancelacion.controls['ordenServicio'].clearValidators();
      this.formCancelacion.controls['ordenServicio'].updateValueAndValidity();
      this.formCancelacion.controls['recargas'].clearValidators();
      this.formCancelacion.controls['recargas'].updateValueAndValidity();
    }
  }

  telefonosMod() {
    this.formCancelacion.controls['nd'].setValue(this.telefonosNd?.join(','));
  }
  sendData() {
    // console.log('click');
    this.closeModal = false;
    this.enviando = true;
    if (this.formCancelacion.valid) {
      this.cors
        .post('Formularios/GuardarFormulario', this.formCancelacion.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {
            // console.log(element);

            this.formCancelacion.controls[element].setValue(null)
          })
          
          this.formCancelacion.markAsUntouched()
          this.telefonosNd = []
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La solicitud de cancelacion fue guardada',
          });
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La solicitud de cancelacion no fue guardada',
          });
        });
    }
  }

  //▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ MENSAJES ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
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

  getDatosCancelacion(){
    this.cors.get('Formularios/ObtenerCancelacionDia',{user:this.usuario.email})
    .then((response)=>{
      this.cancelacionDia = response;
    })
    .catch((err)=>{
      // console.log(err)
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }



}
