import { Component, OnInit, ViewChild, OnDestroy, NgZone  } from '@angular/core';
import { Router } from '@angular/router';
import { DarkService } from '../../services/darkmode/dark.service';
import { HttpClient } from '@angular/common/http';
import { CorsService } from '../../services/cors/cors.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';

import Swal, { SweetAlertIcon } from 'sweetalert2';

import { Calendar } from 'primeng/calendar';



@Component({
  selector: 'app-programar',
  templateUrl: './programar.component.html',
  styleUrls: ['./programar.component.scss'],
  providers: [MessageService]

})
export class ProgramarComponent implements OnInit, OnDestroy {
  @ViewChild('myCalendar') myCalendar?: Calendar;

  eventSource?: EventSource;

  constructor(private dark: DarkService, 
    private router: Router, 
    private http: HttpClient, 
    private cors: CorsService,
    private messageService: MessageService,
    private zone: NgZone,
    private form: FormBuilder
    ) {
      this.formCron = this.form.group({
        hora: ['', Validators.required],
        minutos: ['', Validators.required],
        dias: ['', Validators.required],
        servicio: ['', Validators.required],
        soporte: ['', Validators.required],
        retenciones: ['', Validators.required],
      });
    }

  ngOnInit(): void {
    this.darkModeSubscription();

    // this.conectaPy();
  
    const user = sessionStorage.getItem('user_id');
    
    if(user) {
      this.usuario = user;
    }

    this.dias = [
      {name: 'Lunes', code: '0'}, // ESTE CODE ES PARA appscheduler de python, los cron van de 0 dom a sab 6
      {name: 'Martes', code: '1'},
      {name: 'Miércoles', code: '2'},
      {name: 'Jueves', code: '3'},
      {name: 'Viernes', code: '4'},
      {name: 'Sábado', code: '5'},
      {name: 'Domingo', code: '6'}
    ];


    this.llenarHoras();

    this.llenarMinutos();

    this.obtenerTareas();

    this.cols = [
      'Id', 'Status', 'Se ejecuta', 'Última Ejecución', 'Acciones'
    ];


  }

  ngOnDestroy() {
    this.eventSource?.close();
  }


  formCron: any;

  textoBtn: string = 'Programar';
  dias: any = [];
  horas: any[] = [];
  minutos: any[] = [];

  usuario: string = '';

  habilitaProgramar: boolean = false;

  horaElegida: any = undefined;
  minutosElegidos: any = undefined;
  diasElegidos: any = undefined;
  diasElegidosFormato: string = '';

  ejecucion: string = '';

  mode: boolean | undefined;
  fechayHora: any = '';
  rangeDates: any[] = [];


  fullData: boolean = false;

  cols: any | undefined;


  tableData: any | undefined = [];
  isData: boolean | undefined;
  
  progresos: any = {
    "login": 5,
    "VQD_soporte": 10,
    "VQD_servicios":20,
    "VQD_retencion":30,
    "subida_ftp":50,
    "subida_base_datos":60,
    "inicianlizando_analisis": 80
  }

  llenarHoras() {
    for(let i = 0; i <= 23; i++) {
      let hora: any = 0;
      let code: any = '';
      if(i < 10) {
        hora = i.toString();
        hora = `0${hora}:00:00`;
        code = i;
      } else {
        hora = i.toString();
        hora = `${hora}:00:00`;
        code = i;
      }

      let obj = {
        value: hora,
        code: code
      };

      this.horas.push(obj);
    }
  }

  llenarMinutos() {
    for( let i = 0 ; i <= 59 ; i++ ) {
      let min: any = 0;
      let code: string = '';
      if(i < 10) {
        min = i.toString();
        min = `00:0${min}:00`;
        code = i.toString();
      } else {
        min = i.toString();
        min = `00:${min}:00`;
        code = i.toString();
      }

      let obj = {
        value: min,
        code: code
      };

      this.minutos.push(obj);
    }
  }

  seleccionando() {
    this.horaElegida = this.formCron.value.hora;
    this.minutosElegidos = this.formCron.value.minutos;
    this.diasElegidos = this.formCron.value.dias;
    let diasSeleccionados = '';

    if(this.diasElegidos != '') {
      diasSeleccionados = this.diasSeleccionadosFormato();
    }


    if(this.horaElegida === '' && (this.minutosElegidos != '' || this.diasElegidos === '')) {
      this.ejecucion = 'Se ejecuta cada ' + this.minutosElegidos.code + ' minutos';

      if(this.diasElegidos != '') {
        this.ejecucion = 'Se ejecuta cada ' + this.minutosElegidos.code + ' minutos' + ` los días: ${diasSeleccionados}`;
      }

      this.generaCronExpresion('minutos');
    }

    if(this.horaElegida != '' && this.horaElegida != 'nada' && this.minutosElegidos === '' ) {
      this.ejecucion = 'Se ejecuta cada ' + this.horaElegida.code + ' horas';

      if(this.diasElegidos != '') {
        this.ejecucion = 'Se ejecuta cada ' + this.horaElegida.code + ' horas' + ` los días: ${diasSeleccionados}`;
      }
      
      this.generaCronExpresion('horas');
    }

    if(this.horaElegida != '' && this.horaElegida != 'nada' && this.minutosElegidos != '' && this.diasElegidos === '') {
      let horaCompleta: string = '';
      let minutosFormato: string = '';

      if( parseInt(this.minutosElegidos.code, 10) >= 10) {
        minutosFormato = this.minutosElegidos.code;
      } else {
        minutosFormato = `0${this.minutosElegidos.code}`; 
      }

      if( parseInt(this.horaElegida.code, 10) >= 12) {
        horaCompleta = `${this.horaElegida.code}:${minutosFormato} pm`;
      } else {
        horaCompleta = `0${this.horaElegida.code}:${minutosFormato} am`; 
      }

      if( parseInt(this.horaElegida.code, 10) === 11 || parseInt(this.horaElegida.code, 10) === 10) {
        horaCompleta = `${this.horaElegida.code}:${minutosFormato} am`;
      } 

      this.ejecucion = `Se ejecuta a las ${horaCompleta}`;

      this.generaCronExpresion('horaMin');

    }

    if(this.horaElegida != '' && this.horaElegida != 'nada' && this.minutosElegidos != '' && this.diasElegidos != '') {
      let horaCompleta: string = '';

      let minutosFormato: string = '';


      if( parseInt(this.minutosElegidos.code, 10) >= 9) {
        minutosFormato = this.minutosElegidos.code;
      } else {
        minutosFormato = `0${this.minutosElegidos.code}`; 
      }

      if( parseInt(this.horaElegida.code, 10) >= 12) {
        horaCompleta = `${this.horaElegida.code}:${minutosFormato} pm`;
      } else {
        horaCompleta = `0${this.horaElegida.code}:${minutosFormato} am`; 
      }

      if( parseInt(this.horaElegida.code, 10) === 10 || parseInt(this.horaElegida.code, 10) === 11) {
        // console.log('entrando')
        horaCompleta = `${this.horaElegida.code}:${minutosFormato} am`; 
      }

      this.ejecucion = `Se ejecuta a las ${horaCompleta} los días: ${diasSeleccionados}`;

      this.generaCronExpresion('full');

    }


    if(this.formCron.valid) {
      this.cuentaAudios();
    }
  }

  cuentaAudios() {
    const servicio = Number(this.formCron.value.servicio);
    const soporte = Number(this.formCron.value.soporte);
    const retenciones = Number(this.formCron.value.retenciones);
    const audiosTotales = servicio + soporte + retenciones;
    if(audiosTotales < 1000) {
      this.habilitaProgramar = true;
    } else {
      this.showMessage('error', 'Error', 'Debes seleccionar menos de 1000 audios');
      this.habilitaProgramar = false;
    }
  }

  diasSeleccionadosFormato() {
    let diasSeleccionados = '';

    this.diasElegidos.forEach((dia: any) => {
      if(diasSeleccionados === '') {
        diasSeleccionados = `${dia.name}`;
      } else {
        diasSeleccionados = diasSeleccionados + `, ${dia.name}`;
      }
    });
    return diasSeleccionados;
  }

  expresionCron: string = '';

  generaCronExpresion(tipo: string) {
    if(this.diasElegidos != undefined) {
      this.diasElegidosFormato = this.formatoDias();
    }

    if(tipo === 'minutos') {
      this.expresionCron = `*/${this.minutosElegidos.code} * ? * ${this.diasElegidosFormato}`;
      // console.log(this.formCron.value)
      this.formCron.get('hora').clearValidators();
      this.formCron.get('hora').updateValueAndValidity();
      this.formCron.value.hora = 'nada';

    }

    if(tipo === 'horas') {
      this.expresionCron = `0 */${this.horaElegida.code} ? * ${this.diasElegidosFormato}`;
    }

    if(tipo === 'horaMin') {
      this.expresionCron = `${this.minutosElegidos.code} ${this.horaElegida.code} ? * ${this.diasElegidosFormato}`;
    }

    if(tipo === 'full') {
      this.expresionCron = `${this.minutosElegidos.code} ${this.horaElegida.code} ? * ${this.diasElegidosFormato}`;
    }
  }

  formatoDias() {
    let long = this.diasElegidos.length;
    let expresionDias: string = '';

    if( long === 1 ) {
      return this.diasElegidos[0].code;
    }

    if( long > 1 ) {
      this.diasElegidos.forEach((dia: any) => {
        if(expresionDias === '') {
          expresionDias = dia.code;
        } else {
          expresionDias = expresionDias + `,${dia.code}`
        }
      });

      return expresionDias;
    }
  }

  confirmarGuardar() {
    if(this.textoBtn === 'Actualizar') {
      this.muestraAlerta('Desea actualizar la tarea?', 'Actualizar', 'Cancelar', () => this.actualizarTareaDB()) 
    } else {
      this.muestraAlerta(`¿Desea programar la tarea? ${this.ejecucion}`, 'Programar', 'Cancelar', () => this.insertaTareaDB()) 
    }
  }

  actualizarTareaDB() {
    const data = {
      controlador: 'ProgramarController',
      metodo: 'actualizarTareaDB',
      expresion: this.expresionCron,
      usuario: this.usuario,
      ejecucion: this.ejecucion,
      id_cron: this.id_cron
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.eliminarTareaPy(data);
        } else {
          this.showMessage('error', 'Error', 'Ocurrió un error, por favor contacta al administrador');
        }
      },
      (err: any) => {
        // console.log(err);
      }
    )
  }

  id_cron: any = '';


  insertaTareaDB() {
    this.id_cron = '';
    this.id_cron = this.generateUUID().substring(0, 10);
    const cantidad = `${this.formCron.value.servicio}, ${this.formCron.value.soporte}, ${this.formCron.value.retenciones}`

    const data = {
      controlador: 'ProgramarController',
      metodo: 'guardarCronDB',
      expresion: this.expresionCron,
      usuario: this.usuario,
      ejecucion: this.ejecucion,
      id_cron: this.id_cron,
      audios: cantidad
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.insertarTareaCron(data);
        } else {
          this.showMessage('error', 'Error', 'Ocurrió un error, por favor contacta al administrador');
        }
      },
      (err: any) => {
        // console.log(err);
        this.showMessage('error', 'Error', 'Ocurrió un error, por favor contacta al administrador');

      }
    )
  }

  insertarTareaCron(data: any) {
    data.controlador = 'ProgramarController';
    data.metodo = 'guardarCronPy';
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.showMessage('success', 'Éxito', 'Se ha programado la tarea exitosamente');
          this.obtenerTareas();
          this.textoBtn = 'Programar';
          this.diasElegidos = undefined;
          this.horaElegida = undefined;
          this.minutosElegidos = undefined;
          this.ejecucion = '';
        } else {
            this.showMessage('error', 'Error', 'Ocurrió un error, por favor contacta al administrador');
        }
      },
      (err: any) => {
        // console.log(err);
        this.showMessage('error', 'Error', 'Ocurrió un error, por favor contacta al administrador');
      }
    )
  }

  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  obtenerTareas() {
    const data = {
      controlador: 'ProgramarController',
      metodo: 'obtenerTareas',
      'user': this.usuario
    }
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.isData = true;
          this.tableData = [];
          this.tableData =  res.data;

          this.tableData.forEach((data: any) => {
            data.progreso = 0;
          })
        } else {
          this.tableData = [];
          this.isData = false;
      }
      },
      (err: any) => {
        // console.log(err);
      }
    )
  }

  confirmaEliminar(data: any) {
    this.muestraAlerta('¿Desea eliminar esta tarea?', 'Eliminar', 'Cancelar', () => this.eliminarTarea(data) ) 
  }


  eliminarTarea(data: any) {
    const dataSend = {
      controlador: 'ProgramarController',
      metodo: 'eliminarTareaDB',
      id_cron: data.id_cron
    }
    
    this.cors.post(dataSend).subscribe(
      (res: any) => {
        if(res.status) {
          this.eliminarTareaPy(data);
        } else {
          this.showMessage('error', 'Error', 'Ocurrió un error, por favor contacta al administrador');
        }
      },
      (err: any) =>{
        // console.log(err)
        this.showMessage('error', 'Error', 'Ocurrió un error, por favor contacta al administrador');
      }
    )
  }

  eliminarTareaPy(data: any) {

    const dataPost = {
      controlador: 'ProgramarController',
      metodo: 'eliminarTareaPy',
      id_cron: data.id_cron
    }
    this.cors.post(dataPost).subscribe(
      (res: any) => {
        if(res.status && this.textoBtn === 'Actualizar') {
          this.insertarTareaCron(data);
        } 
        
        if(res.status && this.textoBtn != 'Actualizar') {
          this.showMessage('success', 'Correcto', 'Se ha eliminado la tarea exitosamente');
          this.obtenerTareas();
        }

        if(!res.status) {
          this.showMessage('error', 'Error', 'Ocurrió un error, contacta al administrador');
      
        }
      },
      (err: any) =>{
        // console.log(err)
        this.showMessage('error', 'Error', 'Ocurrió un error, contacta al administrador');
      }
    )
  }


  editarTarea(data: any) {
    this.textoBtn = 'Actualizar';
    let expresion = data.expresion;
    this.id_cron = data.id_cron;

    let expresionArray = expresion.split(' ')

    let min = expresionArray[0];
    let hora = expresionArray[1];
    let dia = expresionArray[4];


    if(min.includes('/')) {
      let minArray = min.split('/');
      min = minArray[1];
      hora = null;
    }

    if(hora != null) {
      if(hora.includes('/')) {
        let horaArray = hora.split('/');
        hora = horaArray[1];
        min = null;
      }
    }

    if(dia.includes(',')) {
      let diasArray = dia.split(',');
      dia = [];

      diasArray.forEach((element: any) => {
       dia.push(this.dias[element])
      })
    } else {
      dia = [];
      dia.push(this.dias[expresionArray[4]])
    }

    this.horaElegida = this.horas[hora];
    this.minutosElegidos = this.minutos[min];
    this.diasElegidos = dia;

    this.seleccionando();

  }

  actualizarStatusTabla(data: any) {
    let array = data.split(',');
    if(this.tableData.length > 0) {
      this.tableData.forEach( (data: any) => {
        if(data.id_cron === array[1]) {
          // console.log(data.status)
          this.zone.run( () => {
            data.status = array[0];
            // console.log(data.status)
            data.progreso = this.progresos[array[0]];
  
            if(array[0] === 'Finalizado') {
              this.obtenerUltimaEjecucion(data)
            }
          } )
        }
      } )
    }
  }

  obtenerUltimaEjecucion(dataB: any) {

    const data = {
      controlador: 'ProgramarController',
      metodo: 'obtenerEjecucion',
      id_cron: dataB.id_cron
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.zone.run( () => {
            dataB.ultima_ejecucion = res.data.ultima_ejecucion;
          } )
        }
      },
      (err: any) => {
        // console.log(err)
      }
    )
  }

  enfocarCalendario() {
    if (this.myCalendar) {

        this.myCalendar.inputfieldViewChild?.nativeElement.focus(); // Enfoca el p-calendar

      this.desenfocarCalendario()

    } else {
      console.error('No se pudo enfocar el p-calendar: referencia no encontrada.');
    }
  }

  desenfocarCalendario() {
    if (this.myCalendar) {
      this.myCalendar.inputfieldViewChild?.nativeElement.blur();  // Desenfoca el p-calendar
      this.ocultarCalendario()
    } else {
      console.error('No se pudo desenfocar el p-calendar: referencia no encontrada.');
    }
  }

  ocultarCalendario() {
    if (this.myCalendar) {
      this.myCalendar.hideOverlay();  // Oculta el calendario
    } else {
      console.error('No se pudo ocultar el calendario: referencia no encontrada.');
    }
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
    // severity = logo, summary = Encaebzado, detail = Mensaje
  }

  muestraAlerta(mensaje: string, confirmarBtn: string, altBtn: string, fn: (...args: any[]) => void, ...args: any[]) {
    Swal.fire({
      title: `${mensaje}`,
      showDenyButton: true,
      confirmButtonText: `${confirmarBtn}`,
      confirmButtonColor: "#e896fc",
      denyButtonText: `${altBtn}`,
      denyButtonColor: "#fcc404",
      customClass: {
        confirmButton: 'swal-custom-button',
        denyButton: 'swal-custom-button',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        fn(...args);
      }
    });
  }

  conectaPy() {
    const client_id = 'mm1';
    this.eventSource = new EventSource(`http://192.168.51.210:3030/notifications?client_id=${client_id}`);
    this.eventSource.onmessage = (event) => {
        // console.log(event.data)
        if(event.data != 'off') {
          this.zone.run(() => {
            this.actualizarStatusTabla(event.data)
         });
        } 
    }
  }

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
      // // console.log('Modo oscuro cambiado:', this.mode);
    });
  }

  sweetAlert(icon: SweetAlertIcon | undefined, title: string | undefined) {
    Swal.fire({
      position: 'center',
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 3000
    });
  }
}
