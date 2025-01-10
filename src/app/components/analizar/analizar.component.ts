import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CorsService } from '../../services/cors/cors.service';
import { DarkService } from '../../services/darkmode/dark.service';

import { ProgressBarModule } from 'primeng/progressbar';

import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Calendar } from 'primeng/calendar';

import Swal from 'sweetalert2'

interface Tipo {
  name: string;
  code: number;
}

@Component({
  selector: 'app-analizar',
  templateUrl: './analizar.component.html',
  styleUrls: ['./analizar.component.scss'],
  providers: [MessageService, ProgressBarModule]
})
export class AnalizarComponent implements OnInit {
  @ViewChild('myCalendar', { static: true }) myCalendar!: Calendar;



  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  headers: any[] | undefined;


  constructor(private cors: CorsService, 
              private messageService: MessageService,
              private dark: DarkService,
              private router: Router) {}

  ngOnInit(): void {
    this.darkModeSubscription();

    this.items = [{ label: 'Analizar Audios' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    const user = sessionStorage.getItem('user_id');

    if(user) {
      this.user = user;

      this.fetchData(this.user)
    }

    this.tipo = [
      { name: 'Analizado', code: 1 },
      { name: 'No Analizado', code: 0 },
    ];

    

    this.selectedTipo = this.tipo[1];

    this.headers = [
      'Nombre del Archivo',
      'Acciones',
      'Reproducido',
      'Analizado',
      'Resultados',
    ]

  }

  /* Zona de variables */

  audios_data: any;
  audios: any[] = [];
  dataLoaded = false;

  ruta: string = 'http://172.24.251.249:154/api/audios/';

  analyzeAll: boolean = false;
  
  audioStatus: string = '';

  // Modal window bot working
  analyzing: boolean = false;
  starting: boolean =  false;
  recovering: boolean = false;
  transcribe: boolean = false;
  context: boolean = false;
  score: boolean = false;
  done: boolean = false;
  doneFinal: boolean = false;
  error: boolean = false;

  // Modal window results
  visibleModal: boolean = false;
  tempName: string = '';

  // Process
  stopProcess: boolean = false;

  // Progress Bar
  value: number = 5;

  /* Masivo */
  consultarMasivo: boolean = true;
  esMasivo: boolean = false;

  analyzingMasivo: boolean = false;
  startingMasivo: boolean = false;

  doneFinalMasivo: boolean = false;
  ejecutandoMasivo: boolean = false;

  /* no hay audios para recuperar */
  emptyAudios: boolean = false;

  /* USUARIOS DE VENTAS / ATN */
  ventas: boolean = false;
  atn: boolean = false;
  calidad: boolean = false;
  user: any;

  /* Filtros Israel */
  tipoAudio: any = null;
  tipoAudioText: any;
  tipoSelected: boolean = false;

  /* Filtrar audios por fecha */
  rangeDates: any;

  // Masivo
  masivo: boolean = false;
  textoMasivo: boolean = false;

  // Filtros
  originalArray: any[] = [];
  filteredArray: any[] = [];
  filterAudioInput: string = '';

  tipo: Tipo[] = [];

  selectedTipo: any = '';

  fechas: any[] = [];

  mode: boolean = false;

  guiaSelected: any;
  switchDisabled: boolean = false;


 fetchData(owner: any) {
    const data = {
      controlador: 'AudiosController',
      metodo: 'index',
      owner: owner
    }
    this.cors.post(data).subscribe(
      (response: any) => {
        if(response.status) {
          this.originalArray = response.data;
          this.filtrarStatus(this.tipo[1]);
        } else {
          this.showMessage('warn', 'Aviso', 'No hay audios para recuperar en la base de datos');
        }

      },
      (error: any) => {
        console.error('Error retrieving audio data:', error);
      }
    );
  }

  fetchDataMasivo() {
    const currentSession = sessionStorage.getItem('user_id');

    const data = {
      controlador: 'AudiosController',
      metodo: 'returnArrayMasivo',
      owner: currentSession
    }
    this.cors.post(data).subscribe(
      (response: any) => {
        if(response.status) {
          this.audios = response.data;
          this.validateData();
        } else {
          this.showMessage('warn', 'Aviso', 'No hay audios para recuperar en la base de datos');
          this.audios = [];
        }

      },
      (error: any) => {
        console.error('Error retrieving audio data:', error);
      }
    );

  }




  validateData() {
      if(this.audios.length === 0 ) {
          this.showMessage('warn', 'Aviso', 'No hay audios para recuperar en la base de datos');
          this.emptyAudios = true;
      } else {
          this.showMessage('success', 'Fantástico', `Se han recuperado ${this.audios.length} audios con éxito`);
          this.emptyAudios = false;
          this.dataLoaded = true; // Marcar los datos como cargados

      }
  }

  processAudio(audio: any) {
    audio.hasInstance = true;
    const audioUrl = `${this.ruta}`+audio.name;
    audio.instance = new Audio(audioUrl);
    audio.instance.play();
    audio.isPlaying = true;

    if ( audio.played === 0 ) {
        audio.played = 1;
        const audioPlayedStatus = audio.played;
        const audioName = audio.name;

        const data = {
          played: audioPlayedStatus,
          name: audioName
        }

        this.updatePlayed(data);
    }
  }

    audioControls(audio: any) {
      if(!audio.isPlaying) {
        audio.instance.play();
        audio.isPlaying = true;
      } else {
        audio.instance.pause();
        audio.isPlaying = false;
      }
    }

    /* Función que inicia el proceso de analisis normal */
    analyze(audio: any) {
      this.tempName = audio.name;
      this.guiaSelected = audio.guia;

      if( audio.analyzed === 1 ) {
        this.confirm(audio);
      }

      if( audio.analyzed === 0 ) {
        this.analyzing = true;
        this.starting = true;

        this.updateStatusPendiente(audio);
        this.value = 0;

        this.analyzePython(audio);

        const data = {
          name: audio.name,
          analyzed: 1
        }

        setTimeout( () => {
          this.analyzingProcess(audio);
          this.getStatus(data);
        }, 2000)

      }
    }

    updateAnalyzed(data: any) {
      data.controlador = 'AudiosController';
      data.metodo = 'updateAnalyzed';
      this.cors.post(data)
      .subscribe(
        (response) => {
          // console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
    }

    updatePlayed(data: any) {
      data.controlador = 'AudiosController';
      data.metodo = 'updatePlayed';
      this.cors.post(data)
      .subscribe(
        (response) => {
          // console.log(response);
          // console.log(data)
        },
        (error) => {
          console.error(error);
        }
      );
    }

    analyzePython(audio: any) {
      const data = {
        controlador: 'AudiosController',
        metodo: 'analyzarPython',
        name: this.tempName,
        analyzed: 1,
        type: 'individual',
        guia: audio.guia
      }

      this.cors.post(data).subscribe(
        (res: any) => {
          if(res.message.includes('recibida y encolada')) {
            console.log(res.message);
          } else {
            console.log('No hay respuesta del bot')
          }
        },
        (error: any) => {
          this.updateStatusPendiente(audio);
          console.log(error);
          const code = error.status
          const errorText = error.statusText;
          console.log(errorText)
          this.showMessage('error', 'Alerta', 'No fue posible iniciar el proceso, contacte al administrador');
          // setTimeout(() => {
          //   this.recargarPagina();
          // }, 3000);
        }
      )
    }


    analyzingProcess(audio: any) {
        this.tempName = audio.name;


        if(audio.hasInstance) {
          audio.instance.pause();
          audio.isPlaying = false;
        }

        const data = {
          name: this.tempName
        }
        setTimeout(() => {
          this.processAnimations(data);
          this.getStatus(data);
          audio.analyzed = 1 ;
        }, 1000);
    }

    processAnimations(data: any) {
      /* Data solo incluye el nombre del archivo */
      if(this.stopProcess === false) {

        if( this.audioStatus === 'Pendiente' ) {
          this.getStatusRecursive(data);
          this.value = 5;
        }

        if( this.audioStatus === 'Transcribiendo' ) {
          this.starting = false;
          this.transcribe = true;
          this.value = 20;
          this.getStatusRecursive(data);
        }

        if ( this.audioStatus === 'Calificando') {
          this.starting = false;
          this.transcribe = false;

          this.score = true;
          this.value = 38;
          this.getStatusRecursive(data);
        }

        if( this.audioStatus === 'Contextualizando' ) {
          this.starting = false;
          this.transcribe = false;
          this.score = false;
          this.context = true;
          this.value = 80;
          this.getStatusRecursive(data);
        }

        if( this.audioStatus === 'Completado' ) {
          this.starting = false;
          this.transcribe = false;
          this.score = false;
          this.context = false;
          this.done = true;
          this.value = 100;

          const data = {
            name: this.tempName,
            analyzed: 1,
            type: 'individual'
          }

          this.updateAnalyzed(data);

          setTimeout(() => {
            this.done = false;
            this.doneFinal = true;
            this.deleteFiles();
          }, 5000);
        }

        if( this.audioStatus === 'Error' ) {
          this.starting = false;
          this.recovering = false;
          this.transcribe = false;
          this.context = false;
          this.score = false;
          this.error = true;

          setTimeout(() => {
            this.analyzing = false;
            this.error = false;
          }, 5000);

          this.showMessage('error', 'Error', 'Falló al hacer el análisis, contacta al administrador');
        }
      } else {
        console.log('detiene el proceso')
      }
    }

    getStatusRecursive(data: any) {
      this.getStatus(data);
      console.log(`Status Actual: ${this.audioStatus}`);

      setTimeout(() => {
        this.processAnimations(data);
      }, 1000);
    }

    updateStatusPendiente(audio: any) {
      const data = {
        controlador: 'AudiosController',
        metodo: 'setStatusPendiente',
        name: audio.name
      }
      this.cors.post(data).subscribe(
        (response: any) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      )
    }

    updateStatusPendienteMasivo(name: any) {
      const data = {
        controlador: 'AudiosController',
        metodo: 'setStatusPendiente',
        name: name
      }
      this.cors.post(data).subscribe(
        (response: any) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      )
    }

    closeModal() {
      this.analyzing = false;
      this.doneFinal = false;
      this.doneFinalMasivo = false;
      this.analyzeAll = false;

      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }

    showResult() {
      this.doneFinal = false;
      this.analyzing = false;
      this.visibleModal = true;
    }



    getStatus(data: any) {
      data.controlador = 'AudiosController';
      data.metodo = 'getStatus';
      this.cors.post(data).subscribe(
        (response: any) => {
          this.audioStatus = response.status;
        }, (error) => {
          console.log(error)
        }
      )
    }

    redirectFullResults(audio: any) {
      if(audio.analyzed === 1) {
        this.router.navigate(['/analizar/resultados', audio.name, audio.guia, 'main']);
      }
    }

    redirectFullResultsModal() {
      const data = {
        controlador: 'AudiosController',
        metodo: 'getGuia',
        audio_name: this.tempName
      }
      this.cors.post(data).subscribe(
        (res: any) => {
          this.router.navigate(['/analizar/resultados', this.tempName, res.res]);
        },
        (err: any) => {
          console.log(err)
        }
      )
    }

    updateDeleted(audio: any) {
      const data = {
        controlador: 'AudiosController',
        metodo: 'updateDeleted',
        name: audio.name
      }

      this.cors.post(data).subscribe(
        (res: any) => {
          if (res.status) {
            this.showMessage('success', 'Fantástico', 'Ha eliminado con éxito');
            const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          } else {
            1
          }

        },
        (err: any) => {
          console.log(err)
        }
      )
    }

    confirm(audio: any) {
      Swal.fire({
        title: "¿Desea analizar el audio de nuevo?",
        showDenyButton: true,
        confirmButtonText: "Analizar",
        denyButtonText: `Cancelar`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          audio.analyzed = 0;
          this.analyze(audio);
          console.log(audio)
          this.guiaSelected = audio.guia;
        }
      });
    }

  recargarPagina() {
    const currentUrl = this.router.url;
    this.reDefineAnalyzedAndStatus();
    window.location.reload();    
  }

  reDefineAnalyzedAndStatus() {
    const data = {
      name: this.tempName,
      analyzed: 0
    }

    this.updateAnalyzed(data);
  }

  deleteFiles() {
    let nombreSinExtension = this.tempName.split(".")[0];

    const data = {
      controlador: 'AudiosController',
      modelo: 'deleteFiles',
      name: nombreSinExtension
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        console.log(res)
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  setMode() {
    if(this.analyzeAll) {
      this.esMasivo = true;
      this.setMasivo();
      setTimeout(() => {
        this.fetchDataMasivo();
      }, 500);
    } else {
      this.esMasivo = false;
      const currentSession = sessionStorage.getItem('user_id');
      this.unsetMasivo();
      setTimeout(() => {
        this.fetchData(currentSession);
      }, 500);
    }
  }


  analizaMasivo() {
    this.startingMasivo = true;
    this.ejecutandoMasivo = true;
    const owner = sessionStorage.getItem('user_id');

    const data = {
      controlador: 'AudiosController',
      modelo: 'returnNoAnalyzed',
      owner
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          console.log(res)
          if(res.names.length === 0) {
            this.showMessage('warn', 'Aviso', 'No hay audios disponibles para analizar en este momento');
          } else {
            this.analyzeAllAudios(res.names);
            this.analyzingMasivo = true;
          }
        } else {
          
        }
      },
      (err: any) => {
        console.log(err);
      }
    )
  }
  
  getStatusMasivo(names: any) {
    this.startingMasivo = false;
    this.analyzingMasivo = false;
    this.checkStatusMasivo(names)
  }

  analyzeAllAudios(names: any) {

    const data = {
      controlador: 'AudiosController',
      modelo: 'analyzarPython',
      'names': names, 
      'type': 'masivo'
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.message.includes('recibida y encolada')) {
          names.forEach((name: any) => {
            console.log(name);
            this.updateStatusPendienteMasivo(name.name);
          });

          setTimeout(() => {
            this.getStatusMasivo(names);
            this.analyzingMasivo = false;
            this.textoMasivo = true;
            this.esMasivo = true;
          }, 5000);


        } else {
          console.log('Falló al asignar la tarea')

        }
      },
      (error: any) => {
        console.log('Sin respuesta del bot')
        this.showMessage('error', 'Alerta', 'Error al comunicarse con el bot, por favor contacte al administrador');
        this.startingMasivo = false;
        this.analyzingMasivo = false;
        /* Cachar error cuando pasa algo con el bot */
          const code = error.status
          const errorText = error.statusText;

          if(errorText === 'INTERNAL SERVER ERROR') {
            this.value = 0;
            this.showMessage('error', 'Alerta', `Error, ${code} ${errorText}, Hubo un error en la ejecución`);
            this.stopProcess = true;
            setTimeout(() => {
              this.recargarPagina();
            }, 3000);
            // console.log('Error del server' + ' ' + `${code}` + ' ' + `${errorText}`)
          }

          if(error.name === 'HttpErrorResponse' && error.status === 0 && error.statusText === 'Unknown Error') {
            this.value = 0;
            // console.log('No hay conexión con el bot' + ' ' + error.message);
            this.showMessage('error', 'Alerta', 'No hay conexión con el bot, contacte al administrador');
            this.stopProcess = true;
            setTimeout(() => {
              this.recargarPagina();
            }, 3000);
          }
      }
    )
  }

  setMasivo() {
    const owner = sessionStorage.getItem('user_id');

    const data = {
      controlador: 'AudiosController',
      modelo: 'updateMasivo',
      owner: owner, 
      audios: this.audios
    }

    this.cors.post(data).subscribe(
      (res:any) => {
        if(res.status) {
          this.analizaMasivo();
        }
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

  unsetMasivo() {
    const owner = sessionStorage.getItem('user_id');

    const data = {
      controlador: 'AudiosController',
      metodo: 'unsetMasivo',
      owner: owner
    }

    this.cors.post(data).subscribe(
      (res:any) => {

      },
      (err: any) => {
        console.log(err)
      }
    )
  }


  contadorFuera: number = 0;

  checkStatusMasivo(names: any) {
    console.log(names)
      const owner = sessionStorage.getItem('user_id');
      let audios: any;

      let contadorCompletados = 0;
      console.log('Contador Fuera: ' + this.contadorFuera)

      if(names[0].stop === true) {
        console.log('PARANDOOOOOOOOOOO')
        return;
      } else {
        const data = {
          controlador: 'AudiosController',
          metodo: 'returnStatusMasivo',
          owner: owner, 
          names: names
        }
        this.cors.post(data).subscribe(
          (res: any ) => {
            audios = res.audios;
            this.consultarMasivo = false;
          },
          (err: any) => {
            console.log(err)
          }
        )

      if( this.contadorFuera != names.length ) {
        setTimeout(() => {
          for(let i = 0 ; i < names.length ; i++) {
            if(audios[i].status === 'Pendiente') {
              console.log(`El audio ${audios[i].audio_name} está Pendiente`)
              this.audios[i].progress = 1;
            }
    
            if(audios[i].status === 'Transcribiendo') {
              console.log(`El audio ${audios[i].audio_name} está Transcribiendo`)
              this.audios[i].progress = 20;
            }
    
            if(audios[i].status === 'Calificando') {
              console.log(`El audio ${audios[i].audio_name} está Calificando`)
              this.audios[i].progress = 38;
            }
  
            if(audios[i].status === 'Contextualizando') {
              console.log(`El audio ${audios[i].audio_name} está Contextualizando`)
              this.audios[i].progress = 80;
            }
    
            if(audios[i].status === 'Completado') {
              contadorCompletados++;
              this.contadorFuera = contadorCompletados;

              this.audios[i].progress = 100;
              this.audios[i].analyzed = 1;
  
              const data = {
                name: audios[i].audio_name,
                analyzed: 1
              }

              this.updateAnalyzed(data);

              console.log(`El audio ${audios[i].audio_name} está Completado`)

              if( contadorCompletados === names.length ) {
                this.showMessage('success', 'Éxito', 'Se han analizado todos los audios');
                this.doneFinalMasivo = true;
                this.ejecutandoMasivo = false;
              }
            }

            // if( audios[i].status === 'Completado' ) {
            //   console.log('Un audio está con status de error')
            // }
          }
        }, 2000);

        setTimeout(() => {
          this.getStatusMasivo(names)
        }, 5000);
      } else {
        this.showMessage('success', 'Éxito', 'Se han analizado todos los audios');
        this.doneFinalMasivo = true;
        this.textoMasivo = false;
      }
        

      }
    
  }

  filtrar() {
    this.tipoAudioText = this.tipoAudio.name;

    const data = {
      controlador: 'audiosController',
      metodo: 'filterCalidad',
      'tipo': this.tipoAudioText
    }


    this.cors.post(data).subscribe(
      (res: any) => {
        this.audios = res.data;
        this.validateData();
      },
      (err: any) => {
        console.log(err)
      }
    )
  }





  validaMasivo() {
    Swal.fire({
      title: '¿Deseas analizar todos los audios?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed ) {
        this.showMessage('success', '¡Excelente!', 'Se analizarán masivamente')
        this.setMasivo();
      }
      
      if (result.isDenied) {
        Swal.fire('Has cancelado', '', 'info');
        this.masivo = false;
      }
    })
  }


  filtrando() {

    const name: string = this.filterAudioInput.trim().toUpperCase();
    const status: any = this.selectedTipo;
    const fechas = this.fechas;

    // console.log(name);
    // console.log(status);
    // console.log(fechas);
    
    // No hay nada que filtrar
    if(name === '' || status === '' && fechas.length === 0) {
      this.audios = this.originalArray;
    }

    // Solo se filtra por nombre
    if(name != '' && status === '' && fechas.length === 0) {
      this.filtrarNombre(name);
    }

    // Solo se filtra por status
    if(name === '' && status != '' && fechas.length === 0) {
      this.filtrarStatus(status);
    }

    // Solo se filtra por fecha de carga
    if(name === '' && status === '' && fechas.length != 0) {
      this.filtrarFecha(fechas);
    }

    // Se filtra por nombre y status
    if(name != '' && status != '' && fechas.length === 0) {
      this.filtrarNombreyStatus(name, status);
    }

    // Se filtra por nombre y fecha
    if(name != '' && status === '' && fechas.length != 0) {
      this.filtrarNombreyFecha(name, fechas);
    }

    // Se filtra por status y fecha
    if(name === '' && status != '' && fechas.length != 0) {
      this.filtrarStatusyFecha(status, fechas);
    }

    // Se filtra por nombre, status y fecha de carga
    if(name != '' && status != '' && fechas.length != 0) {
      console.log('todos los filtros')
    }
  }

  filtrarNombre(name: string) {
    this.filteredArray = [];

    this.audios.forEach((audio) => {

      if (audio.name.toUpperCase().includes(name) || audio.name === name) { // Replace 'someProperty' with the actual property to filter by
        this.filteredArray.push(audio);
      }
    });

    this.audios = this.filteredArray;
    this.filteredArray = [];

  }

  filtrarStatus(status: any) {
    this.filteredArray = [];

    const audioStatusSelected = status.code

    this.originalArray.forEach((audio) => {
      if (Number(audio.analyzed) === audioStatusSelected) { 
        this.filteredArray.push(audio)
      }
    });

    this.audios = this.filteredArray;
  }

  filtrarFecha(fechas: any) {
    this.filteredArray = [];

    if(fechas[1] != null) {
      this.myCalendar.hideOverlay();  // Oculta el calendario
    }

    let fechaIni = this.convertirFecha(fechas[0], 'ini');
    let fechaFin = this.convertirFecha(fechas[1], 'fin');

    this.audios.forEach((audio) => {
      if (audio.fecha_carga >= fechaIni && audio.fecha_carga <= fechaFin) { 
        this.filteredArray.push(audio)
      }
    });

    this.audios = this.filteredArray;
    this.filteredArray = [];

  }

  filtrarNombreyStatus(name: string, status: any) {
    this.audios = this.originalArray;
    this.filteredArray = [];

    const analyzed = status.code;

    if(status != '') {
      this.audios.forEach((audio) => {
        if (audio.analyzed === analyzed) { 
          this.filteredArray.push(audio)
        }
      });
  
      this.audios = this.filteredArray;
      this.filteredArray = [];

    }

    if(name != '') {
      this.filteredArray = [];

      this.audios.forEach((audio) => {
        if (audio.name.toUpperCase().includes(name)) { 

          this.filteredArray.push(audio);
        }
      });
  
      this.audios = this.filteredArray;
      this.filteredArray = [];

    }
  }

  filtrarNombreyFecha(name: string, fechas: any) {
    this.filteredArray = [];
  
    if(name != '') {
      this.audios.forEach((audio) => {
        if (audio.name.toUpperCase().includes(name)) { // Replace 'someProperty' with the actual property to filter by
          this.filteredArray.push(audio);
        }
      });
  
      this.audios = this.filteredArray;
  
      this.filteredArray = [];
    }

    if(fechas.length != 0) {
      let fechaIni = this.convertirFecha(fechas[0], 'ini');
      let fechaFin = this.convertirFecha(fechas[1], 'fin');

      if(fechas[1] != null) {
        this.myCalendar.hideOverlay();  // Oculta el calendario
      }
  
      this.audios.forEach((audio) => {
        if (audio.fecha_carga >= fechaIni && audio.fecha_carga <= fechaFin) { 
          this.filteredArray.push(audio)
        }
      });
  
      this.audios = this.filteredArray;
      this.filteredArray = [];
    }
  }

  filtrarStatusyFecha(status: any, fechas: any) {
    this.filteredArray = [];

    const analyzed = status.code;

    if(status != '') {
      this.audios.forEach((audio) => {
        if (audio.analyzed === analyzed) { 
          this.filteredArray.push(audio)
        }
      });
  
      this.audios = this.filteredArray;
      this.filteredArray = [];

    }

    if(fechas.length != 0) {
      let fechaIni = this.convertirFecha(fechas[0], 'ini');
      let fechaFin = this.convertirFecha(fechas[1], 'fin');

      if(fechas[1] != null) {
        this.myCalendar.hideOverlay();
      }
  
      this.audios.forEach((audio) => {
        if (audio.fecha_carga >= fechaIni && audio.fecha_carga <= fechaFin) { 
          this.filteredArray.push(audio)
        }
      });
  
      this.audios = this.filteredArray;
      this.filteredArray = [];

    }
  }

  limpiarFiltros() {
    this.filterAudioInput = '';
    this.selectedTipo = '';
    this.fechas = [];
    this.filteredArray = [];

    this.audios = this.originalArray;
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
    // severity = logo, summary = Encaebzado, detail = Mensaje
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

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
    });
  }

}
