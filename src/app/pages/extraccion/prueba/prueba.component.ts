import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
moment.lang('es');
import { Message, MessageService,ConfirmationService,ConfirmEventType } from 'primeng/api';
import { CorsService } from '@services';
import { Table } from 'primeng/table';

import { HttpClient, HttpHeaders } from '@angular/common/http';

/* Peticiones cron */
import { CronService } from 'app/_services/cron.service';

import { nanoid } from 'nanoid';
import * as XLSX from 'xlsx';
import { PrimeNGConfig } from 'primeng/api';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(es);

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class PruebaComponent implements OnInit {
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  tipoExtraccion:string[]=[
    'Casos de negocio',
    'Actividades',
    'Ordenes de servicio',
  ]; 
  ExcelData:any=[];
  formExtraccion:UntypedFormGroup;
  spinner:boolean=false;
  datosExtraccion:any[]=[];
  datosExtraccion2:any[]=[];
  loading: boolean = false
  show:boolean=false;
  url1:any;
  archivoSeleccionado:string="";
	loading2:boolean=false;
  modal:boolean=false;
  horaEdit:any;
  minutoEdit:any;
  diaSemanaEdit:any;
  Edit:any;
  id:string="";
  horas:any[]=[
    {
      label:"00:00:00",
      value:0
    },
    {
      label:"01:00:00",
      value:1
    },
    {
      label:"02:00:00",
      value:2
    },
    {
      label:"03:00:00",
      value:3
    },
    {
      label:"04:00:00",
      value:4
    },
    {
      label:"05:00:00",
      value:5
    },
    {
      label:"06:00:00",
      value:6
    },
    {
      label:"07:00:00",
      value:7
    },
    {
      label:"08:00:00",
      value:8
    },
    {
      label:"09:00:00",
      value:9
    },
    {
      label:"10:00:00",
      value:10
    },
    {
      label:"11:00:00",
      value:11
    },
    {
      label:"12:00:00",
      value:12
    },
    {
      label:"13:00:00",
      value:13
    },
    {
      label:"14:00:00",
      value:14
    },
    {
      label:"15:00:00",
      value:15
    },
    {
      label:"16:00:00",
      value:16
    },
    {
      label:"17:00:00",
      value:17
    },
    {
      label:"18:00:00",
      value:18
    },
    {
      label:"19:00:00",
      value:19
    },
    {
      label:"20:00:00",
      value:20
    },
    {
      label:"21:00:00",
      value:21
    },
    {
      label:"22:00:00",
      value:22
    },
    {
      label:"23:00:00",
      value:23
    },
  ];
  min:any[]=[];
  categories: any[] = [
    { name: 'Dias del Mes', key: 'DM' },
    { name: 'Dias de la Semana', key: 'DS' },
  ];
  diasemanas:any[]=[
    {
      label:"Domingo",
      value:1
    },
    {
      label:"Lunes",
      value:2
    },
    {
      label:"Martes",
      value:3
    },
    {
      label:"Miercoles",
      value:4
    },
    {
      label:"Jueves",
      value:5
    },
    {
      label:"Viernes",
      value:6
    },
    {
      label:"Sabado",
      value:7
    },
  ];
  h="";
  m="";
  d="";
  mo:any[]=[];
  submo:any[]=[];
  solu:any[]=[];
  moClien:any[]=[];
  catego:any[]=[];
  filterCat:any[]=[];
  filterMotivo:any[]=[];
  filterSub:any[]=[];
  filterSol:any[]=[];
  filterMotivoCli:any[]=[];
  tipoOrOS:any=[];
  estadoOS:any=[];
  tipoAct:any=[];
  areaAct:any=[];
  estadoAct:any=[];
  filtertipoOrOS:any=[];
  filterestadoOS:any=[];
  filtertipoAct:any=[];
  filterareaAct:any=[];
  filterestadoAct:any=[];
  fechaAperturaMin:any = null;
  fechaAperturaMax:any=null;
  disabledDates:any=[];
  fechaAsignacionMin:any = null;
  fechaAsignacionMax:any=null;
  disabledDatesfechaAsignacion:any=[];
  fechaVencimientoMin:any = null;
  fechaVencimientoMax:any=null;
  disabledDatesfechaVencimiento:any=[];
  fechaCreacionMin:any = null;
  fechaCreacionMax:any=null;
  disabledDatesfechaCreacion:any=[];
  fechaOrdenMin:any = null;
  fechaOrdenMax:any=null;
  disabledDatesfechaOrden:any=[];

  fechaAperturaMinEdit:any = null;
  fechaAperturaMaxEdit:any=null;
  disabledDatesEdit:any=[];
  fechaAsignacionMinEdit:any = null;
  fechaAsignacionMaxEdit:any=null;
  disabledDatesfechaAsignacionEdit:any=[];
  fechaVencimientoMinEdit:any = null;
  fechaVencimientoMaxEdit:any=null;
  disabledDatesfechaVencimientoEdit:any=[];
  fechaCreacionMinEdit:any = null;
  fechaCreacionMaxEdit:any=null;
  disabledDatesfechaCreacionEdit:any=[];
  fechaOrdenMinEdit:any = null;
  fechaOrdenMaxEdit:any=null;
  disabledDatesfechaOrdenEdit:any=[];

  editForm:any={
    "id": "",
    "cve_usuario": ``,
    "tipoExtraccion":``,
    "fechaCompletado": "",
    "status": "",
    "ip": "",
    "parametrosExtraccion":"",
    "procesando": "",
    "fechaExtraccion": "",
    "archivo": "",
    "horaProgramacion": "",
    "nombreCron":``,
    "scheduleExpression":"",
    "tipoProgramacion":"",
    "correo":"",
    "medioExtraccion":"",
    "hora":"",
    "minuto":"",
    "diaSemana":"",

  };
  // mo:string[]=[
  //   'ACLARACION DE ESTADO DE CUENTA',
  //   'AL COLGAR SE REGRESA LLAMADA',
  //   'ALT APROVISIONAMIENTO I',
  //   'ALT APROVISIONAMIENTO T',
  //   'ALT SOPORTE I',
  //   'ALT SOPORTE T',
  //   'AMPLIACION DE RED',
  //   'APLICACIONES',
  //   'APROVISIONAMIENTO LEGOS',
  //   'APROVISIONAMIENTO ONTLEGOS',
  //   'APROVISIONAMIENTO Y SISTEMAS I', 
  //   'APROVISIONAMIENTO Y SISTEMAS T',
  //   'ASISTENCIA CALL CENTER',
  //   'ASISTENCIA DR WIFI',
  //   'ATENCION A INCONSISTENCIAS',
  //   'ATENCION A SOLUCION EXPRESS',
  //   'BENEFIZZIOS',
  //   'BURO DE CREDITO',
  //   'CAJERO AUTOMATICO',
  //   'CAMBIO D DOMICILIO INTERCIUDAD',
  //   'CAMBIO DE ACCESORIOS CR',
  //   'CAMBIO DE ACCESORIOS E',
  //   'CAMBIO DE DOMICILIO',
  //   'CAMBIO DE DROP TELECABLE',
  //   'CAMBIO DE EQUIPO',
  //   'CANCELACION DE SERVICIO',
  //   'CAPTURA DE VENTA',
  //   'CHAT',
  //   'COBERTURA',
  //   'COLLECTION ANALOGO',
  //   'COMPLEMENTO',
  //   'CONFIG CM / EMTA',
  //   'CONFIG CM / EMTA / ONT',
  //   'CONFIG EMTA / ONT /SOP DISPOSITIVO',
  //   'CONFIG EMTA/SOP DISPOSITIVO',
  //   'CONFIG FUNCIONES INTERACTIVAS',
  //   'CONFIRMACION',
  //   'CORRECCION DE ORDEN',
  //   'CUENTA EN REVISION',
  //   'CUENTAS CONCENTRADAS AXTEL',
  //   'DEGRADACION',
  //   'ECONOMICO',
  //   'ENCUESTA REGULAR',
  //   'FACTURACION',
  //   'FALLA SERVICIOS DIGITALES',
  //   'FALLAS TECNICAS',
  //   'GESTION DE CAMPAÑAS',
  //   'GESTION DE RECUPERACION',
  //   'GESTORIA DE COBRANZA',
  //   'HEAVY USER',
  //   'INBOUND',
  //   'INCONFORMIDAD IFT',
  //   'INCONSISTENCIA DETECTADA S',
  //   'INFO DE PROGRAMACION',
  //   'INFO DEL PRODUCTO',
  //   'INFO GENERAL',
  //   'INFO GENERAL DEL PRODUCTO',
  //   'INFO GENERAL DEL SERV',
  //   'INFO SERV INTERNET',
  //   'INFO SERV TELEFONIA',
  //   'INTERNET VOLTE',
  //   'IVR',
  //   'izzi mx',
  //   'LINEA IZZI APP',
  //   'MAIL',
  //   'MALA CALIDAD DE VOZ',
  //   'MALA CALIDAD EN AUDIO',
  //   'MALA CALIDAD EN VIDEO',
  //   'MALA CALIDAD TV EN VIVO',
  //   'MIGRACION HOTEL',
  //   'MOD AL CONTRATO',
  //   'NAVEGACION LENTA',
  //   'NEGOCIO',
  //   'NEGOCIO NR',
  //   'NETFLIX',
  //   'NO RECIBE O TERMINA LLAMADAS',
  //   'ORDEN CON ERROR',
  //   'OUTBOUND',
  //   'OUTBOUND GN',
  //   'OUTBOUND T',
  //   'PANTALLA EN NEGRO',
  //   'POST VENTA BESTEL',
  //   'PRECONCILIACION PROFECO',
  //   'PROB CON GUIA',
  //   'PROB DE APPS EN DECO',
  //   'PROB DE AUDIO TV EN VIVO',
  //   'PROB EN CONTROL REMOTO',
  //   'PROB EN DECODIFICADOR',
  //   'PROB SERVICIO VOD',
  //   'PROBLEMAS CON AUDIO',
  //   'PROBLEMAS DE CONTENIDO',
  //   'PRODUCTO/COMPETENCIA',
  //   'PROMOCION ACTIVOS',
  //   'PROMOCION INACTIVOS',
  //   'QUEJAS',
  //   'QUEJAS POR MAL SERVICIO',
  //   'QUEJAS PROFECO',
  //   'REACTIVACION RETENCION',
  //   'REALIZA CONTRATACION',
  //   'RECLAMOS',
  //   'REVISION DE VENTA',
  //   'SE CORTA LLAMADA',
  //   'SEGUIMIENTO NOT_ DONE',
  //   'SEGUIMIENTOS ESPECIALES',
  //   'SEGUIMIENTOS ESPECIALES CODI',
  //   'SIN NAVEGACION',
  //   'SIN SEÑAL',
  //   'SIN SEÑAL TV EN VIVO',
  //   'SIN SEÑAL UNO O MAS CANALES',
  //   'SIN SERVICIO',
  //   'SIN TONO/PERDIDA CONSTANTE',
  //   'SOLICITUD DE SOPORTE MA',
  //   'SOPORTE PPV / IPPV',
  //   'SOPORTE PYME',
  //   'SUC ACLARACION-EDO DE CTA',
  //   'SUSPENSION DEL SERVICIO',
  //   'SUSPENSION TEMPORAL',
  //   'TRAFICO NO TERMINADO',
  //   'TRANSFERENCIA',
  //   'VENTA EN SOLUCIONES',
  //   'VENTA NO INGRESADA',
  //   'VENTA NUEVA',
  //   'VENTA RECHAZADA',
  //   'VIDEO',
  //   'VISITAS TECNICAS',
  //   'WIFI HOME'
  // ];


  constructor(private formBuilder: UntypedFormBuilder,
    private router:Router,private messageService: MessageService,
    private cors: CorsService, private http: HttpClient, 
    private cron: CronService,private httpClient: HttpClient,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig
    ) {
    this.formExtraccion = this.formBuilder.group({
      tipoExtraccion: [null, Validators.required],

      estado: [null],
      tipo: [null],
      subtipo: [null],
      canalIngreso: [null],
      
      fechaApertura:[null],
      cuenta: [null],
      medioContacto: [null],
      casoNegocio: [null],
      categoria: [null],
      motivo: [null],
      subMotivo: [null],
      solucion: [null],
      motivoCliente: [null],

      areaConocimiento: [null],
      fechaAsignacion: [null],
      vencimientoActividad: [null],
      fechaCreacion: [null],
      
      compania: [null],
      telefonos: [null],
      numOrden: [null],
      tipoOrden: [null],
      fechaOrden: [null],
      
      numPago: [null],
      fechaPago: [null],
      importe: [null],
      formaPago: [null],
      ultimaActualizacion: [null],
      
      vencimiento: [null],
      FallaGeneralAsociada: [null],
      tecnologia: [null],
      hub: [null],
      rama: [null],
      nodo: [null],
      fiberDeep: [null],
      fechaInicio: [null],
      nombreHub: [null],
      Incidente: [null],

      horaProgramacion:[null],

      hora:[null],
      minuto:[null,Validators.required],
      diasSemana:[null,Validators.required],

      tipoProgramacion:[false],
      correo:[null],
      medioExtraccion:[false],

    });

    for(let i=0;i<60;i++){
      let a=null;
      if(i<10){
         a = {
          label:`00:0${i}:00`,
          value:i
        }
      }else{
        a = {
          label:`00:${i}:00`,
          value:i
        }
      }
      this.min.push(a);
    }
    this.cors.get('Reporte/getMostrarCatalogoExtraccionAutomatizadasCategoria').then((response) => {
      // // console.log(response)
      this.catego=response;
    }).catch((error) => {
      // console.log(error)
    })

    this.cors.get('Reporte/getMostrarCatalogoExtraccionAutomatizadasOSACT').then((response) => {
      // // console.log(response[0])
      this.estadoOS=response[0].estadoOS;
      this.tipoOrOS=response[0].tipoOrden;
      this.tipoAct=response[0].tipo;
      this.areaAct=response[0].area;
      this.estadoAct=response[0].estadoAct;
    }).catch((error) => {
      // console.log(error)
    })
    this.primengConfig.setTranslation({
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Limpiar'
    });

  }

  ngOnInit(): void {
    this.tablaExtraccion();
    this.tablaExtraccion2();
    setInterval(() => {
      this.tablaExtraccion();
      this.tablaExtraccion2();
    }, 5000);
  }


  reset(){
    this.formExtraccion.reset()
    this.d="";
    this.h="";
    this.m="";
  }

  Enviar(){
    this.formExtraccion.markAllAsTouched();
    // // console.log(this.formExtraccion)
    if(this.formExtraccion.valid){
      this.spinner = true;
      const randomId = nanoid();
      let data ={
        "id": 0,
        "cve_usuario": `${this.usuario.email}`,
        "tipoExtraccion":`${this.formExtraccion.controls['tipoExtraccion'].value}`,
        "fechaCompletado": null,
        "status": "",
        "ip": "",
        "parametrosExtraccion":"",
        "procesando": "",
        "fechaExtraccion": null,
        "archivo": "",
        "horaProgramacion": "",
        "nombreCron":`${this.formExtraccion.controls['tipoExtraccion'].value}_${randomId}`,
        "scheduleExpression":"",
        "tipoProgramacion":`${this.formExtraccion.controls['tipoProgramacion'].value == true ? "1":"0"}`,
        "correo":`${this.formExtraccion.controls['correo'].value }`,
        "medioExtraccion":`${this.formExtraccion.controls['medioExtraccion'].value }`,
      };
      if(this.formExtraccion.controls['tipoExtraccion'].value === "Cuenta"){
        // // console.log("Esto es Cuenta")
        // data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value}","tipo":"${this.formExtraccion.controls['tipo'].value}","subtipo":"${this.formExtraccion.controls['subtipo'].value}","canalIngreso":"${this.formExtraccion.controls['canalIngreso'].value}"}]`;
        data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","tipo":"${this.formExtraccion.controls['tipo'].value ? this.formExtraccion.controls['tipo'].value :""}","subtipo":"${this.formExtraccion.controls['subtipo'].value ? this.formExtraccion.controls['subtipo'].value :""}","canalIngreso":"${this.formExtraccion.controls['canalIngreso'].value ? this.formExtraccion.controls['canalIngreso'].value : ""}"}]`;
        
        // var myObject = JSON.parse(data.parametrosExtraccion);
        // // console.log(myObject)
      }else if(this.formExtraccion.controls['tipoExtraccion'].value === "Casos de negocio"){
        // // console.log("Casos de negocio")
        data.parametrosExtraccion =`[{"fechaApertura":">='${this.formExtraccion.controls['fechaApertura'].value ? this.dateFormat(this.formExtraccion.controls['fechaApertura'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['fechaApertura'].value ? this.dateFormat(this.formExtraccion.controls['fechaApertura'].value[1]):"null"}'","estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","cuenta":"${this.formExtraccion.controls['cuenta'].value ? this.formExtraccion.controls['cuenta'].value :""}","medioContacto":"${this.formExtraccion.controls['medioContacto'].value ? this.formExtraccion.controls['medioContacto'].value :""}","casoNegocio":"${this.formExtraccion.controls['casoNegocio'].value ? this.formExtraccion.controls['casoNegocio'].value :""}","categoria":"${this.formExtraccion.controls['categoria'].value ? this.formExtraccion.controls['categoria'].value :""}","motivo":"${this.formExtraccion.controls['motivo'].value ? this.formExtraccion.controls['motivo'].value:""}","subMotivo":"${this.formExtraccion.controls['subMotivo'].value ? this.formExtraccion.controls['subMotivo'].value :""}","solucion":"${this.formExtraccion.controls['solucion'].value ? this.formExtraccion.controls['solucion'].value :""}","motivoCliente":"${this.formExtraccion.controls['motivoCliente'].value ? this.formExtraccion.controls['motivoCliente'].value :""}"}]`;
      }else if(this.formExtraccion.controls['tipoExtraccion'].value === "Actividades"){
        // // console.log("Actividades")
        data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","areaConocimiento":"${this.formExtraccion.controls['areaConocimiento'].value ? this.formExtraccion.controls['areaConocimiento'].value :""}","fechaAsignacion":">='${this.formExtraccion.controls['fechaAsignacion'].value ? this.dateFormat(this.formExtraccion.controls['fechaAsignacion'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['fechaAsignacion'].value ? this.dateFormat(this.formExtraccion.controls['fechaAsignacion'].value[1]):"null"}'","tipo":"${this.formExtraccion.controls['tipo'].value ? this.formExtraccion.controls['tipo'].value : ""}","vencimientoActividad":">='${this.formExtraccion.controls['vencimientoActividad'].value ? this.dateFormat(this.formExtraccion.controls['vencimientoActividad'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['vencimientoActividad'].value ? this.dateFormat(this.formExtraccion.controls['vencimientoActividad'].value[1]):"null"}'","fechaCreacion":">='${this.formExtraccion.controls['fechaCreacion'].value ? this.dateFormat(this.formExtraccion.controls['fechaCreacion'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['fechaCreacion'].value ? this.dateFormat(this.formExtraccion.controls['fechaCreacion'].value[1]):"null"}'"}]`;
        
      }else if(this.formExtraccion.controls['tipoExtraccion'].value === "Ordenes de servicio"){
        // // console.log("Ordenes de servicio")
        // data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","rpt":"${this.formExtraccion.controls['rpt'].value}","tipoOrden":"${this.formExtraccion.controls['tipoOrden'].value}","motivo":"${this.formExtraccion.controls['motivo'].value}","asignada":"${this.formExtraccion.controls['asignada'].value}"}]`;
        data.parametrosExtraccion =`[{"cuenta":"${this.formExtraccion.controls['cuenta'].value ? this.formExtraccion.controls['cuenta'].value : ""}","compania":"${this.formExtraccion.controls['compania'].value ? this.formExtraccion.controls['compania'].value :""}","telefonos":"${this.formExtraccion.controls['telefonos'].value ? this.formExtraccion.controls['telefonos'].value :""}","numOrden":"${this.formExtraccion.controls['numOrden'].value ? this.formExtraccion.controls['numOrden'].value :""}","tipoOrden":"${this.formExtraccion.controls['tipoOrden'].value ? this.formExtraccion.controls['tipoOrden'].value :""}","fechaOrden":">='${this.formExtraccion.controls['fechaOrden'].value ? this.dateFormat(this.formExtraccion.controls['fechaOrden'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['fechaOrden'].value ? this.dateFormat(this.formExtraccion.controls['fechaOrden'].value[1]):"null"}'","estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value :""}"}]`;
      }else if(this.formExtraccion.controls['tipoExtraccion'].value === "Pagos"){
        // // console.log("Ordenes de servicio")
        // data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","rpt":"${this.formExtraccion.controls['rpt'].value}","tipoOrden":"${this.formExtraccion.controls['tipoOrden'].value}","motivo":"${this.formExtraccion.controls['motivo'].value}","asignada":"${this.formExtraccion.controls['asignada'].value}"}]`;
        data.parametrosExtraccion =`[{"numPago":"${this.formExtraccion.controls['numPago'].value ? this.formExtraccion.controls['numPago'].value : ""}","fechaPago":"${this.formExtraccion.controls['fechaPago'].value ? this.dateFormat(this.formExtraccion.controls['fechaPago'].value) :""}","importe":"${this.formExtraccion.controls['importe'].value ? this.formExtraccion.controls['importe'].value :""}","fechaPago":">='${this.formExtraccion.controls['fechaPago'].value ? this.dateFormatDate(this.formExtraccion.controls['fechaPago'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['fechaPago'].value ? this.dateFormatDate(this.formExtraccion.controls['fechaPago'].value[1]):"null"}'","estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value :""}","ultimaActualizacion":">='${this.formExtraccion.controls['ultimaActualizacion'].value ? this.dateFormatDate(this.formExtraccion.controls['ultimaActualizacion'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['ultimaActualizacion'].value ? this.dateFormatDate(this.formExtraccion.controls['ultimaActualizacion'].value[1]):"null"}'",}]`;
      }
      // else if(this.formExtraccion.controls['tipoExtraccion'].value === "Fallas generales"){
      //   // // console.log("Ordenes de servicio")
      //   // data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","rpt":"${this.formExtraccion.controls['rpt'].value}","tipoOrden":"${this.formExtraccion.controls['tipoOrden'].value}","motivo":"${this.formExtraccion.controls['motivo'].value}","asignada":"${this.formExtraccion.controls['asignada'].value}"}]`;
      //   data.parametrosExtraccion =`[{"vencimiento":"${this.formExtraccion.controls['vencimiento'].value ? this.formExtraccion.controls['vencimiento'].value : ""}","FallaGeneralAsociada":"${this.formExtraccion.controls['FallaGeneralAsociada'].value ? this.formExtraccion.controls['FallaGeneralAsociada'].value :""}","categoria":"${this.formExtraccion.controls['categoria'].value ? this.formExtraccion.controls['categoria'].value :""}","motivo":"${this.formExtraccion.controls['motivo'].value ? this.formExtraccion.controls['motivo'].value :""}","subMotivo":"${this.formExtraccion.controls['subMotivo'].value ? this.formExtraccion.controls['subMotivo'].value :""}","solucion":"${this.formExtraccion.controls['solucion'].value ? this.formExtraccion.controls['solucion'].value:""}","tecnologia":"${this.formExtraccion.controls['tecnologia'].value ? this.formExtraccion.controls['tecnologia'].value:""}","estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value:""}","hub":"${this.formExtraccion.controls['hub'].value ? this.formExtraccion.controls['hub'].value:""}","rama":"${this.formExtraccion.controls['rama'].value ? this.formExtraccion.controls['rama'].value:""}","nodo":"${this.formExtraccion.controls['nodo'].value ? this.formExtraccion.controls['nodo'].value:""}","fiberDeep":"${this.formExtraccion.controls['fiberDeep'].value ? this.formExtraccion.controls['fiberDeep'].value:""}","fechaInicio":"${this.formExtraccion.controls['fechaInicio'].value ? this.dateFormat(this.formExtraccion.controls['fechaInicio'].value):""}","nombreHub":"${this.formExtraccion.controls['nombreHub'].value ? this.formExtraccion.controls['nombreHub'].value:""}","Incidente":"${this.formExtraccion.controls['Incidente'].value ? this.formExtraccion.controls['Incidente'].value:""}","numOrden":"${this.formExtraccion.controls['numOrden'].value ? this.formExtraccion.controls['numOrden'].value:""}"}]`;
      // }
      // // console.log(data)
      let regexCron=null;
      let horas =null;
      let minuto = null;
      let diasS=null;
      if(this.formExtraccion.controls['hora'].value && this.formExtraccion.controls['hora'].value.length>0 && this.formExtraccion.controls['hora'].value.length<=23){
        horas=this.formExtraccion.controls['hora'].value.join(',');
      }else if(this.formExtraccion.controls['hora'].value && this.formExtraccion.controls['hora'].value.length == 24){
        horas="*";
      }
      if(this.formExtraccion.controls['minuto'].value != null){
        minuto=this.formExtraccion.controls['minuto'].value;
      }
      if(this.formExtraccion.controls['diasSemana'].value && this.formExtraccion.controls['diasSemana'].value.length >0 && this.formExtraccion.controls['diasSemana'].value.length <=6){
        diasS = this.formExtraccion.controls['diasSemana'].value.join(',');
      }else if(this.formExtraccion.controls['diasSemana'].value && this.formExtraccion.controls['diasSemana'].value.length == 7){
        diasS ="*";
      }
  
      if(this.formExtraccion.controls['hora'].value==null || this.formExtraccion.controls['hora'].value.length ==0){
        regexCron = `0 0/${minuto} * ? * ${diasS}`;
        
      }else{
        
        regexCron = `0 ${minuto} ${horas?horas:"*"} ? * ${diasS}`;
      }
      data.scheduleExpression=regexCron;
      data.horaProgramacion = this.getTexto();
      
      data.procesando="0";
      data.status="Pendiente";
      // // console.log(data)
      this.cors.post('Reporte/GuardarFormularioEjecucionExtraccionAutomatizadosPrueba',data)
      .then((response) => {
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Exito!!!',
          detail: 'Datos guardados',
        });

        this.cors.post('Reporte/agregarNuevoCron',data)
        .then((response) => {
          // console.log(response)
          })
          .catch((error) => {
            // console.log(error)
            this.messageService.add({
              key:'tst',
              severity: 'error',
              summary: 'No se logro guardar el Cron',
              detail: 'Intenta Nuevamente!!!',
            });
          });

      })
      .catch((error) => {
        // console.log("Este es el error",error)
        if(error.error=='An error occurred while saving the entity changes. See the inner exception for details.'){
          this.messageService.add({
            key:'tst',
            severity: 'error',
            summary: 'Ya existe este registro!!',
            detail: 'Intenta Nuevamente!!!',
          });
          return
        }

        this.messageService.add({
          key:'tst',
          severity: 'error',
          summary: 'No se logro guardar',
          detail: 'Intenta Nuevamente!!!',
        });
      });

      
    }else{
      
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'Faltaron campos por rellenar!',
        detail: 'Intenta Nuevamente!!!',
      });
      
    }
    setTimeout(() => {
      this.reset()
      this.spinner = false;
      this.tablaExtraccion();
      this.reset()

      
    }, 3000);

    
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  clearValidators(){
    this.formExtraccion.controls['estado'].reset();
    this.formExtraccion.controls['tipo'].reset();
    this.formExtraccion.controls['subtipo'].reset();
    this.formExtraccion.controls['canalIngreso'].reset();
    // this.formExtraccion.controls['numCaso'].reset();
    this.formExtraccion.controls['cuenta'].reset();
    this.formExtraccion.controls['categoria'].reset();
    this.formExtraccion.controls['motivo'].reset();
    this.formExtraccion.controls['subMotivo'].reset();
    this.formExtraccion.controls['solucion'].reset();
    this.formExtraccion.controls['areaConocimiento'].reset();
    this.formExtraccion.controls['fechaAsignacion'].reset();
    this.formExtraccion.controls['fechaApertura'].reset();
    this.formExtraccion.controls['vencimientoActividad'].reset();
    this.formExtraccion.controls['fechaCreacion'].reset();
    this.formExtraccion.controls['fechaOrden'].reset();
    // this.formExtraccion.controls['rpt'].reset();
    this.formExtraccion.controls['tipoOrden'].reset();
    // this.formExtraccion.controls['asignada'].reset();
    this.formExtraccion.controls['horaProgramacion'].reset();
    this.formExtraccion.controls['correo'].reset();
    this.formExtraccion.controls['medioContacto'].reset();
    this.formExtraccion.controls['casoNegocio'].reset();
    this.formExtraccion.controls['motivoCliente'].reset();
    this.formExtraccion.controls['compania'].reset();
    this.formExtraccion.controls['telefonos'].reset();
    this.formExtraccion.controls['numOrden'].reset();
    // // this.formExtraccion.controls['tipoProgramacion'].reset();
    // this.formExtraccion.controls['tipoProgramacion'].patchValue(false);
    // this.formExtraccion.controls['medioExtraccion'].patchValue(false);

    this.formExtraccion.get('estado')?.clearValidators();
    this.formExtraccion.get('estado')?.updateValueAndValidity();
    this.formExtraccion.get('tipo')?.clearValidators();
    this.formExtraccion.get('tipo')?.updateValueAndValidity();
    this.formExtraccion.get('subtipo')?.clearValidators();
    this.formExtraccion.get('subtipo')?.updateValueAndValidity();
    this.formExtraccion.get('canalIngreso')?.clearValidators();
    this.formExtraccion.get('canalIngreso')?.updateValueAndValidity();
    this.formExtraccion.get('numCaso')?.clearValidators();
    this.formExtraccion.get('numCaso')?.updateValueAndValidity();
    this.formExtraccion.get('cuenta')?.clearValidators();
    this.formExtraccion.get('cuenta')?.updateValueAndValidity();
    this.formExtraccion.get('categoria')?.clearValidators();
    this.formExtraccion.get('categoria')?.updateValueAndValidity();
    this.formExtraccion.get('motivo')?.clearValidators();
    this.formExtraccion.get('motivo')?.updateValueAndValidity();
    this.formExtraccion.get('subMotivo')?.clearValidators();
    this.formExtraccion.get('subMotivo')?.updateValueAndValidity();
    this.formExtraccion.get('solucion')?.clearValidators();
    this.formExtraccion.get('solucion')?.updateValueAndValidity();
    this.formExtraccion.get('areaConocimiento')?.clearValidators();
    this.formExtraccion.get('areaConocimiento')?.updateValueAndValidity();
    this.formExtraccion.get('fechaAsignacion')?.clearValidators();
    this.formExtraccion.get('fechaAsignacion')?.updateValueAndValidity();
    this.formExtraccion.get('rpt')?.clearValidators();
    this.formExtraccion.get('rpt')?.updateValueAndValidity();
    this.formExtraccion.get('tipoOrden')?.clearValidators();
    this.formExtraccion.get('tipoOrden')?.updateValueAndValidity();
    this.formExtraccion.get('asignada')?.clearValidators();
    this.formExtraccion.get('asignada')?.updateValueAndValidity();
    this.formExtraccion.get('horaProgramacion')?.clearValidators();
    this.formExtraccion.get('horaProgramacion')?.updateValueAndValidity();
    // this.formExtraccion.get('tipoProgramacion')?.clearValidators();
    // this.formExtraccion.get('tipoProgramacion')?.updateValueAndValidity();



  };

  cambioTipoExtraccion(event:any){
    this.clearValidators();
    // // console.log(event)
    // if(event ==="Cuenta"){
    //   this.formExtraccion.get('estado')?.setValidators([Validators.required]);
    //   this.formExtraccion.get('estado')?.updateValueAndValidity();
    //   this.formExtraccion.get('tipo')?.setValidators([Validators.required]);
    //   this.formExtraccion.get('tipo')?.updateValueAndValidity();
    //   this.formExtraccion.get('subtipo')?.setValidators([Validators.required]);
    //   this.formExtraccion.get('subtipo')?.updateValueAndValidity();
    //   this.formExtraccion.get('canalIngreso')?.setValidators([Validators.required]);
    //   this.formExtraccion.get('canalIngreso')?.updateValueAndValidity();
    // }else 
    if(event.value ==="Casos de negocio"){
      // this.formExtraccion.get('estado')?.setValidators([Validators.required]);
      // this.formExtraccion.get('estado')?.updateValueAndValidity();
      // this.formExtraccion.get('numCaso')?.setValidators([Validators.required]);
      // this.formExtraccion.get('numCaso')?.updateValueAndValidity();
      // this.formExtraccion.get('cuenta')?.setValidators([Validators.required]);
      // this.formExtraccion.get('cuenta')?.updateValueAndValidity();
      // this.formExtraccion.get('categoria')?.setValidators([Validators.required]);
      // this.formExtraccion.get('categoria')?.updateValueAndValidity();
      // this.formExtraccion.get('motivo')?.setValidators([Validators.required]);
      // this.formExtraccion.get('motivo')?.updateValueAndValidity();
      // this.formExtraccion.get('subMotivo')?.setValidators([Validators.required]);
      // this.formExtraccion.get('subMotivo')?.updateValueAndValidity();
      // this.formExtraccion.get('solucion')?.setValidators([Validators.required]);
      // this.formExtraccion.get('solucion')?.updateValueAndValidity();
      // this.formExtraccion.get('horaProgramacion')?.setValidators([Validators.required]);
      // this.formExtraccion.get('horaProgramacion')?.updateValueAndValidity();


    }else if(event.value ==="Actividades"){
      // this.formExtraccion.get('estado')?.setValidators([Validators.required]);
      // this.formExtraccion.get('estado')?.updateValueAndValidity();
      // this.formExtraccion.get('areaConocimiento')?.setValidators([Validators.required]);
      // this.formExtraccion.get('areaConocimiento')?.updateValueAndValidity();
      // this.formExtraccion.get('fechaAsignacion')?.setValidators([Validators.required]);
      // this.formExtraccion.get('fechaAsignacion')?.updateValueAndValidity();
      // this.formExtraccion.get('horaProgramacion')?.setValidators([Validators.required]);
      // this.formExtraccion.get('horaProgramacion')?.updateValueAndValidity();


    }else if(event.value ==="Ordenes de servicio"){
      // this.formExtraccion.get('motivo')?.setValidators([Validators.required]);
      // this.formExtraccion.get('motivo')?.updateValueAndValidity();
      // this.formExtraccion.get('rpt')?.setValidators([Validators.required]);
      // this.formExtraccion.get('rpt')?.updateValueAndValidity();
      // this.formExtraccion.get('tipoOrden')?.setValidators([Validators.required]);
      // this.formExtraccion.get('tipoOrden')?.updateValueAndValidity();
      // this.formExtraccion.get('asignada')?.setValidators([Validators.required]);
      // this.formExtraccion.get('asignada')?.updateValueAndValidity();
      // this.formExtraccion.get('estado')?.setValidators([Validators.required]);
      // this.formExtraccion.get('estado')?.updateValueAndValidity();
      // this.formExtraccion.get('horaProgramacion')?.setValidators([Validators.required]);
      // this.formExtraccion.get('horaProgramacion')?.updateValueAndValidity();


    }
  }
  dateFormat(value:any){
    // // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
      // return moment(value).format('DD/MM/yyyy')
    }else{
      return ""
    }
  }

  dateFormatDate(value:any){
    // // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy')
    }else{
      return ""
    }
  }

  dateFormat1(value:any){
    return moment(value).format('yyyy-MM-DDThh:mm:ss')
  }
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  capitalizarFirstLeter(item:any){
    return item.slice(0, 1).toUpperCase() + item.slice(1);
  }

  tablaExtraccion(){
    this.cors.get('Reporte/getmostrarTablaExtraccionAutomatizadosPrueba',{"usuario":this.usuario.email})
    .then((response) => {
      // // console.log(response)
      if(response[0] == "SIN INFO"){
        // this.messageService.add({
        //   key:'tst',
        //   severity: 'error',
        //   summary: 'No hay datos !!',
        //   detail: 'Intenta Nuevamente!!!',
        // });
      }else{
        // // console.log(response)
        for(let i = 0 ; i<response.length;i++){
          if(response[i].procesando && response[i].procesando=="1"){
            response[i].procesando="Si"
          }else{
            response[i].procesando="No"
          }
          if(response[i].parametrosExtraccion){
            let modifiedString;
            if(response[i].tipoExtraccion == "Casos de negocio"){
              modifiedString = response[i].parametrosExtraccion
              .replace(/"estado":"(.*?)",/g, (match:any, p1:any) => {
                // const modifiedestado = p1.replace(/"/g, '\\"'); //pone \ a los "" que sobran
                const modifiedestado = p1.replace(/"/g, "'");
                return `"estado":"${modifiedestado}",`;
              }).replace(/"cuenta":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcuenta = p1.replace(/"/g, "'");
                return `"cuenta":"${modifiedcuenta}",`;
              }).replace(/"medioContacto":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedmedioContacto = p1.replace(/"/g, "'");
                return `"medioContacto":"${modifiedmedioContacto}",`;
              }).replace(/"casoNegocio":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcasoNegocio = p1.replace(/"/g, "'");
                return `"casoNegocio":"${modifiedcasoNegocio}",`;
              }).replace(/"categoria":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcategoria = p1.replace(/"/g, "'");
                return `"categoria":"${modifiedcategoria}",`;
              }).replace(/"motivo":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedmotivo = p1.replace(/"/g, "'");
                return `"motivo":"${modifiedmotivo}",`; 
              }).replace(/"subMotivo":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedSubMotivo = p1.replace(/"/g, "'");
                return `"subMotivo":"${modifiedSubMotivo}",`;
              }).replace(/"solucion":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedSolucion = p1.replace(/"/g, "'");
                return `"solucion":"${modifiedSolucion}",`;
              }).replace(/"motivoCliente":"(.*?)(?=}])/g, (match:any, p1:any) => {
                const modifiedmotivoCliente = p1.replace(/"/g, "'");
                // // console.log(match)
                // // console.log(p1)
                return `"motivoCliente":"${modifiedmotivoCliente}"`;
              });
            }else if(response[i].tipoExtraccion == "Actividades"){
              modifiedString = response[i].parametrosExtraccion
              .replace(/"estado":"(.*?)",/g, (match:any, p1:any) => {
                // const modifiedestado = p1.replace(/"/g, '\\"'); //pone \ a los "" que sobran
                const modifiedestado = p1.replace(/"/g, "'");
                return `"estado":"${modifiedestado}",`;
              }).replace(/"areaConocimiento":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedareaConocimiento = p1.replace(/"/g, "'");
                return `"areaConocimiento":"${modifiedareaConocimiento}",`;
              }).replace(/"tipo":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedtipo = p1.replace(/"/g, "'");
                return `"tipo":"${modifiedtipo}",`;
              });
            }else if(response[i].tipoExtraccion == "Ordenes de servicio"){
              modifiedString = response[i].parametrosExtraccion
              .replace(/"cuenta":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcuenta = p1.replace(/"/g, "'");
                return `"cuenta":"${modifiedcuenta}",`;
              }).replace(/"compania":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcompania = p1.replace(/"/g, "'");
                return `"compania":"${modifiedcompania}",`;
              }).replace(/"telefonos":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedtelefonos = p1.replace(/"/g, "'");
                return `"telefonos":"${modifiedtelefonos}",`;
              }).replace(/"numOrden":"(.*?)",/g, (match:any, p1:any) => {
                const modifiednumOrden = p1.replace(/"/g, "'");
                return `"numOrden":"${modifiednumOrden}",`;
              }).replace(/"tipoOrden":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedtipoOrden = p1.replace(/"/g, "'");
                return `"tipoOrden":"${modifiedtipoOrden}",`; 
              }).replace(/"estado":"(.*?)(?=}])/g, (match:any, p1:any) => {
                const modifiedestado = p1.replace(/"/g, "'");
                return `"estado":"${modifiedestado}"`;
              });
            }
            // // console.log(modifiedString)    
            let jsonArray = JSON.parse(modifiedString);
            // // console.log(jsonArray)
            response[i].parametrosExtraccion = jsonArray;

          }
          let a ={
            medioExtraccion:`${response[i].medioExtraccion == "false" ? "Vista":"General"}`
          }
          response[i].parametrosExtraccion.push(a);
        }
        
        this.datosExtraccion = response;
        

      }
    })
    .catch((error) => {
      // console.log(error)
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'No se logro mostrar los datos',
        detail: 'Intenta Nuevamente!!!',
      });
    });
  }

  tablaExtraccion2(){
    this.cors.get('Reporte/getmostrarTablaExtraccionAutomatizados2Prueba',{})
    .then((response) => {
      // // console.log(response)
      if(response[0] == "SIN INFO"){
        // this.messageService.add({
        //   key:'tst',
        //   severity: 'error',
        //   summary: 'No hay datos !!',
        //   detail: 'Intenta Nuevamente!!!',
        // });
      }else{
        // for(let i = 0 ; i<response.length;i++){
        //   if(response[i].procesando && response[i].procesando=="1"){
        //     response[i].procesando="Si"
        //   }else{
        //     response[i].procesando="No"
        //   }
        //   const jsonArray = JSON.parse(response[i].parametrosExtraccion);
        //   response[i].parametrosExtraccion = jsonArray;
        // }
        for(let i = 0 ; i<response.length;i++){
          if(response[i].procesando && response[i].procesando=="1"){
            response[i].procesando="Si"
          }else{
            response[i].procesando="No"
          }
          if(response[i].parametrosExtraccion){
            let modifiedString;
            if(response[i].tipoExtraccion == "Casos de negocio"){
              modifiedString = response[i].parametrosExtraccion
              .replace(/"estado":"(.*?)",/g, (match:any, p1:any) => {
                // const modifiedestado = p1.replace(/"/g, '\\"'); //pone \ a los "" que sobran
                const modifiedestado = p1.replace(/"/g, "'");
                return `"estado":"${modifiedestado}",`;
              }).replace(/"cuenta":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcuenta = p1.replace(/"/g, "'");
                return `"cuenta":"${modifiedcuenta}",`;
              }).replace(/"medioContacto":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedmedioContacto = p1.replace(/"/g, "'");
                return `"medioContacto":"${modifiedmedioContacto}",`;
              }).replace(/"casoNegocio":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcasoNegocio = p1.replace(/"/g, "'");
                return `"casoNegocio":"${modifiedcasoNegocio}",`;
              }).replace(/"categoria":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcategoria = p1.replace(/"/g, "'");
                return `"categoria":"${modifiedcategoria}",`;
              }).replace(/"motivo":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedmotivo = p1.replace(/"/g, "'");
                return `"motivo":"${modifiedmotivo}",`; 
              }).replace(/"subMotivo":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedSubMotivo = p1.replace(/"/g, "'");
                return `"subMotivo":"${modifiedSubMotivo}",`;
              }).replace(/"solucion":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedSolucion = p1.replace(/"/g, "'");
                return `"solucion":"${modifiedSolucion}",`;
              }).replace(/"motivoCliente":"(.*?)(?=}])/g, (match:any, p1:any) => {
                const modifiedmotivoCliente = p1.replace(/"/g, "'");
                // // console.log(match)
                // // console.log(p1)
                return `"motivoCliente":"${modifiedmotivoCliente}"`;
              });
            }else if(response[i].tipoExtraccion == "Actividades"){
              modifiedString = response[i].parametrosExtraccion
              .replace(/"estado":"(.*?)",/g, (match:any, p1:any) => {
                // const modifiedestado = p1.replace(/"/g, '\\"'); //pone \ a los "" que sobran
                const modifiedestado = p1.replace(/"/g, "'");
                return `"estado":"${modifiedestado}",`;
              }).replace(/"areaConocimiento":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedareaConocimiento = p1.replace(/"/g, "'");
                return `"areaConocimiento":"${modifiedareaConocimiento}",`;
              }).replace(/"tipo":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedtipo = p1.replace(/"/g, "'");
                return `"tipo":"${modifiedtipo}",`;
              });
            }else if(response[i].tipoExtraccion == "Ordenes de servicio"){
              modifiedString = response[i].parametrosExtraccion
              .replace(/"cuenta":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcuenta = p1.replace(/"/g, "'");
                return `"cuenta":"${modifiedcuenta}",`;
              }).replace(/"compania":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedcompania = p1.replace(/"/g, "'");
                return `"compania":"${modifiedcompania}",`;
              }).replace(/"telefonos":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedtelefonos = p1.replace(/"/g, "'");
                return `"telefonos":"${modifiedtelefonos}",`;
              }).replace(/"numOrden":"(.*?)",/g, (match:any, p1:any) => {
                const modifiednumOrden = p1.replace(/"/g, "'");
                return `"numOrden":"${modifiednumOrden}",`;
              }).replace(/"tipoOrden":"(.*?)",/g, (match:any, p1:any) => {
                const modifiedtipoOrden = p1.replace(/"/g, "'");
                return `"tipoOrden":"${modifiedtipoOrden}",`; 
              }).replace(/"estado":"(.*?)(?=}])/g, (match:any, p1:any) => {
                const modifiedestado = p1.replace(/"/g, "'");
                return `"estado":"${modifiedestado}"`;
              });
            }
            // // console.log(modifiedString)    
            let jsonArray = JSON.parse(modifiedString);
            // // console.log(jsonArray)
            response[i].parametrosExtraccion = jsonArray;

          }
          let a ={
            medioExtraccion:`${response[i].medioExtraccion == "false" ? "Vista":"General"}`
          }
          response[i].parametrosExtraccion.push(a);

        }

        
        this.datosExtraccion2 = response;
      }
    })
    .catch((error) => {
      // console.log(error)
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'No se logro mostrar los datos',
        detail: 'Intenta Nuevamente!!!',
      });
    });
  }

  async descargarArchivo(archivo:string){
    this.archivoSeleccionado = archivo;
		this.loading2 = true;

    // this.cors.get1(`Reporte/BajarExtraccionExcelFTP`,{
    //   "nombre":archivo
    // })
    // .then((response) => {
    //   // // console.log(response)
    //   this.show = true;
    //   this.url1 = `https://rpabackizzi.azurewebsites.net/Reporte/BajarExtraccionExcelFTP?nombre=${archivo}`;

    //   setTimeout(()=> {
    //     this.loading2 = false;
    //     this.archivoSeleccionado = '';
    //     this.messageService.add({
    //       key:'tst',
    //       severity: 'success',
    //       summary: 'Se descargo el archivo',
    //       detail: 'Con exito!!',
    //       });
    //     }, 5000);
  
      
    // })
    // .catch((error) => {
    //   // console.log(error)
    //   this.messageService.add({
    //     key:'tst',
    //     severity: 'error',
    //     summary: 'No se logro descargar',
    //     detail: 'Intenta Nuevamente!!!',
    //   });
    //   this.loading2 = false;
    //   this.archivoSeleccionado = '';

    // });

    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        // Aquí agregamos los headers para evitar problemas de CORS
        'Access-Control-Allow-Origin': 'https://rpabackizzi.azurewebsites.net/', // Reemplaza con el dominio de tu frontend
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      });
      const response: any = await this.httpClient.get(`https://rpabackizzi.azurewebsites.net/Reporte/BajarExtraccionExcelFTP?nombre=${archivo}`, {
      headers:headers,  
      responseType: 'arraybuffer',
        observe: 'response'
      }).toPromise(); 
      // // console.log(response)
      const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');

      link.href= URL.createObjectURL(blob);
      link.download = `${archivo}`;
      link.click();
      
      URL.revokeObjectURL(link.href);
      link.innerHTML='';
      // this.messageService.add({ severity: 'info', summary: 'Generando', detail: 'Se ha generado el reporte' });
      setTimeout(()=> {
        this.loading2 = false;
        this.archivoSeleccionado = '';
        this.messageService.add({
          key:'tst',
          severity: 'success',
          summary: 'Se descargo el archivo',
          detail: 'Con exito!!',
          });
        }, 5000);

    } catch (error) {
      // console.log(error)
    }






    this.show=false;

  }

  estaSiendoDescargado(archivo: string): boolean {
		return this.archivoSeleccionado === archivo && this.loading2;
	}

  eliminar(item:any){
    // // console.log(item);



    this.cors.delete(`Reporte/EliminarEjecucionExtraccionAutomatizadosPrueba?id=${item.id}`,
      {
        "id": item.id,
        "tipoExtraccion": "string",
        "fechaExtraccion": "2023-08-03T23:49:10.217Z",
        "parametrosExtraccion": "string",
        "archivo": "string",
        "cve_usuario": "string",
        "fechaCompletado": "2023-08-03T23:49:10.217Z",
        "status": "string",
        "procesando": "string",
        "ip": "string",
        "horaProgramacion": "string"
      }
      )
    .then((response) => {
      let index = this.datosExtraccion.indexOf(item);
      if(index !== -1){
        this.datosExtraccion = this.datosExtraccion.slice(0, index).concat(this.datosExtraccion.slice(index + 1));
      }
      
      this.datosExtraccion.slice(1,response);
      
      this.tablaExtraccion()
      this.messageService.add({
        key:'tst',
        severity: 'success',
        summary: 'Se elimino el registro!!',
        detail: 'Con exito!!',
      });  
        /* FLASK */
        // this.http.post('https://izzicron.pagekite.me/eliminar', {data: item}).subscribe(
        //   (res: any) => {
        //     // console.log(res);
        //   },
        //   (err: any) => {
        //     // console.log(err);
        //   }
        // )
        this.cors.post('Reporte/eliminarCron',item)
        .then((response) => {

          // console.log(response)


        })
        .catch((error) => {
          // console.log(error)
          this.messageService.add({
            key:'tst',
            severity: 'error',
            summary: 'No se logro eliminar el Cron',
            detail: 'Intenta Nuevamente!!!',
          });
        });

        // this.cron.post('eliminar', {data: item}).subscribe(
        //   (res: any) => {
        //     // console.log(res);
        //   },
        //   (err: any) => {
        //     // console.log(err);
        //   }
        // )

    })
    .catch((error) => {
      // console.log(error)
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'No se logro eliminar!!',
        detail: 'Intenta Nuevamente!!!',
      });
    });

  }

  editar(item:any){ 
    // // console.log(item)
    if(item.tipoProgramacion == "0"){
      item.tipoProgramacion = false
    }else if(item.tipoProgramacion == "1"){
      item.tipoProgramacion = true
    }
    if(item.medioExtraccion == "true"){
      item.medioExtraccion = true
    }else if(item.medioExtraccion == "false"){
      item.medioExtraccion = false
    }
    this.editForm = item;
    if(item.tipoExtraccion == "Casos de negocio"){
      const inputString = this.editForm.parametrosExtraccion[0].fechaApertura;
      const regex = /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})/g;

      let matches = inputString.match(regex);
      if (matches && matches.length >= 2) {
        let a=matches[0].replace(/'/g, ''); 
        let b=matches[1].replace(/'/g, '');
        matches[0]=a;
        matches[1]=b;
        // // console.log(matches)
        let fechas: Date[] = [];
        const dateObjects = matches.map((m:any) => {
          const [datePart, timePart] = m.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hour, minute, second] = timePart.split(':').map(Number);
        
          // Los meses en JavaScript son basados en 0, por lo que debemos restar 1 al mes.
          fechas.push(new Date(year, month - 1, day, hour, minute, second));
        });
        
        matches = fechas;
        this.editForm.parametrosExtraccion[0].fechaApertura = matches
      }else{
        this.editForm.parametrosExtraccion[0].fechaApertura = []

      }
  
    }else if(item.tipoExtraccion == "Actividades"){
      const inputString = this.editForm.parametrosExtraccion[0].fechaCreacion;
      const inputString1 = this.editForm.parametrosExtraccion[0].fechaAsignacion;
      const inputString2 = this.editForm.parametrosExtraccion[0].vencimientoActividad;
      const regex = /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})/g;

      let matches = inputString.match(regex);
      let matches1 = inputString1.match(regex);
      let matches2 = inputString2.match(regex);
      if (matches && matches.length >= 2) {
        let a=matches[0].replace(/'/g, ''); 
        let b=matches[1].replace(/'/g, '');
        matches[0]=a;
        matches[1]=b;
        // // console.log(matches)
        let fechas: Date[] = [];
        const dateObjects = matches.map((m:any) => {
          const [datePart, timePart] = m.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hour, minute, second] = timePart.split(':').map(Number);
        
          // Los meses en JavaScript son basados en 0, por lo que debemos restar 1 al mes.
          fechas.push(new Date(year, month - 1, day, hour, minute, second));
        });
        
        matches = fechas;
        this.editForm.parametrosExtraccion[0].fechaCreacion = matches
      }else{
        this.editForm.parametrosExtraccion[0].fechaCreacion = []

      }
      if (matches1 && matches1.length >= 2) {
        let a=matches1[0].replace(/'/g, ''); 
        let b=matches1[1].replace(/'/g, '');
        matches1[0]=a;
        matches1[1]=b;
        // // console.log(matches)
        let fechas: Date[] = [];
        const dateObjects = matches1.map((m:any) => {
          const [datePart, timePart] = m.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hour, minute, second] = timePart.split(':').map(Number);
        
          // Los meses en JavaScript son basados en 0, por lo que debemos restar 1 al mes.
          fechas.push(new Date(year, month - 1, day, hour, minute, second));
        });
        
        matches1 = fechas;
        this.editForm.parametrosExtraccion[0].fechaAsignacion = matches1
      }else{
        this.editForm.parametrosExtraccion[0].fechaAsignacion = []

      }
      if (matches2 && matches2.length >= 2) {
        let a=matches2[0].replace(/'/g, ''); 
        let b=matches2[1].replace(/'/g, '');
        matches2[0]=a;
        matches2[1]=b;
        // // console.log(matches)
        let fechas: Date[] = [];
        const dateObjects = matches2.map((m:any) => {
          const [datePart, timePart] = m.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hour, minute, second] = timePart.split(':').map(Number);
        
          // Los meses en JavaScript son basados en 0, por lo que debemos restar 1 al mes.
          fechas.push(new Date(year, month - 1, day, hour, minute, second));
        });
        
        matches2 = fechas;
        this.editForm.parametrosExtraccion[0].vencimientoActividad = matches2
      }else{
        this.editForm.parametrosExtraccion[0].vencimientoActividad = []

      }
  
    }else if(item.tipoExtraccion == "Ordenes de servicio"){
      const inputString = this.editForm.parametrosExtraccion[0].fechaOrden;
      // const regex = /'(\d{1,2}\/\d{1,2}\/\d{4})'/g;
      const regex = /(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})/g;

      let matches = inputString.match(regex);
      if (matches && matches.length >= 2) {
        let a=matches[0].replace(/'/g, ''); 
        let b=matches[1].replace(/'/g, '');
        matches[0]=a;
        matches[1]=b;
        // // console.log(matches)
        let fechas: Date[] = [];
        const dateObjects = matches.map((m:any) => {
          const [datePart, timePart] = m.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hour, minute, second] = timePart.split(':').map(Number);
        
          // Los meses en JavaScript son basados en 0, por lo que debemos restar 1 al mes.
          fechas.push(new Date(year, month - 1, day, hour, minute, second));
        });
        
        matches = fechas;
        this.editForm.parametrosExtraccion[0].fechaOrden = matches
      }else{
        this.editForm.parametrosExtraccion[0].fechaOrden = []

      }
      
  
    }

    this.modal=true;
  }

  editar1(){
    // // console.log(this.editForm)

    if((!this.editForm.minuto && (!this.editForm.diaSemana || this.editForm.diaSemana?.length<=0))|| (this.editForm.minuto && this.editForm.diaSemana)){
      let randomId = nanoid();
    let data ={
      "id": 0,
      "cve_usuario": `${this.usuario.email}`,
      "tipoExtraccion":`${this.editForm.tipoExtraccion}`,
      "fechaCompletado": null,
      "status": "Pendiente",
      "ip": "",
      "parametrosExtraccion":"",
      "procesando": "0",
      "fechaExtraccion": "",
      "archivo": "",
      "horaProgramacion": this.getTextoEdit(),
      "nombreCron":`${this.editForm.tipoExtraccion}_${randomId}`,
      "scheduleExpression":"",
      "tipoProgramacion":`${this.editForm.tipoProgramacion == true ? "1":"0"}`,
      "correo":`${this.editForm.correo }`,
      "medioExtraccion":`${this.editForm.medioExtraccion }`,
    };
  
    if(this.editForm.tipoExtraccion === "Casos de negocio"){
      // // console.log("Casos de negocio")
      data.parametrosExtraccion =`[{"fechaApertura":">='${this.editForm.parametrosExtraccion[0].fechaApertura?.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].fechaApertura[0]):"null" }' AND <= '${this.editForm.parametrosExtraccion[0].fechaApertura?.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].fechaApertura[1]):"null"}'","estado":"${this.editForm.parametrosExtraccion[0].estado ? this.editForm.parametrosExtraccion[0].estado : ""}","cuenta":"${this.editForm.parametrosExtraccion[0].cuenta ? this.editForm.parametrosExtraccion[0].cuenta :""}","medioContacto":"${this.editForm.parametrosExtraccion[0].medioContacto ? this.editForm.parametrosExtraccion[0].medioContacto :""}","casoNegocio":"${this.editForm.parametrosExtraccion[0].casoNegocio ? this.editForm.parametrosExtraccion[0].casoNegocio :""}","categoria":"${this.editForm.parametrosExtraccion[0].categoria ? this.editForm.parametrosExtraccion[0].categoria :""}","motivo":"${this.editForm.parametrosExtraccion[0].motivo ? this.editForm.parametrosExtraccion[0].motivo:""}","subMotivo":"${this.editForm.parametrosExtraccion[0].subMotivo ? this.editForm.parametrosExtraccion[0].subMotivo :""}","solucion":"${this.editForm.parametrosExtraccion[0].solucion ? this.editForm.parametrosExtraccion[0].solucion :""}","motivoCliente":"${this.editForm.parametrosExtraccion[0].motivoCliente ? this.editForm.parametrosExtraccion[0].motivoCliente :""}"}]`;
    }else if(this.editForm.tipoExtraccion === "Actividades"){
      // // console.log("Actividades")
      data.parametrosExtraccion =`[{"estado":"${this.editForm.parametrosExtraccion[0].estado ? this.editForm.parametrosExtraccion[0].estado : ""}","areaConocimiento":"${this.editForm.parametrosExtraccion[0].areaConocimiento ? this.editForm.parametrosExtraccion[0].areaConocimiento :""}","fechaAsignacion":">='${this.editForm.parametrosExtraccion[0].fechaAsignacion?.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].fechaAsignacion[0]):"null" }' AND <= '${this.editForm.parametrosExtraccion[0].fechaAsignacion?.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].fechaAsignacion[1]):"null"}'","tipo":"${this.editForm.parametrosExtraccion[0].tipo ? this.editForm.parametrosExtraccion[0].tipo : ""}","vencimientoActividad":">='${this.editForm.parametrosExtraccion[0].vencimientoActividad?.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].vencimientoActividad[0]):"null" }' AND <= '${this.editForm.parametrosExtraccion[0].vencimientoActividad?.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].vencimientoActividad[1]):"null"}'","fechaCreacion":">='${this.editForm.parametrosExtraccion[0].fechaCreacion?.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].fechaCreacion[0]):"null" }' AND <= '${this.editForm.parametrosExtraccion[0].fechaCreacion?.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].fechaCreacion[1]):"null"}'"}]`;
      
    }else if(this.editForm.tipoExtraccion === "Ordenes de servicio"){
      // // console.log("Ordenes de servicio")
      // data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","rpt":"${this.formExtraccion.controls['rpt'].value}","tipoOrden":"${this.formExtraccion.controls['tipoOrden'].value}","motivo":"${this.formExtraccion.controls['motivo'].value}","asignada":"${this.formExtraccion.controls['asignada'].value}"}]`;
      data.parametrosExtraccion =`[{"cuenta":"${this.editForm.parametrosExtraccion[0].cuenta ? this.editForm.parametrosExtraccion[0].cuenta : ""}","compania":"${this.editForm.parametrosExtraccion[0].compania ? this.editForm.parametrosExtraccion[0].compania :""}","telefonos":"${this.editForm.parametrosExtraccion[0].telefonos ? this.editForm.parametrosExtraccion[0].telefonos :""}","numOrden":"${this.editForm.parametrosExtraccion[0].numOrden ? this.editForm.parametrosExtraccion[0].numOrden :""}","tipoOrden":"${this.editForm.parametrosExtraccion[0].tipoOrden ? this.editForm.parametrosExtraccion[0].tipoOrden :""}","fechaOrden":">='${this.editForm.parametrosExtraccion[0].fechaOrden?.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].fechaOrden[0]):"null" }' AND <= '${this.editForm.parametrosExtraccion[0].fechaOrden.length==2 ? this.dateFormat(this.editForm.parametrosExtraccion[0].fechaOrden[1]):"null"}'","estado":"${this.editForm.parametrosExtraccion[0].estado ? this.editForm.parametrosExtraccion[0].estado :""}"}]`;
    }

    let regexCron=null;
    let horas =null;
    let minuto = null;
    let diasS=null;
    if(this.editForm.hora && this.editForm.hora.length>0 && this.editForm.hora.length<=23){
      horas=this.editForm.hora.join(',');
    }else if(this.editForm.hora && this.editForm.hora.length == 24){
      horas="*";
    }
    if(this.editForm.minuto != null){
      minuto=this.editForm.minuto;
    }
    if(this.editForm.diaSemana && this.editForm.diaSemana.length >0 && this.editForm.diaSemana.length <=6){
      diasS = this.editForm.diaSemana.join(',');
    }else if(this.editForm.diaSemana && this.editForm.diaSemana.length == 7){
      diasS ="*";
    }

    if(this.editForm.hora==null || this.editForm.hora.length ==0){
      regexCron = `0 0/${minuto} * ? * ${diasS}`;
      
    }else{
      
      regexCron = `0 ${minuto} ${horas?horas:"*"} ? * ${diasS}`;
    }

    if((!this.editForm.hora || this.editForm.hora.length==0)&& !this.editForm.minuto){
      data.scheduleExpression=this.editForm.scheduleExpression;
    }else{
      data.scheduleExpression=regexCron;
    }
    data.fechaExtraccion = `${moment().format('yyyy-MM-DDTHH:mm:ss')}`
    data.id = this.editForm.id
    // // console.log("data",data)
     this.cors.put(`Reporte/ActualizaEjecucionExtraccionAutomatizadosHoraProgramadaPrueba?id=${data.id}`,data)
          .then((response) => {
            // // console.log(response)
            this.messageService.add({
              key:'tst',
              severity: 'success',
              summary: 'Se logro editar!!',
              detail: 'Con Exito!!',
            });
            this.cors.post('Reporte/eliminarCron',this.editForm)
            .then((response) => {
              // console.log(response)
            })
            .catch((error) => {
              // console.log(error)
              this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se logro eliminar el Cron',
                detail: 'Intenta Nuevamente!!!',
              });
            });
            this.cors.post('Reporte/agregarNuevoCron',data)
            .then((response) => {
            // console.log(response)
            })
            .catch((error) => {
              // console.log(error)
              this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'No se logro guardar el Cron',
                detail: 'Intenta Nuevamente!!!',
              });
            });

          })
          .catch((error) => {
            // console.log(error)
            if(error.error=='An error occurred while saving the entity changes. See the inner exception for details.'){
              this.messageService.add({
                key:'tst',
                severity: 'error',
                summary: 'Ya existe este registro!!',
                detail: 'Intenta Nuevamente!!!',
              });
              return
            }
    
            this.messageService.add({
              key:'tst',
              severity: 'error',
              summary: 'No se logro editar!!',
              detail: 'Intenta Nuevamente!!!',
            });
          });
    }else if(this.editForm.minuto && (!this.editForm.diaSemana || this.editForm.diaSemana?.length<=0)){
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'Se necesita los dias de la semana',
        detail: 'Intenta Nuevamente!!!',
      });
    }else if(!this.editForm.minuto && (this.editForm.diaSemana || this.editForm.diaSemana?.length>0)){
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'Se necesita los minutos',
        detail: 'Intenta Nuevamente!!!',
      });
    }
    
    // let viejo = this.nuevaHora;
    // let nuevaH = moment(this.nuevaHora).format("HH:mm:00")
    // let nuevaV = moment(this.nuevaHora).format("HH:mm")
    // let a= null;
    // // // console.log("Viejo",viejo)
    // // // console.log("nuevo",nuevaV)
    // if(nuevaV=='Fecha inválida'){
    //   let b = viejo.split(":");
    //   a=b[0];
    // }else if(nuevaV!='Fecha inválida'){
    //   let b= nuevaV.split(":");
    //   a=b[0]
    // }
    // // // console.log(a)
    // this.cors.get(`Reporte/validarEjecucionExtraccionAutomatizacionHoraProgramadaPrueba`,{hora:a,id:this.id})
    // .then((response) => {
    //   // // console.log(response)
    //   let z=null;
    //   if(nuevaH == 'Fecha inválida'){
    //     z=viejo+":00"
    //   }else{
    //     z=nuevaH
    //   }
    //   if(response[0]=='SIN INFO'){
    //    
    //   }else if(response[0].id){
    //     this.messageService.add({
    //       key:'tst',
    //       severity: 'error',
    //       summary: 'Ya existe este horario',
    //       detail: 'Intenta Nuevamente!!',
    //     });      
        
    //   }
    //   this.modal=false;
    //   this.tablaExtraccion()
    // })
    // .catch((error) => {
    //   // console.log(error)
    //   this.messageService.add({
    //     key:'tst',
    //     severity: 'error',
    //     summary: 'No se logro editar!!',
    //     detail: 'Intenta Nuevamente!!!',
    //   });
    // });

    this.modal=false;
  }
  

  getDiaLabel(selectedValue: number): string {
    const selectedDay = this.diasemanas.find((dia) => dia.value === selectedValue);
    return selectedDay ? selectedDay.label : '';
  }
  getHoraLabel(selectedValue: string): string {
    const selectedHora = this.horas.find((hora) => hora.value === selectedValue);
    return selectedHora ? selectedHora.label : '';
  }

  getMinutoLabel(selectedValue: string): string {
    const selectedHora = this.min.find((hora) => hora.value === selectedValue);
    return selectedHora ? selectedHora.label : '';
  }

  cambioHora(event:any){
    // // console.log(event)
    let a="";
    if(event.length==0){
      this.h="";
    }else if(event.length==1){
      if(event[0] == 0){
        a+=`24am`
      }else if(event[0] >=1 && event[0] <=11){
        a+=`${event[0]}am`;
      }else if(event[0] >=12 && event[0] <=23){
        a+=`${event[0]}pm`;
      }
      this.h=a;
    }else if(event.length >1){
      for(let i = 0 ; i< event.length;i++){
        // // console.log(this.getHoraLabel(event[i]))
        if(event[i] == 0){
          a+=`24am, `
        }else if(event[i] >=1 && event[i] <=11){
          a+=`${event[i]}am, `;
        }else if(event[i] >=12 && event[i] <=23){
          a+=`${event[i]}pm, `;
        }
        
      }
      let b = a.substring(0, a.length - 2);
      // // console.log(b)
      this.h=b;
      
    }
  }

  cambioDias(event:any){
    // // console.log(event)
    let a ="";
    if(event.length==0){
      a="";
    }else if(event.length==1){
        a = `${this.getDiaLabel(event[0])}`;
    }else if(event.length>1){
      
      for(let i =0;i<event.length;i++){
        if(i==event.length-1){
          a+=`${this.getDiaLabel(event[i])}`;
        }else{
          a+=`${this.getDiaLabel(event[i])}, `;

        }
      }
    }
    this.d=a;
  }

  cambioMin(event:any){
    if(event <9){
      this.m=`0${event}`;
    }else{
      this.m=event;

    }
  }

  getTexto(): string {
    if(this.formExtraccion.controls['hora'].value && this.formExtraccion.controls['hora'].value.length>0 && (this.formExtraccion.controls['minuto'].value || this.formExtraccion.controls['minuto'].value==0)){
      let a="";
        for(let i = 0 ; i< this.formExtraccion.controls['hora'].value.length;i++){
          // // console.log(this.getHoraLabel(event[i]))
          if(this.formExtraccion.controls['hora'].value[i] == 0){
            a+=`24:${this.m}am, `
          }else if(this.formExtraccion.controls['hora'].value[i] >=1 && this.formExtraccion.controls['hora'].value[i] <=11){
            if(this.formExtraccion.controls['hora'].value[i] >=1 && this.formExtraccion.controls['hora'].value[i] <10){
              a+=`0${this.formExtraccion.controls['hora'].value[i]}:${this.m}am, `;

            }else{
              a+=`${this.formExtraccion.controls['hora'].value[i]}:${this.m}am, `;
            }
          }else if(this.formExtraccion.controls['hora'].value[i] >=12 && this.formExtraccion.controls['hora'].value[i] <=23){
            a+=`${this.formExtraccion.controls['hora'].value[i]}:${this.m}pm, `;
          }
          
        }
        this.h=a.substring(0,a.length-2);
      return `Se ejecuta a las <strong>${this.h}</strong> los días: <strong>${this.d}</strong>`;
      
    }
    if( this.formExtraccion.controls['minuto'].value){
      return `Se ejecuta cada <strong>${this.m}</strong> minutos los días: <strong>${this.d}</strong>`;

    }else if( this.formExtraccion.controls['minuto'].value ==0){
      return `Se ejecuta cada minuto los días: <strong>${this.d}</strong>`;

    }
      return "";
  
  }

  getTextoEdit(): string {
      if((!this.editForm.hora || this.editForm.hora.length<=0) && !this.editForm.minuto && (!this.editForm.diaSemana || this.editForm.diaSemana.length<=0)){
        return this.editForm.horaProgramacion;
      }else if(this.editForm.hora && this.editForm.hora.length>0 && (this.editForm.minuto || this.editForm.minuto == 0)){
        let a="";
         for(let i = 0 ; i< this.editForm.hora.length;i++){
          if(this.editForm.hora[i] == 0){
            a+=`24:${this.minutoEdit}am, `
          }else if(this.editForm.hora[i] >=1 && this.editForm.hora[i] <=11){
            if(this.editForm.hora[i] >=1 && this.editForm.hora[i] <10){
              a+=`0${this.editForm.hora[i]}:${this.minutoEdit}am, `;

            }else{
              a+=`${this.editForm.hora[i]}:${this.minutoEdit}am, `;
            }
          }else if(this.editForm.hora[i] >=12 && this.editForm.hora[i] <=23){
            a+=`${this.editForm.hora[i]}:${this.minutoEdit}pm, `;
          }
          
        }
        this.horaEdit=a.substring(0,a.length-2);
        return `Se ejecuta a las <strong>${this.horaEdit}</strong> los días: <strong>${this.diaSemanaEdit}</strong>`;

      }
      if( this.editForm.minuto){
        return `Se ejecuta cada <strong>${this.minutoEdit}</strong> minutos los días: <strong>${this.diaSemanaEdit == undefined ? "":this.diaSemanaEdit}</strong>`;

      }else if( this.editForm.minuto ==0){
        return `Se ejecuta cada minuto los días: <strong>${this.diaSemanaEdit}</strong>`;

      }
      
      return ""
  
  }

  cambioHoraEdit(event:any){
    // // console.log(event)
    let a="";
    if(event.length==0){
      this.horaEdit="";
    }else if(event.length==1){
      if(event[0] == 0){
        a+=`24am`
      }else if(event[0] >=1 && event[0] <=11){
        a+=`${event[0]}am`;
      }else if(event[0] >=12 && event[0] <=23){
        a+=`${event[0]}pm`;
      }
      this.horaEdit=a;
    }else if(event.length >1){
      for(let i = 0 ; i< event.length;i++){
        // // console.log(this.getHoraLabel(event[i]))
        if(event[i] == 0){
          a+=`24am, `
        }else if(event[i] >=1 && event[i] <=11){
          a+=`${event[i]}am, `;
        }else if(event[i] >=12 && event[i] <=23){
          a+=`${event[i]}pm, `;
        }
        
      }
      let b = a.substring(0, a.length - 2);
      // // console.log(b)
      this.horaEdit=b;
      
    }
  }

  cambioMinEdit(event:any){
    if(event <9){
      this.minutoEdit=`0${event}`;
    }else{
      this.minutoEdit=event;

    }
  }

   cambioDiasEdit(event:any){
    // // console.log(event)
    let a ="";
    if(event.length==0){
      a="";
    }else if(event.length==1){
        a = `${this.getDiaLabel(event[0])}`;
    }else if(event.length>1){
      
      for(let i =0;i<event.length;i++){
        if(i==event.length-1){
          a+=`${this.getDiaLabel(event[i])}`;
        }else{
          a+=`${this.getDiaLabel(event[i])}, `;

        }
      }
    }
    this.diaSemanaEdit=a;
  }


  // readExcel(event:any){
  //   let file = event.target.files[0];
  //   let ultimo = file.name.split('.');
  //   if(ultimo[ultimo.length-1] != 'xlsx'){
  //      this.messageService.add({
  //       key: 'tst',
  //       severity: 'error',
  //       summary: 'La extensión del archivo es incorrecta',
  //       detail: 'Ingresa un archivo con extensión XLSX!!',
  //     });
  //   }else if(ultimo[ultimo.length-1] == 'xlsx'){
  //     let fileReader = new FileReader();
  //     var pattern = /[\^*@!"#$%&/()=?¡!¿'\\]/gi;
     

  //     fileReader.readAsBinaryString(file);
  //     fileReader.onload= (e)=>{
  //       // var workBook = XLSX.read(fileReader.result,{type:'binary',cellDates:true, raw: true })
  //       var workBook = XLSX.read(fileReader.result,{type:'binary',cellDates:true })
  //       var sheetNames =  workBook.SheetNames;
  //       this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]],{defval: ''});
        
  //       Object.keys(this.ExcelData).forEach(key => {
  //         var cadenaReemplazada = this.ExcelData[key]["Motivos del cliente"].replace(/\r\n/g, ',');
  //         this.ExcelData[key]["Motivos del cliente"]=cadenaReemplazada;
      
  //       });   
  //       // console.log(this.ExcelData)
  //       this.cors.post('Reporte/InsertarBasescatalagoEjecucionExtraccionAutomatizadas',this.ExcelData).then((response) => {
  //         // console.log(response)
  //         this.messageService.add({
  //           key: 'tst',
  //           severity: 'success',
  //           summary: 'Excel Importado',
  //           detail: 'Correctamente!!',
  //         }); 
  //       }).catch((error) => {
  //         // console.log(error)
  //         // this.spinner=false;
  //         this.messageService.add({
  //           key: 'tst',
  //           severity: 'error',
  //           summary: 'Ocurrio un Erro intentalo nuevamente',
  //           detail: 'Intenta nuevamente!!!',
  //         });
  //       })

    
  //     }
  //   }

  // }


  cambioMotivo(item:any){
    if(item != null){
      this.cors.get(`Reporte/getMostrarCatalogoExtraccionAutomatizadasSubmotivoSolucion`,{motivo1:item,categoria:this.formExtraccion.controls['categoria'].value}).then((response) => {
        this.submo = response[0].submotivo;
        this.solu = response[0].solucion;
      }).catch((error) => {
        // console.log(error)
      });

    }
    this.formExtraccion.get('subMotivo')?.patchValue(null);
    this.formExtraccion.get('solucion')?.patchValue(null);
    this.formExtraccion.get('motivoCliente')?.patchValue(null);
  }

  cambioMotivoEdit(item:any){
    if(item != null){
      this.cors.get(`Reporte/getMostrarCatalogoExtraccionAutomatizadasSubmotivoSolucion`,{motivo1:item,categoria:this.editForm.parametrosExtraccion[0].categoria}).then((response) => {
        this.submo = response[0].submotivo;
        this.solu = response[0].solucion;
      }).catch((error) => {
        // console.log(error)
      });

    }
    // this.formExtraccion.get('subMotivo')?.patchValue(null);
    // this.formExtraccion.get('solucion')?.patchValue(null);
    // this.formExtraccion.get('motivoCliente')?.patchValue(null);
  }

  cleanMoEdit(item:any){
    // this.formExtraccion.get('motivo')?.patchValue(null);
    // this.formExtraccion.get('subMotivo')?.patchValue(null);
    // this.formExtraccion.get('solucion')?.patchValue(null);
    this.editForm.parametrosExtraccion[0].motivo = null;
    this.editForm.parametrosExtraccion[0].subMotivo = null;
    this.editForm.parametrosExtraccion[0].solucion = null;
  }
  
  inputMoEdit(){
    this.submo=[];
    this.solu=[];
    // if(this.formExtraccion.controls['motivo'].value ==""){
    //   this.formExtraccion.get('motivo')?.patchValue(null);
    //   this.formExtraccion.get('submotivo')?.patchValue(null);

    // }
    
    if(this.editForm.parametrosExtraccion[0].motivo = ""){
      this.editForm.parametrosExtraccion[0].motivo = null;
      this.editForm.parametrosExtraccion[0].submotivo = null;
    }
  }

  cleanMo(item:any){
    this.formExtraccion.get('motivo')?.patchValue(null);
    this.formExtraccion.get('subMotivo')?.patchValue(null);
    this.formExtraccion.get('solucion')?.patchValue(null);
    this.formExtraccion.get('motivoCliente')?.patchValue(null);

  }
  
  inputMo(){
    this.submo=[];
    this.solu=[];
    if(this.formExtraccion.controls['motivo'].value ==""){
      this.formExtraccion.get('motivo')?.patchValue(null);
      this.formExtraccion.get('submotivo')?.patchValue(null);

    }
  }

  filterMo(event: AutoCompleteCompleteEvent) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.mo as any[]).length; i++) {
          let country = (this.mo as any[])[i];
          if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }

      this.filterMotivo = filtered;
  }
  
  cambioSubmotivo(){
    this.formExtraccion.get('solucion')?.patchValue(null);
    this.formExtraccion.get('motivoCliente')?.patchValue(null);
    
  }

  cambioSubmotivoEdit(){
    // this.formExtraccion.get('solucion')?.patchValue(null);
    this.editForm.parametrosExtraccion[0].solucion = null;
    
  }

  cleanSubEdit(item:any){
    // this.formExtraccion.get('subMotivo')?.patchValue(null);
    // this.formExtraccion.get('solucion')?.patchValue(null);
    this.editForm.parametrosExtraccion[0].subMotivo = null;
    this.editForm.parametrosExtraccion[0].solucion = null;

  }
  
  inputSubEdit(){
    // if(this.formExtraccion.controls['subMotivo'].value ==""){
    //   this.formExtraccion.get('subMotivo')?.patchValue(null);

    // }
    if(this.editForm.parametrosExtraccion[0].subMotivo = null){
      this.editForm.parametrosExtraccion[0].subMotivo = null
    }
  }

  cleanSub(item:any){
    this.formExtraccion.get('subMotivo')?.patchValue(null);
    this.formExtraccion.get('solucion')?.patchValue(null);
    this.formExtraccion.get('motivoCliente')?.patchValue(null);

  }
  
  inputSub(){
    if(this.formExtraccion.controls['subMotivo'].value ==""){
      this.formExtraccion.get('subMotivo')?.patchValue(null);

    }
  }

  filterSubm(event: AutoCompleteCompleteEvent) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.submo as any[]).length; i++) {
          let country = (this.submo as any[])[i];
          if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }

      this.filterSub = filtered;
  }

  cambioSolucion(){

    if(this.formExtraccion.controls['motivo'].value != null && this.formExtraccion.controls['subMotivo'].value != null && this.formExtraccion.controls['solucion'].value != null){
      this.cors.get(`Reporte/getMostrarCatalogoExtraccionAutomatizadasMotivoCliente`,{
        motivo1:this.formExtraccion.controls['motivo'].value,
        submotivo:this.formExtraccion.controls['subMotivo'].value,
        solucion:this.formExtraccion.controls['solucion'].value,
        categoria:this.formExtraccion.controls['categoria'].value
      }).then((response) => {
        let a = response[0].motivoCliente[0]
        if(a == ''){
          this.moClien = [];
        }else if(a == '-'){
          this.moClien = ['-'];
        }else if (a == undefined){
          this.moClien = [];
        }else{
          const caracterBuscado = ",";
          if(a.includes(caracterBuscado)){
            this.moClien = a.split(',');
          }else{
            let b=[];
            b[0] = a;
            this.moClien = b
          }
        }
      }).catch((error) => {
        // console.log(error)
      });
  
    }
  }

  cambioSolucionEdit(){

    if(this.editForm.parametrosExtraccion[0].motivo != null && this.editForm.parametrosExtraccion[0].subMotivo && this.editForm.parametrosExtraccion[0].solucion != null){
      this.cors.get(`Reporte/getMostrarCatalogoExtraccionAutomatizadasMotivoCliente`,{
        motivo1:this.editForm.parametrosExtraccion[0].motivo,
        submotivo:this.editForm.parametrosExtraccion[0].subMotivo,
        solucion:this.editForm.parametrosExtraccion[0].solucion,
        categoria:this.editForm.parametrosExtraccion[0].categoria
      }).then((response) => {
        let a = response[0].motivoCliente[0]
        if(a == ''){
          this.moClien = [];
        }else if(a == '-'){
          this.moClien = ['-'];
        }else if (a == undefined){
          this.moClien = [];
        }else{
          const caracterBuscado = ",";
          if(a.includes(caracterBuscado)){
            this.moClien = a.split(',');
          }else{
            let b=[];
            b[0] = a;
            this.moClien = b
          }
        }
      }).catch((error) => {
        // console.log(error)
      });
  
    }
  }

  cleanSolucionEdit(item:any){
    // this.formExtraccion.get('solucion')?.patchValue(null);
    // this.formExtraccion.get('motivoCliente')?.patchValue(null);
    this.editForm.parametrosExtraccion[0].solucion = null;
    this.editForm.parametrosExtraccion[0].motivoCliente = null
  }
  
  inputSolEdit(){
    this.moClien=[]
    // if(this.formExtraccion.controls['solucion'].value ==""){
    //   this.formExtraccion.get('moCliente')?.patchValue(null);
    //   // this.formExtraccion.get('categoria')?.patchValue(null);

    // }
    if(this.editForm.parametrosExtraccion[0].solucion == ""){
      this.editForm.parametrosExtraccion[0].moCliente = null;
    }
  }

  cleanSolucion(item:any){
    this.formExtraccion.get('solucion')?.patchValue(null);
    this.formExtraccion.get('motivoCliente')?.patchValue(null);
    // this.formExtraccion.get('categoria')?.patchValue(null);
  }
  
  inputSol(){
    this.moClien=[]
    if(this.formExtraccion.controls['solucion'].value ==""){
      this.formExtraccion.get('moCliente')?.patchValue(null);
      // this.formExtraccion.get('categoria')?.patchValue(null);

    }
  }

  filterSolu(event: AutoCompleteCompleteEvent) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.solu as any[]).length; i++) {
          let country = (this.solu as any[])[i];
          if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }

      this.filterSol = filtered;
  }

  cambioCategoria(item:any){
    this.formExtraccion.get('motivo')?.patchValue(null);
    this.formExtraccion.get('subMotivo')?.patchValue(null);
    this.formExtraccion.get('solucion')?.patchValue(null);
    this.formExtraccion.get('motivoCliente')?.patchValue(null);

    if(item != null){
      this.cors.get('Reporte/getMostrarCatalogoExtraccionAutomatizadasMotivo',{
        categoria1:this.formExtraccion.controls['categoria'].value
      }).then((response) => {
        // // console.log(response)
        this.mo = response
      }).catch((error) => {
        // console.log(error)
      })
    }
    // // console.log(this.formExtraccion)
  }
  //categoriaEdit
  cambioCategoriaEdit(item:any){ 
    this.editForm.parametrosExtraccion[0].motivo = null;
    // this.formExtraccion.get('motivo')?.patchValue(null);

    // if(item != null){
    //   this.cors.get('Reporte/getMostrarCatalogoExtraccionAutomatizadasMotivo',{
    //     categoria1:this.formExtraccion.controls['categoria'].value
    //   }).then((response) => {
    //     // // console.log(response)
    //     this.mo = response
    //   }).catch((error) => {
    //     // console.log(error)
    //   })
    // }
    if(item != null){
      this.cors.get('Reporte/getMostrarCatalogoExtraccionAutomatizadasMotivo',{
            categoria1:this.editForm.parametrosExtraccion[0].categoria
          }).then((response) => {
            // // console.log(response)
            this.mo = response
          }).catch((error) => {
            // console.log(error)
          })
    }
    // // console.log(this.formExtraccion)
  }
  cleanCategoriaEdit(item:any){
    // this.formExtraccion.get('motivo')?.patchValue(null);
    // this.formExtraccion.get('categoria')?.patchValue(null);
    this.editForm.parametrosExtraccion[0].motivo = null;
    this.editForm.parametrosExtraccion[0].categoria = null;
    this.editForm.parametrosExtraccion[0].solucion = null;
    this.editForm.parametrosExtraccion[0].moCliente = null;
    this.editForm.parametrosExtraccion[0].subMotivo = null;

  }

  inputCategoriaEdit(){
    this.mo=[]
    // if(this.formExtraccion.controls['categoria'].value ==""){
    //   this.formExtraccion.get('motivo')?.patchValue(null);
    //   this.formExtraccion.get('categoria')?.patchValue(null);

    // }
    if(this.editForm.parametrosExtraccion[0].categoria == "" ){
      this.editForm.parametrosExtraccion[0].motivo = null;
      this.editForm.parametrosExtraccion[0].categoria = null;

    }
  }
  // categoria Edit

  cleanCategoria(item:any){
    this.formExtraccion.get('motivo')?.patchValue(null);
    this.formExtraccion.get('categoria')?.patchValue(null);
    this.formExtraccion.get('subMotivo')?.patchValue(null);
    this.formExtraccion.get('solucion')?.patchValue(null);
    this.formExtraccion.get('motivoCliente')?.patchValue(null);
  }
  
  inputCategoria(){
    this.mo=[]
    if(this.formExtraccion.controls['categoria'].value ==""){
      this.formExtraccion.get('motivo')?.patchValue(null);
      this.formExtraccion.get('categoria')?.patchValue(null);

    }
  }

  filterCategory(event: AutoCompleteCompleteEvent) {
      let filtered: any[] = [];
      let query = event.query;

      for (let i = 0; i < (this.catego as any[]).length; i++) {
          let country = (this.catego as any[])[i];
          if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(country);
          }
      }

      this.filterCat = filtered;
  }

  filterMotivoCl(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.moClien as any[]).length; i++) {
        let country = (this.moClien as any[])[i];
        if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }

    this.filterMotivoCli = filtered;
}

filterEstadoOS(event: AutoCompleteCompleteEvent) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.estadoOS as any[]).length; i++) {
      let country = (this.estadoOS as any[])[i];
      if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filterestadoOS = filtered;
}

filterTipoOrdenOS(event: AutoCompleteCompleteEvent) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.tipoOrOS as any[]).length; i++) {
      let country = (this.tipoOrOS as any[])[i];
      if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filtertipoOrOS = filtered;
}

filterTipoAct(event: AutoCompleteCompleteEvent) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.tipoAct as any[]).length; i++) {
      let country = (this.tipoAct as any[])[i];
      if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filtertipoAct = filtered;
}

filterAreaAct(event: AutoCompleteCompleteEvent) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.areaAct as any[]).length; i++) {
      let country = (this.areaAct as any[])[i];
      if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filterareaAct = filtered;
}

filterEstaAct(event: AutoCompleteCompleteEvent) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.estadoAct as any[]).length; i++) {
      let country = (this.estadoAct as any[])[i];
      if (country.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filterestadoAct = filtered;
}


confirm1(item:any) {
  this.confirmationService.confirm({
      message: `Deseas eliminar esta Extracción? - ${item.tipoExtraccion}`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          // this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Ha sido Aceptado' });
          this.eliminar(item);
      },
      reject: (type: any) => {
          switch (type as ConfirmEventType) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Ha sido Rechazado' });
                  break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Ha sido Cancelado' });
                  break;        
          }
      }
  });
}

medioExtraccionChange(item:any){
  this.formExtraccion.controls['telefonos']?.reset();
  this.formExtraccion.controls['compania']?.reset();
}


changeFechaApertura(event:any){
  if(event.length==2){

  }else{
    if (!this.fechaAperturaMin) {
      event.setHours(0,0,0,0);
      this.fechaAperturaMin = event;
      let a = new Date(this.fechaAperturaMin);
      a.setDate(a.getDate()+3)
      for(let i = 0 ;i<=30;i++){
        let b = a.setDate(a.getDate()+1)
        this.disabledDates.push(new Date(moment(b).format('yyyy-MM-DD')));
      }
        this.fechaAperturaMax = null;
    } else if (!this.fechaAperturaMax) {
      this.fechaAperturaMax = event;
      this.disabledDates=[];
      this.fechaAperturaMin=null;
      
    } 

  }
 

}

changeFechaAsignacion(event:any){
  if(event.length==2){

  }else{
    if (!this.fechaAsignacionMin) {
      event.setHours(0,0,0,0);
      this.fechaAsignacionMin = event;
      let a = new Date(this.fechaAsignacionMin);
      a.setDate(a.getDate()+3)
      for(let i = 0 ;i<=30;i++){
        let b = a.setDate(a.getDate()+1)
        this.disabledDatesfechaAsignacion.push(new Date(moment(b).format('yyyy-MM-DD')));
      }
        this.fechaAsignacionMax = null;
    } else if (!this.fechaAsignacionMax) {
      this.fechaAsignacionMax = event;
      this.disabledDatesfechaAsignacion=[];
      this.fechaAsignacionMin=null;
      
    } 

  }
 

}

changeFechaVencimiento(event:any){
  if(event.length==2){

  }else{
    if (!this.fechaVencimientoMin) {
      event.setHours(0,0,0,0)
      this.fechaVencimientoMin = event;
      let a = new Date(this.fechaVencimientoMin);
      a.setDate(a.getDate()+3)
      for(let i = 0 ;i<=30;i++){
        let b = a.setDate(a.getDate()+1)
        this.disabledDatesfechaVencimiento.push(new Date(moment(b).format('yyyy-MM-DD')));
      }
        this.fechaVencimientoMax = null;
    } else if (!this.fechaVencimientoMax) {
      this.fechaVencimientoMax = event;
      this.disabledDatesfechaVencimiento=[];
      this.fechaVencimientoMin=null;
      
    } 

  }
 

}


changeFechaCreacion(event:any){
  if(event.length==2){

  }else{
    if (!this.fechaCreacionMin) {
      event.setHours(0, 0, 0, 0);
      this.fechaCreacionMin = event;
      let a = new Date(this.fechaCreacionMin);
      a.setDate(a.getDate()+3)
      for(let i = 0 ;i<=30;i++){
        let b = a.setDate(a.getDate()+1)
        this.disabledDatesfechaCreacion.push(new Date(moment(b).format('yyyy-MM-DD')));
      }
        this.fechaVencimientoMax = null;
    } else if (!this.fechaVencimientoMax) {
      this.fechaVencimientoMax = event;
      this.disabledDatesfechaCreacion=[];
      this.fechaCreacionMin=null;
      
    } 

  }
 

}

changeFechaOrden(event:any){
  if(event.length==2){

  }else{
    if (!this.fechaOrdenMin) {
      event.setHours(0,0,0,0)
      this.fechaOrdenMin = event; 
      let a = new Date(this.fechaOrdenMin);
      // a.setHours(0, 0, 0, 0);
      a.setDate(a.getDate()+1)
      for(let i = 0 ;i<=30;i++){
        let b = a.setDate(a.getDate()+1)
        this.disabledDatesfechaOrden.push(new Date(moment(b).format('yyyy-MM-DD')));
      }
        this.fechaOrdenMax = null;
    } else if (!this.fechaOrdenMax) {
      this.fechaOrdenMax = event;
      this.disabledDatesfechaOrden=[];
      this.fechaOrdenMin=null;
      
    } 
  }

}


changeFechaAperturaEdit(event:any){
  if (!this.fechaAperturaMinEdit) {
    this.fechaAperturaMinEdit = event;
    let a = new Date(this.fechaAperturaMinEdit);
    a.setHours(0, 0, 0, 0);
    a.setDate(a.getDate()+3)
    for(let i = 0 ;i<=30;i++){
      let b = a.setDate(a.getDate()+1)
      this.disabledDatesEdit.push(new Date(moment(b).format('yyyy-MM-DD')));
    }
      this.fechaAperturaMaxEdit = null;
  } else if (!this.fechaAperturaMaxEdit) {
    this.fechaAperturaMaxEdit = event;
    this.disabledDatesEdit=[];
    this.fechaAperturaMinEdit=null;
    
  } 
 

}

changeFechaAsignacionEdit(event:any){
  if (!this.fechaAsignacionMinEdit) {
    this.fechaAsignacionMinEdit = event;
    let a = new Date(this.fechaAsignacionMinEdit);
    a.setHours(0, 0, 0, 0);
    a.setDate(a.getDate()+3)
    for(let i = 0 ;i<=30;i++){
      let b = a.setDate(a.getDate()+1)
      this.disabledDatesfechaAsignacionEdit.push(new Date(moment(b).format('yyyy-MM-DD')));
    }
      this.fechaAsignacionMaxEdit = null;
  } else if (!this.fechaAsignacionMaxEdit) {
    this.fechaAsignacionMaxEdit = event;
    this.disabledDatesfechaAsignacionEdit=[];
    this.fechaAsignacionMinEdit=null;
    
  } 
 

}

changeFechaVencimientoEdit(event:any){
  if (!this.fechaVencimientoMinEdit) {
    this.fechaVencimientoMinEdit = event;
    let a = new Date(this.fechaVencimientoMinEdit);
    a.setHours(0, 0, 0, 0);
    a.setDate(a.getDate()+3)
    for(let i = 0 ;i<=30;i++){
      let b = a.setDate(a.getDate()+1)
      this.disabledDatesfechaVencimientoEdit.push(new Date(moment(b).format('yyyy-MM-DD')));
    }
      this.fechaVencimientoMaxEdit = null;
  } else if (!this.fechaVencimientoMaxEdit) {
    this.fechaVencimientoMaxEdit = event;
    this.disabledDatesfechaVencimientoEdit=[];
    this.fechaVencimientoMinEdit=null;
    
  } 
 

}


changeFechaCreacionEdit(event:any){
  if (!this.fechaCreacionMinEdit) {
    this.fechaCreacionMinEdit = event;
    let a = new Date(this.fechaCreacionMinEdit);
    a.setHours(0, 0, 0, 0);
    a.setDate(a.getDate()+3)
    for(let i = 0 ;i<=30;i++){
      let b = a.setDate(a.getDate()+1)
      this.disabledDatesfechaCreacionEdit.push(new Date(moment(b).format('yyyy-MM-DD')));
    }
      this.fechaVencimientoMaxEdit = null;
  } else if (!this.fechaVencimientoMaxEdit) {
    this.fechaVencimientoMaxEdit = event;
    this.disabledDatesfechaCreacionEdit=[];
    this.fechaCreacionMinEdit=null;
    
  } 
 

}

changeFechaOrdenEdit(event:any){
  if(event.length==2){
  
  }else{
    if (!this.fechaOrdenMinEdit) {
      event.setHours(0, 0, 0, 0);
      this.fechaOrdenMinEdit = event;
      let a = new Date(this.fechaOrdenMinEdit);
      a.setDate(a.getDate()+1)
      for(let i = 0 ;i<=30;i++){
        let b = a.setDate(a.getDate()+1)
        this.disabledDatesfechaOrdenEdit.push(new Date(moment(b).format('yyyy-MM-DD')));
      }
        this.fechaOrdenMaxEdit = null;
    } else if (!this.fechaOrdenMaxEdit) {
      this.fechaOrdenMaxEdit = event;
      this.disabledDatesfechaOrdenEdit=[];
      this.fechaOrdenMinEdit=null;
      
    } 

  }
 

}












}
