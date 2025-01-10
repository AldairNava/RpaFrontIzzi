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

  tipo: { name: string }[] = [
    { name: 'Analistas' },
    { name: 'Ejecutivos' }
  ];

  headersAnalistas: any[] = [
    'No Empleado',
    'Nombre',
    'Región',
    'Departamento',
    'Puesto OP',
    'SKILL A EVALUAR'
  ];

  headersEjecutivos: any[] = [
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
    'Región',
    'Departamento',
    'Puesto OP',
    'SKILL A EVALUAR'
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
      
    this.items = [{ label: 'Analizar Audios' }];

    this.home = { icon: 'pi pi-home', routerLink: '/' }; 
  }

  validaTipo() {
    this.tipoSelected.name === 'Analistas' ? this.analistas = true : this.analistas = false;
    this.tipoSelected.name === 'Ejecutivos' ? this.ejecutivos = true : this.ejecutivos = false;
  }

  readExcel(event: any): void {
    let file: any = '';
    if (event.files && event.files.length > 0) {
      file = event.files[0];

      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload= (e)=>{
        var workBook = XLSX.read(fileReader.result,{type:'binary',cellDates:true})
        var sheetNames =  workBook.SheetNames;

        if (sheetNames.length > 0) {
          let data: string | any[][] = this.readSheet(workBook.Sheets[sheetNames[0]]);

          this.validaHeadersEjecutivos(data);
        } 
      }
    } else {
      console.error('No se seleccionaron archivos.');
    }
  }


  readSheet(sheet: XLSX.WorkSheet) {
    if( sheet['!ref'] !== undefined ) {
      const range = XLSX.utils.decode_range(sheet['!ref']);
      let data = [];
    
      for (let R = range.s.r; R <= range.e.r; ++R) {
        let rowData = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          let cellAddress = { c: C, r: R };
          let cellRef = XLSX.utils.encode_cell(cellAddress);
          let cell = sheet[cellRef];
    
          rowData.push(cell ? cell.v : undefined);
        }
        data.push(rowData);
      }
    
      return data;
    } else {
      return 'sin data';
    }
  }

  camposAnalistas: any[] = [];
  showButton: boolean = false;

  // validaHeadersAnalista(data: any) {
  //   let headers = data[0];

  //   let headersLength = headers.length;
  //   let headersCorrectos = false;

  //   for(let i = 0 ; i < headersLength ; i++) {
  //     if( headers[i].toUpperCase() != this.headersAnalistas[i].toUpperCase()) {
  //       console.log(headers[i])
  //       this.mensajeAdvertencia('Un header es incorrecto');
  //       headersCorrectos = false;
  //       this.limpiarDocumento();
  //       break;
  //     } else {
  //       headersCorrectos = true;
  //     }
  //   }
  //   if(headersCorrectos) {
  //     this.showButton = true;
  //     this.mensajeExito('Se ha leído exitosamente el documento');

  //     this.camposAnalistas = data.slice(1); 
      
      
  //   }


  // }

  validaHeadersEjecutivos(data: any) {
    let headers = data[0];

    let headersLength = headers.length;
    let headersCorrectos = false;

    for(let i = 0 ; i < headersLength ; i++) {
      if( headers[i].toUpperCase() != this.headersEjecutivos[i].toUpperCase()) {
        headersCorrectos = false;
        this.limpiarDocumento();
        this.mensajeAdvertencia('Un header es incorrecto, por favor valida la información');
        console.log(headers[i])
        console.log(this.headersEjecutivos[i])

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
    console.log(this.camposAnalistas)
    this.cors.post(this.camposAnalistas).subscribe(
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
