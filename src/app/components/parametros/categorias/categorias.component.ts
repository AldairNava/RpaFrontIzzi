import { Component, OnInit } from '@angular/core';
import { DarkService } from '../../../services/darkmode/dark.service';
import { MessageService } from 'primeng/api';
import { CorsService } from '../../../services/cors/cors.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  providers: [MessageService]
})
export class CategoriasComponent implements OnInit {

  mode: boolean = false;
  categorias: any[] = [];
  subcategorias: any[] = [];
  columnasDB: any [] = ['id', 'Subcategoría', 'Categoría'];
  row = [{'1': '1'}];

  nuevasFilas: any = [];

  filasCompletas: any[] = [];

  ableBtnFila: boolean = false;

  constructor(private dark: DarkService, private cors: CorsService, private messageService: MessageService) {}


  ngOnInit(): void {
    this.darkModeSubscription();

    this.obtenerSubcat();
    this.obtenerCat();
  }

  obtenerSubcat() {
    this.nuevasFilas = [];
    this.subcategorias = [];
    this.cors.get('parametrosController/selectSubcat').subscribe(
      (res: any) => {
        if(res.status) {
          res.row.forEach( (row: any) => {
            this.subcategorias.push(row);
          } )
        }
      },
      (err: any) => {
        // console.log(err)
      }
    )
  }

  obtenerCat() {
    this.cors.get('parametrosController/selectCat').subscribe(
      (res: any) => {
        if(res.status) {
          res.row.forEach( (row: any) => {
            this.categorias.push(row);
          } )
        }
      },
      (err: any) => {
        // console.log(err)
      }
    )
  }

  deleteRow(subcat: any) {
    const data = {
      controlador: 'parametrosController',
      metodo: 'eliminarSubcat',
      'id': subcat.id_subcategorias
    }

    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.showMessage('success', 'Fantástico', 'Se ha eliminado correctamente');
          this.obtenerSubcat();
        }
      },
      (err: any) => {
        // console.log(err);
      }
    )
  }

  agregarFila() {
    this.ableBtnFila = true;
    
    this.nuevasFilas.push({
        subcategoria: '',
        categoria: ''
    });

    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

  validarFilas() {
    this.filasCompletas = [];
    for(let i = 0 ; i < this.nuevasFilas.length ; i++) {
      if(this.nuevasFilas[i].subcategoria === '') {
        // console.log('Hay un campo vacío')
        this.showMessage('warn', 'Aviso', `Hay campos vacíos`);
        break;
      } else {
        // // console.log( this.nuevasFilas[i].categoria.id_categoria)
        // this.nuevasFilas[i].categoria = this.nuevasFilas[i].categoria.id_categoria;
        const data = {
          subcategoria: this.nuevasFilas[i].subcategoria,
          categoria: this.nuevasFilas[i].categoria.id_categoria
        }
                this.filasCompletas.push(data);


        if(this.filasCompletas.length === this.nuevasFilas.length) {
          this.guardarFilas();
        }
      }
    }
  }

  guardarFilas() {
    // console.log(this.filasCompletas)
    const data ={
      controlador: 'parametrosController',
      metodo: 'agregarSubcat',
      'subcats': this.filasCompletas
    }
    this.cors.post(data).subscribe(
      (res: any) => {
        if(res.status) {
          this.showMessage('success', 'Fantástico', 'Se ha añadido exitosamente');
          this.obtenerSubcat();
        }
      },
      (err: any) => {
        // console.log(err)
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
    //   // console.log('Modo oscuro cambiado:', this.mode);
    });
}
}
