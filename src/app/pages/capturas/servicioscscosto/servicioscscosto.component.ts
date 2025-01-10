import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { Message,MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as moment from 'moment';
moment.lang('es');


@Component({
  selector: 'servicioscscosto',
  templateUrl: './servicioscscosto.component.html',
  styleUrls: ['./servicioscscosto.component.scss']
})
export class ServicioscscostoComponent implements OnInit {

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

  tipoCuenta:string[]=[
    'Direct Home',
    'Comercial',
    'Bar Restaurant'
  ];

  zonas:string[]=[
    'METROPOLITANA',
    'URBANA',
    'RURAL',
    'DIFICIL ACCESO'
  ];

  formServicios:UntypedFormGroup;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["Cuenta", "Pais", "Equipos", "Nombre","Tipo_falla", "Horario","Fecha_atencion","Tipo_Cuenta","Tipo_Servicio","Zona","ApellidoP","ApellidoM"]
  enviando: boolean = false;
  closeModal: boolean = true;
  fallas: any[] = []
  equipos: any[] = []
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
  validador = [false];
  serviciosDia:any=[];
  loading: boolean = false


  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) {

    this.formServicios = this.formBuilder.group({
      Cuenta: [null, Validators.required],
      Pais: [null, Validators.required],
      Equipos: [null, Validators.required],
      Nombre: [null, Validators.required],
      // ApellidoP: [null, Validators.required],
      // ApellidoM: [null, Validators.required],
      Tipo_falla: [null, Validators.required],
      Horario: [null, Validators.required],
      Fecha_atencion: [null, Validators.required],
      Tipo_Cuenta: [null, Validators.required],
      Tipo_Servicio: [null, Validators.required],
      Zona: [null, Validators.required],
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
    this.getDatosServicios()
  }

  verify() {
 
    this.formServicios.markAllAsTouched();
    if (this.formServicios.valid) {
      this.display = true;
    }
  }

 

  sendData() {
    this.closeModal = false;
    this.enviando = true;
    if (this.formServicios.valid) {
      this.cors
        .post('Formularios/GuardarFormularioServicios', this.formServicios.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {

            this.formServicios.controls[element].setValue(null)
          })
          this.formServicios.markAsUntouched()
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La solicitud de Servicios fue guardada',
          });
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La solicitud de Servicios no fue guardada',
          });
        });
    }
  }

  getDatosServicios(){
    this.cors.get('Formularios/ObtenerServiciosDia',{user:this.usuario.email})
    .then((response)=>{
      this.serviciosDia = response;
      // console.log(this.serviciosDia)
    })
    .catch((err)=>{
      console.log(err)
    });
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  //▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ MENSAJES ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
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

  dateFormat(value:any){
    return moment(value).format('DD-MMMM-yyyy')
  }

}
