import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CronService {

  private insecureHttpClient: HttpClient;
  
  private cronApi: string = 'https://192.168.51.199:5000/';

  constructor(private httpBackend: HttpBackend) {
    this.insecureHttpClient = new HttpClient(this.httpBackend);
  }

  // Método para hacer peticiones sin validación de certificado
  get(method: string) {
    return this.insecureHttpClient.get(`${this.cronApi}${method}`);
  }

  post(method: string, data: any) {
    return this.insecureHttpClient.post(`${this.cronApi}${method}`, data);
  }
}
