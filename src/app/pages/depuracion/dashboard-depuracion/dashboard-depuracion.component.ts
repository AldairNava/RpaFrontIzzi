import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CorsService } from '@services';
import * as moment from 'moment';
moment.lang('es');
import { Message, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';


@Component({
  selector: 'dashboard-depuracion',
  templateUrl: './dashboard-depuracion.component.html',
  styleUrls: ['./dashboard-depuracion.component.scss']
})
export class DashboardDepuracionComponent implements OnInit {
	horarios:any[]=[];
	first:any=null;
	second:any=null;
	tablaDepuracion:any[]=[];
	loading: boolean = false
	show:boolean=false;
	url1:any;
	archivoSeleccionado:string="";
	loading2:boolean=false;
	time:any=null;
	timeCI:any=null;
	timeCF:any=null;
	nuevo:boolean=false;
  
  
	constructor(private cors: CorsService,private messageService: MessageService,private http:HttpClient) {
		
	}

	ngOnInit(): void {
		this.visualizarHorarios();
		this.getTabladepuracion();
	}

	visualizarHorarios(){
		this.cors.get('EjecucionDepuracion/getHoursDepuracion')
		.then((response) => {
			// console.log(response)

		  if(response[0]=="SIN INFO"){
			this.horarios = [];
		  }else{
			  this.horarios = response;
		  }
		//   this.messageService.add({
		// 	key: 'tst',
		// 	severity: 'success',
		// 	summary: 'Exito!!!',
		// 	detail: 'Datos guardados',
		//   });
		})
		.catch((error) => {
		console.log(error)
		//   this.messageService.add({
		// 	key:'tst',
		// 	severity: 'error',
		// 	summary: 'No se logro guardar',
		// 	detail: 'Intenta Nuevamente!!!',
		//   });
		});

	}

	changeHorarios(event:any){
		this.first = event;
		// console.log(this.first)
	}

	changeTime(event:any){
		this.second = moment(event).format('HH:mm:00 a');
	}
	changeTime2(event:any){
		this.time = moment(event).format('HH:mm:00 a');
	}
	changeTime3(event:any){
		this.timeCI = moment(event).format('HH:mm:00 a');
	}

	changeTime4(event:any){
		this.timeCF = moment(event).format('HH:mm:00 a');
	}

	enviar(){
		let filt = this.horarios.filter(item=>{
			return item.id == this.first
		});
		let a ={
			"id":this.first,
			"horario":this.second,
			"corteInicio":filt[0].corteInicio,
			"corteFin":filt[0].corteFin
		}
		this.cors.put(`EjecucionDepuracion/ActualizaHoursDepuracion?id=${this.first}`,a)
		.then((response) => {
		//   console.log(response)
		  this.messageService.add({
			key: 'tst',
			severity: 'success',
			summary: 'Exito!!!',
			detail: 'Horario Editado',
		  });
		  this.visualizarHorarios();
		})
		.catch((error) => {
		console.log(error)
		  this.messageService.add({
			key:'tst',
			severity: 'error',
			summary: 'No se logro actualizar',
			detail: 'Intenta Nuevamente!!!',
		  });
		});
		this.first =null;
		this.second =null;
	}

	getTabladepuracion(){
		this.cors.get('EjecucionDepuracion/getEjecucionDepuracion')
		.then((response) => {
			// console.log(response)
			if(response[0]=="SIN INFO"){
				this.tablaDepuracion = [];
			}else{
				for(let i =0;i<response.length;i++){
					if(response[i].procesando == "1"){
						response[i].procesando = "Si"
					}else{
						response[i].procesando="No"
					}
				}
			  	this.tablaDepuracion = response;
			}
		//   this.messageService.add({
		// 	key: 'tst',
		// 	severity: 'success',
		// 	summary: 'Exito!!!',
		// 	detail: 'Datos guardados',
		//   });
		})
		.catch((error) => {
		console.log(error)
		//   this.messageService.add({
		// 	key:'tst',
		// 	severity: 'error',
		// 	summary: 'No se logro guardar',
		// 	detail: 'Intenta Nuevamente!!!',
		//   });
		});

	}
	onGlobalFilter(table: Table, event: Event) {
		table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
	}

	dateFormat(value:any){
		if(value != null || value != ""){
			return moment(value).format('DD-MM-yyyy HH:mm:ss')
		}else{
			return "---"
		}
	}

	descargarArchivo(archivo:string){
		this.archivoSeleccionado = archivo;
		this.loading2 = true;
	
		this.cors.get2(`EjecucionDepuracion/BajarExcelFTPExtraccionesDepuracion`,{
		  "nombre":archivo
		})
		.then((response) => {
		  // console.log(response)
		  this.show = true;
		  this.url1 = `https://rpabackizzi.azurewebsites.net/EjecucionDepuracion/BajarExcelFTPExtraccionesDepuracion?nombre=${archivo}`;

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
		  console.log(error)
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
	
	eliminar(value:any){
		this.cors.delete(`EjecucionDepuracion/EliminarHoursDepuracion?id=${value}`,{"id":value})
		.then((response) => {
		//   this.messageService.add({
		// 	key: 'tst',
		// 	severity: 'success',
		// 	summary: 'Exito!!!',
		// 	detail: 'Datos guardados',
		//   });
		this.visualizarHorarios();
		})
		.catch((error) => {
		console.log(error)
		//   this.messageService.add({
		// 	key:'tst',
		// 	severity: 'error',
		// 	summary: 'No se logro guardar',
		// 	detail: 'Intenta Nuevamente!!!',
		//   });
		});	
	}

	add(){
		if(this.time != null && this.timeCI != null && this.timeCF!=null){
			this.cors.post(`EjecucionDepuracion/GuardarHoursDepuracion`,{
				"horario":this.time,
				"corteInicio":this.timeCI,
				"corteFin":this.timeCF,
			})
			.then((response) => {
			  this.messageService.add({
				key: 'tst',
				severity: 'success',
				summary: 'Exito!!!',
				detail: 'Hora guardada',
			  });
			this.visualizarHorarios();
			})
			.catch((error) => {
				console.log(error)
				this.messageService.add({
					key:'tst',
					severity: 'error',
					summary: 'No se logro guardar',
					detail: 'Intenta Nuevamente!!!',
				});
			});
			this.time=null;
			this.timeCI=null;
			this.timeCF=null;
			this.nuevo=false;
		}else{
				this.messageService.add({
					key:'tst',
					severity: 'error',
					summary: 'Falta agregar un parametros!',
					detail: 'Intenta Nuevamente!!!',
				});
			}
	}
	
	async con(){
		// http://192.168.61.19:2000/
		this.cors.get3('')
		.then((response) => {
			console.log(response)
		})
		.catch((error) => {
			console.log(error)
		});
	}

}
