import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CorsService } from '@services';
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'cambio-esquema',
  templateUrl: './cambio-esquema.component.html',
  styleUrls: ['./cambio-esquema.component.scss']
})
export class CambioEsquemaComponent implements OnInit {
  formCambioEsquema:UntypedFormGroup;
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  toClearControls: string[] = ["tipoCuenta", "cuenta", "pais","tipoCambio","numDispositivos"]
  display: boolean = false; //Dialogo de confirmacion
  closeModal: boolean = true;
  enviando: boolean = false;
  validador = [false];
  msgs: Message[] = [];
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
  cambio:string[]=[
    'Inmediato',
    'Corte'
  ];
  dispo:string[]=[
    '1',
    '2'
  ];
  cambioPaqueteEsquemaDia:[]=[];
  loading: boolean = false


  constructor(
    private cors: CorsService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService
  ) {
    this.formCambioEsquema = this.formBuilder.group({
      tipoCuenta: [null, Validators.required],
      cuenta: [null,Validators.required],
      pais: [null,Validators.required],
      tipoCambio: [null, Validators.required],
      numDispositivos: [null, Validators.required],
      cve_usuario: [this.usuario.email, Validators.required], //Se obtiene del direcotrio activo
    });

   }

  ngOnInit(): void {
    this.getDatosCambioEsquema();
  }

  verify() {
    this.formCambioEsquema.markAllAsTouched();
    if (this.formCambioEsquema.valid) {
      this.display = true;
    }
  }

  sendData() {
    this.closeModal = false;
    this.enviando = true;
    if (this.formCambioEsquema.valid) {
      this.cors
        .post('Formularios/GuardarFormularioCambioEsquema', this.formCambioEsquema.value)
        .then((response) => {
          this.display = false;
          this.enviando = false;
          this.toClearControls.forEach((element) => {

            this.formCambioEsquema.controls[element].setValue(null)
          })
          this.formCambioEsquema.markAsUntouched()
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Datos guardados',
            detail: 'La solicitud de Cambio de Esquema fue guardada',
          });
        })
        .catch((error) => {
          error;
          this.enviando = false;
          this.display = false;
          this.msgs.push({
            severity: 'error',
            summary: 'No se logro guardar',
            detail: 'La solicitud de Cambio de Esquema no fue guardada',
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

  getDatosCambioEsquema(){
    this.cors.get('Formularios/ObtenerCambioEsquemaDia',{user:this.usuario.email})
    .then((response)=>{
      this.cambioPaqueteEsquemaDia = response;
    })
    .catch((err)=>{
      console.log(err)
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }



}
