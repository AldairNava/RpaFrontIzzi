import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { CorsService } from '@services';
import * as moment from 'moment';
moment.lang('es');
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'prefijos',
  templateUrl: './prefijos.component.html',
  styleUrls: ['./prefijos.component.scss']
})
export class PrefijosComponent implements OnInit {
  usuario: any = JSON.parse(localStorage.getItem("userData") || "{}")
  prefijos:any;
  loading:boolean=false;
  edit:any={
    region:null,
    subregion:null,
    hub:null,
    plaza:null,
    rpt:null,
    hubOrden:null,
    prefijo:null
  };
  new:any={
    region:null,
    subregion:null,
    hub:null,
    plaza:null,
    rpt:null,
    hubOrden:null,
    prefijo:null,
    Cve_usuario:this.usuario.email,
    CreatedAt:null
  };
  visible:boolean=false;
  visible1:boolean=false;


  constructor(private cors: CorsService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.getPrefijos();
  }

  getPrefijos(){
		this.cors.get('EjecucionDepuracion/getPrefijosRegionDepuracion')
		.then((response) => {
      // // console.log(response)
		  if(response[0] == "SIN INFO"){
			  this.prefijos = [];
		  }else{
			  this.prefijos = response;
		  }
		})
		.catch((error) => {
		  // console.log(error)
		});
  }

	onGlobalFilter(table: Table, event: Event) {
		table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
	}

  saveEdit(){
    // // console.log(this.edit)
    this.cors.put(`EjecucionDepuracion/ActualizarPrefijosRegionDepuracion?id=${this.edit.id}`,this.edit)
		.then((response) => {
		  // console.log(response)
		  this.messageService.add({
			key: 'tst',
			severity: 'success',
			summary: 'Exito!!!',
			detail: 'Prefijo Editado',
		  });
		  this.getPrefijos();
		})
		.catch((error) => {
      // console.log(error)
		  this.messageService.add({
        key:'tst',
        severity: 'error',
        summary: 'No se logro actualizar',
        detail: 'Intenta Nuevamente!!!',
		  });
		});
    this.visible=false;

  }

  editar(item:any){
    this.edit={
      id:item.id,
      region:item.region,
      subregion:item.subregion,
      hub:item.hub,
      plaza:item.plaza,
      rpt:item.rpt,
      hubOrden:item.hubOrden,
      prefijo:item.prefijo,
      Cve_usuario:this.usuario.email,
      UpdatedAt:`${moment().format('yyyy-MM-DDTHH:mm:ss')}`,
      CreatedAt:item.createdAt
    };
    this.visible=true;
  }

  eliminar(item:any){
    this.cors.delete(`EjecucionDepuracion/EliminarPrefijosRegionDepuracion?id=${item}`,{"id":item})
		.then((response) => {
		  this.messageService.add({
			key: 'tst',
			severity: 'success',
			summary: 'Exito!!!',
			detail: 'Eliminado con Exito',
		  });
		this.getPrefijos();
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
  }

  nuevo(){
    this.visible1=true;
  }
  saveNuevo(){
    this.new.CreatedAt=`${moment().format('yyyy-MM-DDTHH:mm:ss')}`
    this.cors.post(`EjecucionDepuracion/guardarPrefijosRegionDepuracion`,this.new)
		.then((response) => {
		  this.messageService.add({
			key: 'tst',
			severity: 'success',
			summary: 'Exito!!!',
			detail: 'Guardado con Exito',
		  });
		this.getPrefijos();
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
    this.visible1=false;
    this.new={
      region:null,
      subregion:null,
      hub:null,
      plaza:null,
      rpt:null,
      hubOrden:null,
      prefijo:null,
      Cve_usuario:this.usuario.email,
      CreatedAt:null
    };

  }

}
