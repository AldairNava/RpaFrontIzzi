import { Component, OnInit } from '@angular/core';
import { DarkService } from '../../services/darkmode/dark.service';
import { CorsService } from '../../services/cors/cors.service';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';

interface Guias {
  name: string;
  tabla: string;
}


@Component({
  selector: 'app-cargar',
  templateUrl: './cargar.component.html',
  styleUrls: ['./cargar.component.scss'],
  providers: [MessageService]
})
export class CargarComponent implements OnInit {

  

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  guia: Guias[]  = [];

  tipo: { name: string }[] = [
    { name: 'Servicios' },
    { name: 'Soporte' },
    { name: 'Retenciones'}
  ];

  guiaSelected: any;
  tipoSelected: any;

  constructor(
                private messageService: MessageService,
                private cors: CorsService,
                private router: Router,
                private dark: DarkService,
                private route: ActivatedRoute
              ) { }

    ngOnInit() {

      this.currentSession = sessionStorage.getItem('user_id');

      this.items = [{ label: 'Cargar Audios' }];

      this.home = { icon: 'pi pi-home', routerLink: '/' };

      const segmento = this.route.snapshot.url[1].path;

      if(segmento === 'individual') {
        this.individual = true;
        // this.showGuias = true;
      }

      this.darkModeSubscription();

    }

      
    /* ZONA DE VARIABLES Y CONSTANTES */
    individual: boolean = false;
    /* Para detectar y hacer dinámica la zona drag and drop */
    // Sesión
    currentSession: any;

    // Se encaRga de mostrar el texto y cambiar la clase de dashed
    archivoOn: boolean = false;

    // Para mostrar dinámicamente la zona de carga de audios
    showUploadZone: boolean = false;
    uploading: boolean = false;

    // Para mostrar dinámicamente la tabla cuando se cargaron archivos válidos
    validAudio: boolean = false;

    // Para validar si los archivos cargados son audios, sirve para mostrar una sola alerta
    isAudio: boolean = false;

    // Cada audio es un objeto, si son mas de 1 es un objeto de objetos,
    // Aquí se añadirán a un array junto con una url que se le va a asignar
    audios: any[] = [];

    // Validar si se intenta subir al menos un nuevo archivo
    newFileLoaded:boolean = false;

    // Status inicial de reproducción y análisis
    played: number = 0;
    analyzed: number = 0;

    audioAnalyzed: boolean = false;
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

    // Modal window results
    visibleModal: boolean = false;
    tempName: string = '';

    filesLength: number = 0;
    counterFTP: number = 0;
    forProgress: number = 0;

    // Progress Bar
    value: any = 0;

    /* Modo oscuro */
    mode: boolean = false;

    showGuias: boolean = false;

    validaTipo() {
      if(this.tipoSelected && this.individual) {
        this.showUploadZone = true;
        this.guiaSelected = {tabla: 'guia_set_1'};
      }

      if(this.tipoSelected) {
        this.getGuias();
        this.showGuias = true;
      }
    }

    getGuias() {
      this.guia = [];

      const data = {
        controlador: 'parametrosController',
        metodo: 'getGuias',
        'tipo': this.tipoSelected.name
      }

      this.cors.post(data).subscribe(
          (res: any) => {
              if(res.status) {
                  const guias = res.rows
  
                  guias.forEach((guia: any, index: number) => {
                      let data = {
                          name: guia.proceso,
                          tabla: guia.nombre_tabla
                      }
  
                      this.guia?.push(data);
                  });

                  this.showGuias = true;
              } else {
                // this.showGuias = false;
                this.showUploadZone = false;
                this.guiaSelected = [];
              }
          },
          (err: any) => {
              console.log(err);
          }
      )
    }

    validaGuia() {
      if(this.guiaSelected) {
        this.showUploadZone = true;
      }
    }

    // Método que se activa cuando se arrastran archivos sobre la zona
    onDragOver(event: DragEvent): void {
      event.preventDefault();
      event.stopPropagation();
      this.archivoOn = true;
    }

    // Método que se activa cuando se salen de la zona
    onDragLeave(event: DragEvent): void {
      event.preventDefault();
      event.stopPropagation();
      this.archivoOn = false;
    }

    showSelects: boolean = true;

    // Método que se activa cuando se sueltan archivos sobre la zona
    onDrop(event: DragEvent): void {
      event.preventDefault();
      event.stopPropagation();
      this.archivoOn = false;
      this.showUploadZone = false;
      this.individual = false;
      this.showSelects = false;

      const files = event.dataTransfer?.files;
      if (files && files.length !== undefined) {
        this.filesLength = files.length;

        this.forProgress = Math.floor(100 / files.length);
      }
      console.log(this.forProgress)
      this.createAudiosArray(files);
    }

    selectFiles(): void {
      document.getElementById('file-input')?.click();
    }

    convertBase64(file: any) {
      if(file.type != 'audio/mpeg') {
        // console.log('Estás cargando archivos que no son');
      } else {
        const fileName = file.name;
        const reader = new FileReader();
  
        reader.onloadend = () => {
          const base64Data = reader.result as string;
        
          this.sendBase64ToPHP(base64Data, fileName);
        };
  
        reader.readAsDataURL(file);
      }
    }

    sendBase64ToPHP(base64Data: string, fileName: string) {
      const data = {
        controlador: 'audiosController',
        metodo: 'saveLocalFTP',
        audio: base64Data,
        name: fileName,
      }
      // POST request to save the file on the FTP
      this.cors.post(data).subscribe(
       ( response: any) => {

          if(response.status) {
            this.value = this.value + this.forProgress;
            this.counterFTP++;
          }
          if(this.counterFTP === this.filesLength) {
            this.value = 100;
            this.showMessage('success', 'Éxito', 'Se han cargado sus audios correctamente, redirigiendo');

            setTimeout(() => {
              this.router.navigate(['/analizar']);
            }, 3000);
          }
        },
        error => {
          console.error(error);
          this.showMessage('error', 'Error', 'Ocurrió un error en la carga, por favor contacta al administrador');

        }
      );
    }

    sendAudioInfotoDB() {
      for(let audio of this.audios) {
        audio.controlador = 'AudiosController';
        audio.metodo = 'addNewAudioIzzi';
        this.cors.post(audio).subscribe(
          (response) => {
            console.log(response);
            this.validateExistance(response);
          },
          (error) => {
            console.log(error);
            this.showMessage('warn', 'Aviso', error.error.message);
            this.validateExistance(error);
            this.value = 0;
          }
        )
      }
    }
    
    

    // Validates if the file name uploaded exists on the DB
    
    validateExistance(response: any) {
      const message = response['message'];
      const fileName = response['filename'];
    
      if (message.includes('ya existe en la base de datos')) {
        setTimeout( () => {
          this.showMessage('warn', 'Aviso', `El archivo ${fileName} ya existe en la base de datos, no se cargará en esta vista`);
        }, 2000)
        // Buscar y eliminar archivos existentes del arreglo audios
        const index = this.audios.findIndex(audio => audio.name === fileName);
        if (index !== -1) {
          this.audios.splice(index, 1);
        }
      } else {
        this.newFileLoaded = true;
      }

    }

    createAudiosArray(files: any) {
      if(!this.guiaSelected) {
        this.guiaSelected = {tabla: 'guia_set_1'};
        this.tipoSelected = {name: ''};
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if(file.size === 0) {
          this.showMessage('error', 'Error', `El archivo ${file.name} está vacío o tiene un problema`);
          this.showUploadZone = true;
          this.uploading = false;
        }

        if(file.type != 'audio/mpeg') {
          this.showMessage('error', 'Error', `El archivo ${file.name} no cumple con el formato admitido`);
          this.showUploadZone = true;
          this.uploading = false;
        }

        if( file.type === 'audio/mpeg' && file.size > 0) {
          this.convertBase64(file);
          const url = URL.createObjectURL(file);
          const audioData = { url: url,
                              name: file.name,
                              type: file.type,
                              isPlaying: false,
                              hasInstance: false,
                              instance: '',
                              played: 0,
                              analyzed: 0,
                              owner: this.currentSession,
                              guia: this.guiaSelected.tabla,
                              tipo: this.tipoSelected.name.toLowerCase()
                            };
          this.audios.push(audioData);
        }
      }

      if(this.audios.length > 0 ) {
        this.filesLength = this.audios.length;
        this.forProgress = Math.floor(100 / this.audios.length);
        this.sendAudioInfotoDB();
        this.uploading = true;
        this.showUploadZone = false;
      } else {
        this.showUploadZone = true;
        this.uploading = false;
      }

    }


    validateFiles() {
      let hasInvalidType = false;
      let invalidFileName: string;

      for (const audio of this.audios) {
        if (audio.type !== 'audio/mp3' && audio.type !== 'audio/mpeg') {
          hasInvalidType = true;
          invalidFileName = audio.name;
          break;
        }
      }

      if (hasInvalidType) {
        setTimeout(() => {
          this.showUploadZone = true;
          this.audios = [];
          this.showMessage('error', 'Error', `El archivo ${invalidFileName} no tiene formato admitido`);
        }, 5000);
      }
      
      this.audioLength();
    }

    audioLength() {
      setTimeout(() => {
        if( this.audios.length === 0 ) {
          setTimeout(() => {
            this.showUploadZone = true;
            this.showMessage('error', 'Error', 'Todos los archivos cargados ya existen en la base de datos');
          }, 3000);
        } 
        // else {
        //     this.showMessage('success', 'Éxito', 'Se han cargado sus audios correctamente');
        //     setTimeout(() => {
        //       this.loadingFiles = false; 
        //       this.router.navigate(['/analisis/iniciar']);
        //     }, 2000);
        // }
      }, 6000);
    }


    showMessage(severity: string, summary: string, detail: string) {
      this.messageService.add({ severity: severity, summary: summary, detail: detail });
      // severity = logo, summary = Encaebzado, detail = Mensaje
    }

    // Files selected from the button
    onFilesSelected(event: any) {
      const files = event.target.files;
      this.filesLength = files.length;
      this.forProgress = Math.floor(100 / files.length);

      this.createAudiosArray(files);

      this.archivoOn = false;
      this.showUploadZone = false;
    }

    private darkModeSubscription(): void {
      this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
        this.mode = isDarkModeEnabled;
      });
    }

}
