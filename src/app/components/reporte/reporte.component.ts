import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { Router } from '@angular/router';
import { CorsService } from '../../services/cors/cors.service';
import { MessageService } from 'primeng/api';

import { DarkService } from '../../services/darkmode/dark.service';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  providers: [MessageService]
})
export class ReporteComponent implements OnInit {
  @ViewChild('myCalendar', { static: true }) myCalendar!: Calendar;

  tipo: { name: string }[] = [
    { name: 'Servicios' },
    { name: 'Soporte' },
    { name: 'Retenciones' }
  ];

  tipoSelected: any;


  
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  fechas: any[] = [];

  fechasCompletas: boolean = false;

  generando: boolean = false;

  resporteListo: boolean = false;

  owner: string = 'izzi';

  base64Data: any;

  mode: boolean = false;

  showCalendar: boolean = false;

  userName: string = '';

  ngOnInit(): void {
    this.darkModeSubscription();

    this.items = [{ label: 'Analizar Audios' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' }; 
    const name = sessionStorage.getItem('user_id');

   if( name ) {
    this.userName = name
   }

  //  this.generarApi();

  }

  // generarApi() {
  //   const data = {
  //     "ini": "2024-12-01",
  //     "fin": "2024-12-31"
  //   }

  //   this.http.post('https://rpabackizzi.azurewebsites.net/apiMariana/generarRegistros', data).subscribe(
  //     (res: any) => {
  //       // console.log(res)
  //     },
  //     (err: any) => {
  //       // console.log(err)
  //     }
  //   )
  // }

  constructor(private cors: CorsService, 
    private dark: DarkService, 
    private messageService: MessageService,
    private router: Router) {}

    validaTipo() {
      if(this.tipoSelected) {
        this.showCalendar = true;
      }
    }

  seleccionaFechas() {
    if(this.fechas[1] != null ) {
      this.fechasCompletas = true;
      // // console.log(this.myCalendar)
      this.myCalendar.hideOverlay(); 
    }
  }

  generar() {
    const fechaIni = this.convertirFecha(this.fechas[0], 'ini');
    const fechaFin = this.convertirFecha(this.fechas[1], 'fin');

    this.generando = true;

    const data = {
      owner: 'izzi',
      ini: fechaIni,
      fin: fechaFin,
      tipo: this.tipoSelected.name.toLowerCase(),
      controlador: 'ReportesDinamicoController',
      metodo: 'validaLlamarReporte'
    }

    this.generateVentas(data);
  }

  generateVentas(data: any) {
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.generarReporte(data);
        } else {
          this.showMessage('warn', 'Aviso', 'No se han encontrado resultados para generar el reporte con los parámetros seleccionados.');
          this.generando = false;
        }

      },
      (err: any) => {
        // console.log(err)
      }
    )
  }

  generarReporte(data: any) {
    data.controlador = 'ReportesDinamicoController';
    data.metodo = 'probandoReporte';
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.base64Data = this.base64toBlob(res.base64);
        } else {
          this.showMessage('error', 'Error', 'No ha sido posible generar el reporte, contacta al administrador.');
        }

      },
      (err: any) => {
        // console.log(err);
        this.showMessage('error', 'Error', 'No ha sido posible generar el reporte, contacta al administrador.');

      }
    )
  }
  base64toBlob(base64Data: string, contentType: string = 'application/octet-stream'): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    this.resporteListo = true;
    return new Blob(byteArrays, { type: contentType });
  }

  descargar() {
    const blob = this.base64Data;
  
    // Crear un objeto Blob con el tipo MIME adecuado
    const file = new Blob([blob], { type: 'application/octet-stream' });
  
    // Crear un enlace 'a' para descargar
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(file);
    a.download = `Reporte de llamadas Tipo: ${this.tipoSelected.name}.xlsx`;
    // a.download = `Reporte_General_Izzi_${this.fullDate}_${this.user}.xlsx`;
  
    // Anexar el enlace al cuerpo y hacer clic en él
    document.body.appendChild(a);
    a.click();
    // this.showMessage('success', 'Éxito', 'Reporte descargado exitosamente');

  
    // Limpiar después de la descarga
    document.body.removeChild(a);
    window.URL.revokeObjectURL(a.href);
  }



  convertirFecha(fecha: any, tipo: string) {
    const fechaOriginal = new Date(fecha);
  
    const nuevaFecha = new Date(fechaOriginal);
    nuevaFecha.setDate(fechaOriginal.getDate());
  
    // Paso 3: Formatear la nueva fecha en el formato "yyyy-MM-dd"
    const año = nuevaFecha.getFullYear();
    const mes = String(nuevaFecha.getMonth() + 1).padStart(2, '0');
    const dia = String(nuevaFecha.getDate()).padStart(2, '0');
  
    if(tipo === 'ini') {
      return `${año}-${mes}-${dia} 00:00:00`;
    } else {
      return `${año}-${mes}-${dia} 23:59:59`;
    }
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
    // severity = logo, summary = Encaebzado, detail = Mensaje
  }

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
      // // console.log('Modo oscuro cambiado:', this.mode);
    });
  }

}
