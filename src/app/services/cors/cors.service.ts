import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CorsService {
  // urlApi: string = 'http://172.24.251.249:154/api';
  //  urlApi: string = 'http://192.168.51.210/api';
  urlApi: string = 'https://rpabackizzi.azurewebsites.net/apiMariana/construyeMetodo';


  constructor(private http: HttpClient) { }

  get(controller: string) {
    return this.http.get(`${this.urlApi}/${controller}`);
  }

  post(data: any) {
    return this.http.post(`${this.urlApi}`, data);
  }

  audio(audioName: string) {
    return this.urlApi + '/audios/' + audioName;
  }
}
