import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CorsService } from '@services';
import { SocketService } from 'app/_services/socket-service';
import { Message, MessageService } from 'primeng/api';
import { APIService } from '../../../../_services/api.service';

import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { SignalRService } from 'app/_services/sirgalR.service';
import { SocketIoService } from 'app/_services/socketio.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'solicitud-cancelacion',
  templateUrl: './solicitud-cancelacion.component.html',
  styleUrls: ['./solicitud-cancelacion.component.scss']
})
  export class SolicitudCancelacionComponent implements OnInit {
    formSolicitud: UntypedFormGroup;
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
  
    aplicacion = [
      'Inmediato',
      'Corte',
     
    ];

    Subestado = [
      'Cancelado',
      'Retenido',
     
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
    toClearControls: string[] = ["TipoCuenta", "Cuenta", "SolicitudServicio", "Pais", "Subestado","Cve_supervisor", "Herramientas_retencion","Motivos_cancelacion"]
  
  
    offers: any[] = [];
    array: any[] = []
    processArr1: any[] = []
    processArr2: any[] = []
    processArr3: any[] = []
    processArr4: any[] = []
    solicitudDia:any=[];
    loading: boolean = false

    constructor(
  
      private cors: CorsService,
      private formBuilder: UntypedFormBuilder,
      private messageService: MessageService
    ) {
      //this.socket.startSocket()
  
      this.formSolicitud = this.formBuilder.group({
        TipoCuenta: [null, Validators.required],
        Cuenta: [null, Validators.required],
        SolicitudServicio: [null, Validators.required],
        Pais: [null, Validators.required],
        Subestado: [null, Validators.required],
        Cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
        Cve_supervisor: [null, Validators.required],
        Herramienta_retencion: [null],
        Motivo_cancelacion: [null],
    
        
      });

      this.cors.get('Formularios/HerramientasRetencionPre').then((response) => {
        console.log(response);
        this.processArr1 = response
      }).catch((error) => {
  
      })

      this.cors.get('Formularios/HerramientasRetencionPost').then((response) => {
        console.log(response);
        this.processArr2 = response
      }).catch((error) => {
  
      })

      this.cors.get('Formularios/MotivosPre').then((response) => {
        console.log(response);
        this.processArr3 = response
      }).catch((error) => {
  
      })

      this.cors.get('Formularios/MotivosPost').then((response) => {
        console.log(response);
        this.processArr4 = response
      }).catch((error) => {
  
      })
    }
  
    ngOnInit() {
      this.getDatosSolicitudCancelacion();
    }
  
  
  
    verify() {
  
      this.formSolicitud.markAllAsTouched();
      if (this.formSolicitud.valid) {
        this.display = true;
      }
    }
  
    tipoCancelacion(evento: any) {
      console.log(evento);
      if (evento == 'Tradicional / New Era') {
        this.formSolicitud.controls['Herramienta_retencion'].setValidators(Validators.required);
        this.formSolicitud.controls['Herramienta_retencion'].updateValueAndValidity();
        this.formSolicitud.controls['Motivo_cancelacion'].setValidators(Validators.required);
        this.formSolicitud.controls['Motivo_cancelacion'].updateValueAndValidity();
      }
      else if (evento == 'VeTV') {
        this.formSolicitud.controls['Herramienta_retencion'].setValidators(Validators.required);
        this.formSolicitud.controls['Herramienta_retencion'].updateValueAndValidity();
        this.formSolicitud.controls['Motivo_cancelacion'].setValidators(Validators.required);
        this.formSolicitud.controls['Motivo_cancelacion'].updateValueAndValidity();
      }
     
      else {
        this.formSolicitud.controls['Herramienta_retencion'].clearValidators();
        this.formSolicitud.controls['Herramienta_retencion'].updateValueAndValidity();
        this.formSolicitud.controls['Motivo_cancelacion'].clearValidators();
        this.formSolicitud.controls['Motivo_cancelacion'].updateValueAndValidity();
      }
    }
  
    telefonosMod() {
      this.formSolicitud.controls['nd'].setValue(this.telefonosNd?.join(','));
    }
    sendData() {
      console.log('click');
      this.closeModal = false;
      this.enviando = true;
      if (this.formSolicitud.valid) {
        this.cors
          .post('Formularios/GuardarFormularioSolicitud', this.formSolicitud.value)
          .then((response) => {
            console.log("d");
  
            this.display = false;
            this.enviando = false;
            this.toClearControls.forEach((element) => {
              console.log(element);
  
              this.formSolicitud.controls[element].setValue(null)
            })
            this.formSolicitud.markAsUntouched()
            this.messageService.add({
              key: 'tst',
              severity: 'success',
              summary: 'Datos guardados',
              detail: 'La solicitud de cancelacion fue guardada',
            });
            console.log(this.messageService);
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


    getDatosSolicitudCancelacion(){
      this.cors.get('Formularios/ObtenerSolicitudCancelacionDia',{user:this.usuario.email})
      .then((response)=>{
        this.solicitudDia = response;
      })
      .catch((err)=>{
        console.log(err)
      });
    }
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  
  }
  
