import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { Message,MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as moment from 'moment';
moment.lang('es');

@Component({
  selector: 'generacion-solicitud',
  templateUrl: './generacion-solicitud.component.html',
  styleUrls: ['./generacion-solicitud.component.scss']
})
export class GeneracionSolicitudComponent implements OnInit {
  tipoCuenta:string[]=[
    'Direct Home',
    'Comercial',
    'Bar Restaurant'
  ];
  Pais:string[] = [
    'Mexico',
    'Costa Rica',
    'Panama',
    'Nicaragua',
    'El Salvador',
    ' R. Dominicana',
    'Guatemala',
    'Honduras',
  ];
  horarios:string[]=[
    'AM',
    'PM',
    'Abierto'
  ];
  zonas:string[]=[
    'METROPOLITANA',
    'URBANA',
    'RURAL',
    'DIFICIL ACCESO'
  ];
  clasifica:string[]=[
    'Reparaciones',
    'Reparaciones VETV',
    'Garantia De Instalacion',
    'Garantia de Instalacion VETV',
    'Garantia De Reparacion',
    'Garantia de Reparacion VETV',
    'Queja de Reparaciones Garantia',
    'Queja de Rep Garantia VETV',
    'Queja de Instalacion Garantia',
    'Servicios con costo VETV',
    'Queja de Inst Garantia VETV',
  ];

  detalle1:string[]=[
    '1 Equipo',
    '2 Equipos',
    '3-4 Equipos',
  ];
  detalle2:string[]=[
    '1 Equipo',
    '2 Equipos',
    'No acepta Cobro SC Garantia De Instalacion',
  ];
  detalle3:string[]=[
    '-',
    'Reincidente',
    'Cerrada sin Atender',
    'Reporte Supervisor',
  ];
  detalle4:string[]=[
    'Maltrato al Tecnico',
    'Mala Instalacion',
    'Cobros Indebidos',
    'Daño en Domicilio',
  ];
  detalle5:string[]=[
    'Maltrato del Tecnico',
    'Mala Instalacion',
    'Cobros Indebidos',
    'Daño en Domicilio',
  ];
  detalle6:string[]=[
    '1 Equipo',
    '2 Equipos'
  ];



  fallas: any[] = [];
  equipos: any[] = [];
  today = new Date();

  formGeneracionSolicitud:UntypedFormGroup;
  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  msgs: Message[] = [];
  validador = [false];
  loading: boolean = false
  toClearControls: string[] = ["Cuenta","Tipo_Cuenta","Nombre", "Pais","Tipo_falla", "Horario","Fecha_atencion","Zona","Clasificacion","detalle"]
  enviando: boolean = false;
  closeModal: boolean = true;
  mostrandoResultados: boolean = false;
  display: boolean = false; //Dialogo de confirmacion
  generacionSolicitudDia:any=[];


  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) {
    this.formGeneracionSolicitud = this.formBuilder.group({
      Cuenta: [null, Validators.required],
      Tipo_Cuenta: [null, Validators.required],
      Nombre: [null, Validators.required],
      Pais: [null, Validators.required],
      Tipo_falla: [null, Validators.required],
      Fecha_atencion: [null, Validators.required],
      Horario: [null, Validators.required],
      Zona: [null, Validators.required],
      Clasificacion: [null, Validators.required],
      detalle: [null, Validators.required],
      Cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
      
    });
    this.cors.get('Formularios/cat_TipoFallas').then((response) => {
      this.fallas = response
    }).catch((error) => {

    })

    this.cors.get('Formularios/cat_equipos').then((response) => {
      this.equipos = response
    }).catch((error) => {

    })


   }

  ngOnInit(): void {
    this.getDatosGeneracionSolicitud()
  }

  verify() {
    this.formGeneracionSolicitud.markAllAsTouched();
    if (this.formGeneracionSolicitud.valid) {
      this.display = true;
    }
  }
  sendData() {
    this.closeModal = false;
    this.enviando = true;
    if (this.formGeneracionSolicitud.valid) {
      this.cors
        .post('Formularios/GuardarGeneracionSolicitud', this.formGeneracionSolicitud.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {

            this.formGeneracionSolicitud.controls[element].setValue(null)
          })
          this.formGeneracionSolicitud.markAsUntouched()
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La cuenta para la Generación de Solicitud fue guardada',
          });
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La cuenta para la Generación de Solicitud no fue guardada',
          });
        });
    }
  }

  clasificacionChange(event:any){
    // console.log(event)
    this.formGeneracionSolicitud.controls['detalle'].reset()
  }

  getDatosGeneracionSolicitud(){
    this.cors.get('Formularios/ObtenerGeneracionSolicitudDia',{user:this.usuario.email})
    .then((response)=>{
      // console.log(response)
      this.generacionSolicitudDia = response;
    })
    .catch((err)=>{
      // console.log(err)
    });

  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  dateFormat(value:any){
    return moment(value).format('DD-MMMM-yyyy')
  }




}
