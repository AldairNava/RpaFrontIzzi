import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'cambio-paquete',
  templateUrl: './cambio-paquete.component.html',
  styleUrls: ['./cambio-paquete.component.scss']
})
export class CambioPaqueteComponent implements OnInit {
  formCambioPaquete:UntypedFormGroup;
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  toClearControls: string[] = ["tipoCuenta", "cuenta", "pais","tipoMovimiento","paqueteOrigen","paqueteDestino","paqueteOrigen1","paqueteDestino1","numDispositivos","costo","tipoDispositivos"]
  display: boolean = false; //Dialogo de confirmacion
  closeModal: boolean = true;
  enviando: boolean = false;
  validador = [false];
  msgs: Message[] = [];
  cambioPaqueteDia:[]=[];
  loading: boolean = false

  paquete: string[]=[
    'SKY HD GOLD',
    'SKY HD PLATINUM',
    'SKY HD HBO',
    'SKY HD BLACK',
    'BASICO',
  ];
  paquete2: string[]=[
    'FUN',
    'UNIVERSE',
    'HBO',
    'BASICO',
  ];

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
  movi:string[]=[
    'Downgrade',
    'Upgrade'
  ]
  dispo: string[]=[
    '1','2'
  ]
  cos:string[]=[
    'SIN',
    'CON'
  ];
  tipo:string[]=[
    'ZAPPER',
    'SSPHD',
    'ULTRA'
  ];


  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) { 
    this.formCambioPaquete = this.formBuilder.group({
      tipoCuenta: [null, Validators.required],
      cuenta: [null,Validators.required],
      pais: [null,Validators.required],
      tipoMovimiento: [null, Validators.required],
      paqueteOrigen: [],
      paqueteOrigen1: [null],
      paqueteDestino: [null],
      paqueteDestino1: [null],
      numDispositivos: [null, Validators.required],
      costo: [null],
      tipoDispositivos: [null],
      cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
    });

  }

  ngOnInit(): void {
    this.getDatosCambioPaquete();
  }

  verify() {
    if(this.formCambioPaquete.controls['paqueteOrigen'].value === null){
      this.formCambioPaquete.controls['paqueteOrigen'].patchValue(this.formCambioPaquete.value.paqueteOrigen1);
    }
    if(this.formCambioPaquete.controls['paqueteDestino'].value === null){
      this.formCambioPaquete.controls['paqueteDestino'].patchValue(this.formCambioPaquete.value.paqueteDestino1);
    }

    this.formCambioPaquete.markAllAsTouched();
    if (this.formCambioPaquete.valid) {
      this.display = true;
    }
  }

  sendData() {
    this.closeModal = false;
    this.enviando = true;
    if (this.formCambioPaquete.valid) {
      this.cors
        .post('Formularios/GuardarFormularioCambioPaquete', this.formCambioPaquete.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {

            this.formCambioPaquete.controls[element].setValue(null)
          })
          this.formCambioPaquete.markAsUntouched()
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La solicitud de Cambio de Paquete fue guardada',
          });
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La solicitud de Cambio de Paquete no fue guardada',
          });
        });
    }
  }


  showErrorViaToast() {
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

  tipoCuen(event:any){
    this.resetCampos();
    if(event == 'NEW ERA'){
      this.formCambioPaquete.controls['paqueteOrigen'].setValidators(Validators.required);
      this.formCambioPaquete.controls['paqueteOrigen'].updateValueAndValidity();
      this.formCambioPaquete.controls['paqueteDestino'].setValidators(Validators.required);
      this.formCambioPaquete.controls['paqueteDestino'].updateValueAndValidity();
      this.formCambioPaquete.controls['tipoDispositivos'].setValidators(Validators.required);
      this.formCambioPaquete.controls['tipoDispositivos'].updateValueAndValidity();
      
      this.formCambioPaquete.controls['paqueteOrigen1'].clearValidators();
      this.formCambioPaquete.controls['paqueteOrigen1'].updateValueAndValidity();
      this.formCambioPaquete.controls['paqueteDestino1'].clearValidators();
      this.formCambioPaquete.controls['paqueteDestino1'].updateValueAndValidity();
      
    }else if(event == 'TRADICIONAL'){
      this.formCambioPaquete.controls['paqueteOrigen1'].setValidators(Validators.required);
      this.formCambioPaquete.controls['paqueteOrigen1'].updateValueAndValidity();
      this.formCambioPaquete.controls['paqueteDestino1'].setValidators(Validators.required);
      this.formCambioPaquete.controls['paqueteDestino1'].updateValueAndValidity();
      
      this.formCambioPaquete.controls['tipoDispositivos'].clearValidators();
      this.formCambioPaquete.controls['tipoDispositivos'].updateValueAndValidity();
      this.formCambioPaquete.controls['paqueteOrigen'].clearValidators();
      this.formCambioPaquete.controls['paqueteOrigen'].updateValueAndValidity();
      this.formCambioPaquete.controls['paqueteDestino'].clearValidators();
      this.formCambioPaquete.controls['paqueteDestino'].updateValueAndValidity();

    }

  }

  resetCampos(){
    // this.formCambioPaquete.controls['tipoCuenta'].reset();
    this.formCambioPaquete.controls['cuenta'].reset();
    this.formCambioPaquete.controls['pais'].reset();
    this.formCambioPaquete.controls['tipoMovimiento'].reset();
    this.formCambioPaquete.controls['paqueteOrigen'].reset();
    this.formCambioPaquete.controls['paqueteDestino'].reset();
    this.formCambioPaquete.controls['paqueteOrigen1'].reset();
    this.formCambioPaquete.controls['paqueteDestino1'].reset();
    this.formCambioPaquete.controls['costo'].reset();
    this.formCambioPaquete.controls['numDispositivos'].reset();
    this.formCambioPaquete.controls['tipoDispositivos'].reset();
  }

  cambioTipo(event:any){
    // console.log(event.value)
    if(event.value=='Downgrade'){
      this.formCambioPaquete.controls['costo'].setValidators(Validators.required);
      this.formCambioPaquete.controls['costo'].updateValueAndValidity();

    }else{
      this.formCambioPaquete.controls['costo'].clearValidators();
      this.formCambioPaquete.controls['costo'].updateValueAndValidity();
    }
  }

  getDatosCambioPaquete(){
    this.cors.get('Formularios/ObtenerCambioPaqueteDia',{user:this.usuario.email})
    .then((response)=>{
      this.cambioPaqueteDia = response;
      // console.log(this.cambioPaqueteDia)
    })
    .catch((err)=>{
      // console.log(err)
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }





}
