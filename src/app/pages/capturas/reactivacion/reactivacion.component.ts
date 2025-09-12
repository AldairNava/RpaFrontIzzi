import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'reactivacion',
  templateUrl: './reactivacion.component.html',
  styleUrls: ['./reactivacion.component.scss']
})
export class ReactivacionComponent implements OnInit {
  formReactivacion:UntypedFormGroup;
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

  equipos: string[]=[
    '1','2','3','4'
  ]

  paquete: string[]=[
    'BASICO',
    'PLATINUM',
    'GOLD',
    'BLACK',
    'FUN',
    'UNIVERSE',
    'HBO'
  ]

  

  closeModal: boolean = true;
  display: boolean = false; //Dialogo de confirmacion
  enviando: boolean = false;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["Cuenta", "Tipo_dispositivo", "Pais","Paquete","Equipos"]
  msgs: Message[] = [];
  validador = [false];
  tipodispos=[];
  reactivacionDia:any=[];
  loading: boolean = false


  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService

  ) { 
    
    this.formReactivacion = this.formBuilder.group({
      Cuenta: [null, Validators.required],
      Tipo_dispositivo: [null,Validators.required],
      Tipo_Cuenta: [null,Validators.required],
      Pais: [null, Validators.required],
      Paquete: [null, Validators.required],
      Equipos: [null, Validators.required],
      cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
    });

    this.cors.get('Formularios/cat_TipoDispositivoReactivacion').then((response) => {
      this.tipodispos = response
    }).catch((error) => {
      // console.log(error)
    })


  }

  ngOnInit(): void {
   this.getDatosReactivacion();
  }

  
  sendData() {
    this.closeModal = false;
    this.enviando = true;
    if (this.formReactivacion.valid) {
      this.cors
        .post('Formularios/GuardarFormularioReactivacion', this.formReactivacion.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {

            this.formReactivacion.controls[element].setValue(null)
          })
          this.formReactivacion.markAsUntouched()
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La solicitud de Reactivación fue guardada',
          });
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La solicitud de Reactivación no fue guardada',
          });
        });
    }
  }
  verify() {

    this.formReactivacion.markAllAsTouched();
    if (this.formReactivacion.valid) {
      this.display = true;
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

  getDatosReactivacion(){
    this.cors.get('Formularios/ObtenerReactivacionDia',{user:this.usuario.email})
    .then((response)=>{
      this.reactivacionDia = response;
    })
    .catch((err)=>{
      // console.log(err)
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }







}
