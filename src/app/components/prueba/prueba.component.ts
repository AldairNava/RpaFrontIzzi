import { Component } from '@angular/core';
import { CorsService } from '../../services/cors/cors.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent {

  constructor(private cors: CorsService) {}

  get() {
    const fechas = {
      controlador: 'ApiSalidaController',
      metodo: 'generarRegistros',
      'ini': '2024-12-06',
      'fin': '2024-12-16'
    }
    this.cors.post(fechas).subscribe(
      (res: any) => {
        console.log(res.data)
        console.log(typeof(res))
      },
      (err: any) => {
        console.log(err)
      }
    )
  }

}
