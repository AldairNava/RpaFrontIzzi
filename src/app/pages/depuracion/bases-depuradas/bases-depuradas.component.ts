import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { CorsService } from '@services';
import * as moment from 'moment';
moment.lang('es');
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'bases-depuradas',
  templateUrl: './bases-depuradas.component.html',
  styleUrls: ['./bases-depuradas.component.scss']
})
export class BasesDepuradasComponent implements OnInit {
  detalle=[
	"Caso de Negocio",
	"Ordenes de Servicio"
  ];
  uploadedFiles: any[] = [];
  basesTabla:any[]=[];
  loading: boolean = false
  show:boolean=false;
  url1:any;
  archivoSeleccionado:string="";
  loading2:boolean=false;



  constructor(private cors: CorsService,private messageService: MessageService) { }

  ngOnInit(): void {
    this.getTablaBases();
  }
  uploadfun(event:any) {
    for(let file of event.files) {
      this.uploadedFiles.push(file);
    }
    // // console.log(this.uploadedFiles)
  
    // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  getTablaBases(){
		this.cors.get('EjecucionDepuracion/getBasesDepuracion')
		.then((response) => {
		  if(response[0] == "SIN INFO"){
			  this.basesTabla = [];
		  }else{
			  this.basesTabla = response;
		  }
		//   this.messageService.add({
		// 	key: 'tst',
		// 	severity: 'success',
		// 	summary: 'Exito!!!',
		// 	detail: 'Datos guardados',
		//   });
		})
		.catch((error) => {
		// console.log(error)
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
		this.cors.get1(`EjecucionDepuracion/BajarExcelFTPBasesDepuradas`,{
		  "nombre":archivo
		})
		.then((response) => {
		  // // console.log(response)
		  this.show = true;
		  this.url1 = `https://rpabackizzi.azurewebsites.net/EjecucionDepuracion/BajarExcelFTPBasesDepuradas?nombre=${archivo}`;

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
