import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { CorsService } from '@services';
import { Message, MessageService } from 'primeng/api';

import { Table } from 'primeng/table';

@Component({
  selector: 'bolsa-datos',
  templateUrl: './bolsa-datos.component.html',
  styleUrls: ['./bolsa-datos.component.scss']
})
export class BolsaDatosComponent implements OnInit {
  formBolsa: UntypedFormGroup;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["cuenta","pais", "tipoCuenta",'paqueteDatos','tipoProceso']
  mostrandoResultados: boolean = false;
  display: boolean = false; //Dialogo de confirmacion
  closeModal: boolean = true;
  enviando: boolean = false;
  msgs: Message[] = [];
  BolsaDia:any=[];
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
  paquetesDatos=[
    '5 GB',
    '10 GB',
    '25 GB',
    '50 GB'
  ];

  paquetesDatos2=[
    "5000 MB",
    "10000 MB",
    "20000 MB",
    "30000 MB",
    "50000 MB",
  ];

  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) {
    this.formBolsa = this.formBuilder.group({
      cuenta: [null, Validators.required],
      pais: [null,Validators.required],
      tipoCuenta: [null,Validators.required],
      paqueteDatos: [null,Validators.required],
      tipoProceso: [null,Validators.required],
      cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
      //cve_supervisor: [null, Validators.required],
    });

   }

  ngOnInit(): void {
    this.getDatosBolsa();
  }

  verify() {
    this.formBolsa.markAllAsTouched();
    // console.log(this.formBolsa)
    if (this.formBolsa.valid) {
      this.display = true;
    }
  }
  sendData() {
    this.closeModal = false;
    this.enviando = true;
    // console.log(this.formBolsa)
    if (this.formBolsa.valid) {
      this.cors
        .post('Formularios/GuardarFormularioBolsaDatos', this.formBolsa.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {
            this.formBolsa.controls[element].setValue(null)
          })
          
          this.formBolsa.markAsUntouched()
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La solicitud de Bolsa de datos fue guardada',
          });
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La solicitud de Bolsa de datos no fue guardada',
          });
        });
    }
  }

  getDatosBolsa(){
    this.cors.get('Formularios/ObtenerBolsaDatosDia',{user:this.usuario.email})
    .then((response)=>{
      // console.log(response)
      this.BolsaDia = response;
    })
    .catch((err)=>{
      console.log(err)
    });

  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  changeCuenta(event:any){
    // console.log(event)
    if(event==='BT To Go'){
      this.formBolsa.controls['paqueteDatos'].reset()
    }else{
      this.formBolsa.controls['paqueteDatos'].reset()

    }
    
  }




}
