import { Component, OnInit, ViewChild } from '@angular/core';
import { CorsService } from '../../../services/cors/cors.service';
import { DarkService } from '../../../services/darkmode/dark.service';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Calendar } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';


@Component({
  selector: 'app-asignacion-individual',
  standalone: false,
  templateUrl: './asignacion-individual.component.html',
  styleUrls: ['./asignacion-individual.component.scss'],
  providers: [MessageService]

})
export class AsignacionIndividualComponent implements OnInit {
  @ViewChild('myCalendar', { static: true }) myCalendar!: Calendar;


  constructor(private cors: CorsService, 
              private dark: DarkService, 
              private router: Router, 
              private route: ActivatedRoute,
              private messageService: MessageService
             ) {}

  mode: boolean = false;

  audios: any[] = [];
  analista: any[] = [];
  nombreAnalista: string = '';
  idAnalista: string = '';


  headers = ['Audio', 'Tipo', 'Asesor', 'ID asesor', 'Revisado', 'Resultados']
  headersPrimero: any[] = ['Id Analista', 'Nombre', 'Puesto']
  headersSegundo: any[] = ['Region', 'Skill', 'Departamento']

  // Filtros
  arrayOriginalAudios: any = [];
  tipo: any[] = [];
  tipoSeleccioando: any = {};
  asesor: any = '';
  fechas: any = [];

  ngOnInit(): void {
    this.tipo = [
      { name: 'Revisado', code: 1 },
      { name: 'Sin revisar', code: 0 },
    ];

    let idAnalista = '';
    
    this.route.params.subscribe(params => {
      idAnalista = params['idAnalista'];
      this.idAnalista = idAnalista;
    });

    this.darkModeSubscription();

    this.getInfoAnalista(idAnalista);

    this.getAudios(idAnalista)
  }

  getInfoAnalista(idAnalista: string) {
    const data = {
      controlador: 'AsignacionesController',
      metodo: 'getAnalista',
      idAnalista
    }
    this.cors.post(data).subscribe(
      (res: any) => {
        this.nombreAnalista = res.analista[0].nombre;
        this.analista[0] = res.analista[0]; // Convertir el objeto en un arreglo
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  getAudios(idAnalista: string) {
    const data = {
      controlador: 'AsignacionesController',
      metodo: 'getAudios',
      idAnalista
    }
    this.cors.post(data).subscribe(
      (res: any) => {
        this.arrayOriginalAudios = res.audios;
        this.audios = res.audios;
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  filtrando() {
    if(this.fechas.length === 0) {
      this.audios = this.arrayOriginalAudios;
    }

    if(this.asesor != '') {
      this.filtrarAsesor();  
    }

    if(this.fechas.length >= 1) {
      this.filtrarFechas();  
    }

    if(Object.keys(this.tipoSeleccioando).length !== 0) {
      this.filtrarStatus();
    }
  }

  filtrarAsesor() {
    let numeros: boolean = false;
    let letras: boolean = false;

    numeros = /\d/.test(this.asesor);
    letras = /^[a-zA-Z\s]+$/.test(this.asesor);

    if(numeros) {
      this.audios = this.audios.filter((audio: any) => {
        return audio.idAsesor.includes(this.asesor);
      });
    }

    if(letras) {
      this.audios = this.audios.filter((audio: any) => {
        return audio.nomAsesor.toLowerCase().includes(this.asesor.toLowerCase());
      });
    }
  }

  // filtrarFechas() {
  //   const fechaIniFormateada = format(this.fechas[0], 'yyyy-MM-dd');
    
  //   if(this.fechas[1]) {
  //       const fechaFinFormateada = format(this.fechas[1], 'yyyy-MM-dd');
      
  //       this.audios = this.audios.filter((audio: any) => {
  //           const fechaAudio = format(audio.fecha_llamada, 'yyyy-MM-dd');
  //           return fechaAudio >= fechaIniFormateada && fechaAudio <= fechaFinFormateada;
  //       });

  //       this.myCalendar.hideOverlay();
  //   }
  // }

  filtrarFechas() {
    const fechaIniFormateada = moment(this.fechas[0]).format('YYYY-MM-DD');
    
    if(this.fechas[1]) {
        const fechaFinFormateada = moment(this.fechas[1]).format('YYYY-MM-DD');
      
        this.audios = this.audios.filter((audio: any) => {
            const fechaAudio = moment(audio.fecha_llamada).format('YYYY-MM-DD');
            return fechaAudio >= fechaIniFormateada && fechaAudio <= fechaFinFormateada;
        });

        this.myCalendar.hideOverlay();
    }
}

  filtrarStatus() {
    this.audios = this.audios.filter((audio: any) => {
      return audio.revisado_analista.toString() === this.tipoSeleccioando.code.toString();
    });
  }

  limpiarFiltros() {
    this.asesor = '';
    this.fechas = [];
    this.tipoSeleccioando = {};


    this.audios = this.arrayOriginalAudios;
  }

  actualizaRevisado(audio: any) {
    const data = {
      controlador: 'AsignacionesController',
      metodo: 'actualizaRevisado',
      'audio_name': audio.audio_name
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        const { audio_name, guia} = audio;

        if(res.status) {
          this.router.navigate(['/analizar/resultados', audio_name, guia, this.idAnalista]);
        } else {
          this.router.navigate(['/analizar/resultados', audio_name, guia, this.idAnalista]);
        }
      },
      (err: any) => {
        this.showMessage('error', 'Error', 'Hubo un error, por favor informa al administrador');
      }

    )
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
    // severity = logo, summary = Encaebzado, detail = Mensaje
  }

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
    });
  }
}
