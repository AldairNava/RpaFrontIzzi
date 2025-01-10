import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  //Enlace general
  readonly APIurl = 'https://localhost:44372/api';

  constructor(
    private http: HttpClient
  ) { }
  //GET: Prueba de la API
  getTry(link:string): Observable<any[]> {
    return this.http.get<any>(this.APIurl + link); //'/Formularios/ObtenerCuenta'
  }
  //POST: Ingresa una cuenta del formulario cancelacion en la tabla
  postTry(link:string , values: any): Observable<any> {
    
    return this.http.post(this.APIurl + link, values);
  }



}
