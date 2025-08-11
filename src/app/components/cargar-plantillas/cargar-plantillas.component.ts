import { Component, OnInit, ViewChild  } from '@angular/core';
import { DarkService } from '../../services/darkmode/dark.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FileUpload } from 'primeng/fileupload';
import { CorsService } from '../../services/cors/cors.service';



@Component({
  selector: 'app-cargar-plantillas',
  templateUrl: './cargar-plantillas.component.html',
  styleUrls: ['./cargar-plantillas.component.scss'],
  providers: [MessageService]
})
export class CargarPlantillasComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  mode: boolean = false;
  items: any[] = [];
  home: any;
  analistas: boolean = false;
  ejecutivos: boolean = false;


  headers: any[] = [
    'No Emp',
    'Nombre',
    'SUPERVISOR',
    'No Emp',
    'LIDER',
    'No Emp',
    'Region',
    'SECCION',
    'Meta Real',
    'Nombre Analista',
    'Antiguedad',
    'Agent Login',
    'No Empleado',
    'Region',
    'Departamento',
    'Puesto OP',
    'SKILL A EVALUAR',
    'Descanso'
  ];

  guardando: boolean = false;


  tipoSelected: any;

  constructor(
    private dark: DarkService, 
    private messageService: MessageService,
    private cors: CorsService
  ) {}

  ngOnInit(): void {
    this.darkModeSubscription();

    this.home = { icon: 'pi pi-home', routerLink: '/' }; 
  }

  onFileSelected(event: any): void {
    const file: File = event.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];

      const datos: any[][] = XLSX.utils.sheet_to_json(hoja, {
        defval: '',
        header: 1
      });

      if (!datos || datos.length === 0) {
        console.error('El archivo está vacío.');
        return;
      }

      const headersLeidosCrudos = datos[0];
      const headersLeidos = this.limpiarHeaders(headersLeidosCrudos);

      if (!this.validarHeaders(headersLeidos)) {
        console.error('Los encabezados no coinciden con los esperados.');
        this.mensajeAdvertencia('Un header es incorrecto, por favor valida la información');
        console.warn('Esperados:', this.headers);
        console.warn('Leídos:', headersLeidos);
        return;
      }

      const filas = datos.slice(1);
      const datosConHeaders = filas.map((fila) =>
        this.headers.reduce((acc, key, i) => {
          acc[key] = fila[i] ?? '';
          return acc;
        }, {})
      );

      // const filas = datos.slice(1);
      const datosSinHeaders = filas.map((fila) =>
      fila.reduce((acc, valor, i) => {
      acc[i] = valor ?? '';
      return acc;
      }, {})
      );


      this.camposAnalistas = datosSinHeaders;

      console.log('Datos cargados del Excel:', datosSinHeaders);
      this.showButton = true;
    };

    reader.readAsArrayBuffer(file);
  }

  private validarHeaders(headersLeidos: any[]): boolean {
    return (
      headersLeidos.length === this.headers.length &&
      headersLeidos.every((h, i) => h === this.headers[i])
    );
  }

  private limpiarHeaders(headers: any[]): any[] {
    const copia = [...headers];
    while (copia.length && (copia[copia.length - 1] === '' || copia[copia.length - 1] == null)) {
      copia.pop();
    }
    return copia;
  }



  camposAnalistas: any[] = [];
  showButton: boolean = false;


  validaHeaders(data: any) {
    let headers = data[0];

    console.log(`Headers Documento: ${headers}`)

    let headersLength = headers.length;
    console.log(headersLength)
    let headersCorrectos = false;

    for(let i = 0 ; i < headersLength ; i++) {
        console.log(headers[i])
      if( headers[i].toUpperCase() != this.headers[i].toUpperCase()) {
        headersCorrectos = false;
        this.limpiarDocumento();
        this.mensajeAdvertencia('Un header es incorrecto, por favor valida la información');
        console.log(headers[i])
        console.log(this.headers[i])

        break;
      } else {
        headersCorrectos = true;
      }
    }
    if(headersCorrectos) {
      this.showButton = true;
      this.mensajeExito('Se ha leído exitosamente el documento');

      this.camposAnalistas = data.slice(1);
    }


  }

  // cargarAnalistas() {
  //   this.cors.post('CargarPlantillaController/cargarAnalistas', this.camposAnalistas).subscribe(
  //     (res: any) => {
  //       if(res.status) {
  //         this.mensajeExito('Se han guardado los registros');
  //         this.showButton = false;
  //         this.limpiarDocumento();
  //       } else {
  //         this.mensajeError('Ocurrió un error, contacta al administrador');

  //       }
  //     },
  //     (err: any) => {
  //       this.mensajeError('Ocurrió un error, contacta al administrador');
  //     }
  //   )
  // }

  cargarEjecutivos() {
    console.log('entrando')
    this.showButton = false;
    this.guardando = true;
    // console.log(this.camposAnalistas)

    const method = {
      controlador: 'CargarPlantillaController',
      metodo: 'cargarAnalistas',
      data: this.camposAnalistas
    }
    this.cors.post(method).subscribe(
      (res: any) => {
        if(res.status) {
          this.mensajeExito('Se han guardado los registros');
          this.limpiarDocumento();
        } else {
          this.mensajeError('Ocurrió un error, contacta al administrador');

        }
      },
      (err: any) => {
        this.mensajeError('Ocurrió un error, contacta al administrador');
      }
    )
    this.guardando = false;

  }

  limpiarDocumento() {
    this.fileUpload.clear();
  }

  mensajeExito(mensaje: string) {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `${mensaje}` });
  }

  mensajeError(mensaje: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail:  `${mensaje}` });
  }

  mensajeAdvertencia(mensaje: string) {
    this.messageService.add({ severity: 'warn', summary: 'Aviso', detail:  `${mensaje}` });
  }

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
    });
  }
}
