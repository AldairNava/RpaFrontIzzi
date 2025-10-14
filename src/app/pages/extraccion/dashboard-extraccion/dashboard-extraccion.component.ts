import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
moment.lang('es');
import { Message, MessageService } from 'primeng/api';
import { CorsService } from '@services';
import { Table } from 'primeng/table';


@Component({
  selector: 'dashboard-extraccion',
  templateUrl: './dashboard-extraccion.component.html',
  styleUrls: ['./dashboard-extraccion.component.scss']
})
export class DashboardExtraccionComponent implements OnInit {

  usuario: any = JSON.parse(sessionStorage.getItem("user") || "{}")
  tipoExtraccion:string[]=[
    'Cuenta',
    'Casos de negocio',
    'Actividades',
    'Ordenes de servicio',
    'Pagos',
    // 'Fallas generales'
  ]; 
  formExtraccion:UntypedFormGroup;
  spinner:boolean=false;
  datosExtraccion:any[]=[];
  loading: boolean = false
  show:boolean=false;
  url1:any;
  archivoSeleccionado:string="";
	loading2:boolean=false;


  constructor(private formBuilder: UntypedFormBuilder,private router:Router,private messageService: MessageService,private cors: CorsService) {
    this.tablaExtraccion();
    this.formExtraccion = this.formBuilder.group({
      tipoExtraccion: [null, Validators.required],
      fechaini: [null],
      fechafin: [null],

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

    });

  }

  ngOnInit(): any {
    setInterval(() => {
      this.tablaExtraccion();
    }, 5000);
    
  }

  reset(){
    this.formExtraccion.reset()
  }

  Enviar(){
    this.formExtraccion.markAllAsTouched();
    if(this.formExtraccion.valid){
      this.spinner = true;
      let data ={
        "id": 0,
        "cve_usuario": `${this.usuario.email}`,
        "tipoExtraccion":`${this.formExtraccion.controls['tipoExtraccion'].value}`,
        "fechaCompletado": null,
        "status": "",
        "fechaCaptura": null,
        "ip": "",
        "parametrosExtraccion":"",
        "fechaInicial":null,
        "fechaFinal":null,
        "procesando": "",
        "fechaExtraccion": null,
        "archivo": ""
      };
      if(this.formExtraccion.controls['tipoExtraccion'].value === "Cuenta"){
        // // console.log("Esto es Cuenta")
        // data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value}","tipo":"${this.formExtraccion.controls['tipo'].value}","subtipo":"${this.formExtraccion.controls['subtipo'].value}","canalIngreso":"${this.formExtraccion.controls['canalIngreso'].value}"}]`;
        data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","tipo":"${this.formExtraccion.controls['tipo'].value ? this.formExtraccion.controls['tipo'].value :""}","subtipo":"${this.formExtraccion.controls['subtipo'].value ? this.formExtraccion.controls['subtipo'].value :""}","canalIngreso":"${this.formExtraccion.controls['canalIngreso'].value ? this.formExtraccion.controls['canalIngreso'].value : ""}"}]`;
        
        // var myObject = JSON.parse(data.parametrosExtraccion);
        // // console.log(myObject)
      }else if(this.formExtraccion.controls['tipoExtraccion'].value === "Casos de negocio"){
        // // console.log("Casos de negocio")
        data.parametrosExtraccion =`[{"fechaApertura":">='${this.formExtraccion.controls['fechaApertura'].value ? this.dateFormatDate(this.formExtraccion.controls['fechaApertura'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['fechaApertura'].value ? this.dateFormatDate(this.formExtraccion.controls['fechaApertura'].value[1]):"null"}'","estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","cuenta":"${this.formExtraccion.controls['cuenta'].value ? this.formExtraccion.controls['cuenta'].value :""}","medioContacto":"${this.formExtraccion.controls['medioContacto'].value ? this.formExtraccion.controls['medioContacto'].value :""}","casoNegocio":"${this.formExtraccion.controls['casoNegocio'].value ? this.formExtraccion.controls['casoNegocio'].value :""}","categoria":"${this.formExtraccion.controls['categoria'].value ? this.formExtraccion.controls['categoria'].value :""}","motivo":"${this.formExtraccion.controls['motivo'].value ? this.formExtraccion.controls['motivo'].value:""}","subMotivo":"${this.formExtraccion.controls['subMotivo'].value ? this.formExtraccion.controls['subMotivo'].value :""}","solucion":"${this.formExtraccion.controls['solucion'].value ? this.formExtraccion.controls['solucion'].value :""}","motivoCliente":"${this.formExtraccion.controls['motivoCliente'].value ? this.formExtraccion.controls['motivoCliente'].value :""}"}]`;
      }else if(this.formExtraccion.controls['tipoExtraccion'].value === "Actividades"){
        // // console.log("Actividades")
        data.parametrosExtraccion =`[{"estado":"${this.formExtraccion.controls['estado'].value ? this.formExtraccion.controls['estado'].value : ""}","areaConocimiento":"${this.formExtraccion.controls['areaConocimiento'].value ? this.formExtraccion.controls['areaConocimiento'].value :""}","fechaAsignacion":">='${this.formExtraccion.controls['fechaAsignacion'].value ? this.dateFormatDate(this.formExtraccion.controls['fechaAsignacion'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['fechaAsignacion'].value ? this.dateFormatDate(this.formExtraccion.controls['fechaAsignacion'].value[1]):"null"}'","tipo":"${this.formExtraccion.controls['tipo'].value ? this.formExtraccion.controls['tipo'].value : ""}","vencimientoActividad":">='${this.formExtraccion.controls['vencimientoActividad'].value ? this.dateFormatDate(this.formExtraccion.controls['vencimientoActividad'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['vencimientoActividad'].value ? this.dateFormatDate(this.formExtraccion.controls['vencimientoActividad'].value[1]):"null"}'","fechaCreacion":">='${this.formExtraccion.controls['fechaCreacion'].value ? this.dateFormatDate(this.formExtraccion.controls['fechaCreacion'].value[0]):"null" }' AND <= '${this.formExtraccion.controls['fechaCreacion'].value ? this.dateFormatDate(this.formExtraccion.controls['fechaCreacion'].value[1]):"null"}'"}]`;
        
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
      this.cors.post('Reporte/GuardarFormularioEjecucionExtraccion',data)
      .then((response) => {
        // // console.log(response)
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Exito!!!',
          detail: 'Datos guardados',
        });
      })
      .catch((error) => {
        // console.log(error)
        this.messageService.add({
          key:'tst',
          severity: 'error',
          summary: 'No se logro guardar',
          detail: 'Intenta Nuevamente!!!',
        });
      });
      
      setTimeout(() => {
        this.spinner = false;
        this.tablaExtraccion();
        this.reset()
        // this.router.navigate(['/extraccion/visualizacion']);
        
      }, 3000);
      
    }else{
      
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'Faltaron campos por rellenar!',
        detail: 'Intenta Nuevamente!!!',
      });
      
    }





  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  clearValidators(){
    this.formExtraccion.controls['estado'].reset();
    this.formExtraccion.controls['tipo'].reset();
    this.formExtraccion.controls['subtipo'].reset();
    this.formExtraccion.controls['canalIngreso'].reset();
    this.formExtraccion.controls['numCaso'].reset();
    this.formExtraccion.controls['cuenta'].reset();
    this.formExtraccion.controls['categoria'].reset();
    this.formExtraccion.controls['motivo'].reset();
    this.formExtraccion.controls['subMotivo'].reset();
    this.formExtraccion.controls['solucion'].reset();
    this.formExtraccion.controls['areaConocimiento'].reset();
    this.formExtraccion.controls['fechaAsignacion'].reset();
    this.formExtraccion.controls['rpt'].reset();
    this.formExtraccion.controls['tipoOrden'].reset();
    this.formExtraccion.controls['asignada'].reset();

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

  };

  cambioOrdenServicio(event:any){
    this.clearValidators();
    if(event ==="Cuenta"){
      this.formExtraccion.get('estado')?.setValidators([Validators.required]);
      this.formExtraccion.get('estado')?.updateValueAndValidity();
      this.formExtraccion.get('tipo')?.setValidators([Validators.required]);
      this.formExtraccion.get('tipo')?.updateValueAndValidity();
      this.formExtraccion.get('subtipo')?.setValidators([Validators.required]);
      this.formExtraccion.get('subtipo')?.updateValueAndValidity();
      this.formExtraccion.get('canalIngreso')?.setValidators([Validators.required]);
      this.formExtraccion.get('canalIngreso')?.updateValueAndValidity();
    }else if(event ==="Casos de negocio"){
      this.formExtraccion.get('estado')?.setValidators([Validators.required]);
      this.formExtraccion.get('estado')?.updateValueAndValidity();
      this.formExtraccion.get('numCaso')?.setValidators([Validators.required]);
      this.formExtraccion.get('numCaso')?.updateValueAndValidity();
      this.formExtraccion.get('cuenta')?.setValidators([Validators.required]);
      this.formExtraccion.get('cuenta')?.updateValueAndValidity();
      this.formExtraccion.get('categoria')?.setValidators([Validators.required]);
      this.formExtraccion.get('categoria')?.updateValueAndValidity();
      this.formExtraccion.get('motivo')?.setValidators([Validators.required]);
      this.formExtraccion.get('motivo')?.updateValueAndValidity();
      this.formExtraccion.get('subMotivo')?.setValidators([Validators.required]);
      this.formExtraccion.get('subMotivo')?.updateValueAndValidity();
      this.formExtraccion.get('solucion')?.setValidators([Validators.required]);
      this.formExtraccion.get('solucion')?.updateValueAndValidity();

    }else if(event ==="Actividades"){
      this.formExtraccion.get('estado')?.setValidators([Validators.required]);
      this.formExtraccion.get('estado')?.updateValueAndValidity();
      this.formExtraccion.get('areaConocimiento')?.setValidators([Validators.required]);
      this.formExtraccion.get('areaConocimiento')?.updateValueAndValidity();
      this.formExtraccion.get('fechaAsignacion')?.setValidators([Validators.required]);
      this.formExtraccion.get('fechaAsignacion')?.updateValueAndValidity();

    }else if(event ==="Ordenes de servicio"){
      this.formExtraccion.get('motivo')?.setValidators([Validators.required]);
      this.formExtraccion.get('motivo')?.updateValueAndValidity();
      this.formExtraccion.get('rpt')?.setValidators([Validators.required]);
      this.formExtraccion.get('rpt')?.updateValueAndValidity();
      this.formExtraccion.get('tipoOrden')?.setValidators([Validators.required]);
      this.formExtraccion.get('tipoOrden')?.updateValueAndValidity();
      this.formExtraccion.get('asignada')?.setValidators([Validators.required]);
      this.formExtraccion.get('asignada')?.updateValueAndValidity();
      this.formExtraccion.get('estado')?.setValidators([Validators.required]);
      this.formExtraccion.get('estado')?.updateValueAndValidity();

    }
  }
  dateFormat(value:any){
    // // console.log(value)
    if(value != null){
      return moment(value).format('DD/MM/yyyy HH:mm:ss')
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

  tablaExtraccion(){
    this.cors.get('Reporte/getmostrarTablaExtraccion',{})
    .then((response) => {
      for(let i = 0 ; i<response.length;i++){
        if(response[i].procesando && response[i].procesando=="1"){
          response[i].procesando="Si"
        }else{
          response[i].procesando="No"
        }
      }
      
      this.datosExtraccion = response;
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

  descargarArchivo(archivo:string){
    this.archivoSeleccionado = archivo;
		this.loading2 = true;

    this.cors.get1(`Reporte/BajarExtraccionExcelFTP`,{
      "nombre":archivo
    })
    .then((response) => {
      // // console.log(response)
      this.show = true;
      this.url1 = `https://rpabackizzi.azurewebsites.net/Reporte/BajarExtraccionExcelFTP?nombre=${archivo}`;

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
  
      
    })
    .catch((error) => {
      // console.log(error)
      this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'No se logro descargar',
        detail: 'Intenta Nuevamente!!!',
      });
      this.loading2 = false;
      this.archivoSeleccionado = '';

    });
    this.show=false;

  }

  estaSiendoDescargado(archivo: string): boolean {
		return this.archivoSeleccionado === archivo && this.loading2;
	}




}
