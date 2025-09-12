import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { Table } from 'primeng/table';

@Component({
  selector: 'temporadas',
  templateUrl: './temporadas.component.html',
  styleUrls: ['./temporadas.component.scss']
})
export class TemporadasComponent implements OnInit {
  formTemporada:UntypedFormGroup;
  closeModal: boolean = true;
  display: boolean = false; //Dialogo de confirmacion
  enviando: boolean = false;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["Cuenta", "Producto", "TipoCuenta","TipoTemporada","Pais","Equipos"]
  msgs: Message[] = [];
  validador = [false];
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
  dispo:string[]=[
    'Slave3',
    'Slave2',
    'Slave1',
    'Master',
  ]
  equipos:any;
  productos:any;
  tipoCuenta:any;
  temporadaDia:any=[];
  loading: boolean = false


  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) {
    this.formTemporada = this.formBuilder.group({
      Cuenta: [null, Validators.required],
      Pais: [null, Validators.required],
      Producto: [null,Validators.required],
      TipoCuenta: [null,Validators.required],
      TipoTemporada: [null,Validators.required],
      Equipos: [null,Validators.required],
      Dispositivos: [null],
      cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
    });
  }

  ngOnInit(): void {
    this.getSelects();
    this.getDatosTemporadas();
  }
  sendData() {
    // console.log("Esto es temporada",this.formTemporada);
    this.closeModal = false;
    this.enviando = true;
    if (this.formTemporada.valid) {
      this.cors
        .post('Formularios/GuardarFormularioTemporadas', this.formTemporada.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {
            // // console.log(element)
            this.formTemporada.controls[element].setValue(null)
          })
          this.formTemporada.markAsUntouched()
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La solicitud de Temporadas fue guardada',
          });
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La solicitud de Temporadas no fue guardada',
          });
        });
    }
  }
  verify() {
    this.formTemporada.markAllAsTouched();
    if (this.formTemporada.valid) {
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

  getSelects(){
    this.cors.get('Formularios/cat_temporadas_equipos').then((response) => {
      this.equipos = response
    }).catch((error) => {
      // console.log(error)
    })
    this.cors.get('Formularios/cat_temporadas_tipo_cuenta').then((response) => {
      this.tipoCuenta = response
    }).catch((error) => {
      // console.log(error)
    })
    this.cors.get('Formularios/cat_temporadas_producto').then((response) => {
      this.productos = response
    }).catch((error) => {
      // console.log(error)
    })
  }

  changeTipoCuenta(event:any){
    if(event.value =='COMERCIAL'){
      this.formTemporada.get('Dispositivos')?.setValidators(Validators.required);
      this.formTemporada.get('Dispositivos')?.updateValueAndValidity();
    }else{
      this.formTemporada.get('Dispositivos')?.clearValidators();
    }
  }

  getDatosTemporadas(){
    this.cors.get('Formularios/ObtenerTemporadaDia',{user:this.usuario.email})
    .then((response)=>{
      this.temporadaDia = response;
    })
    .catch((err)=>{
      // console.log(err)
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }






}
