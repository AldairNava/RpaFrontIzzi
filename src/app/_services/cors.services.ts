import { Injectable } from '@angular/core';

import {
    HttpClient,
    HttpParams,
    HttpErrorResponse,
    HttpHeaders
} from '@angular/common/http';

import 'rxjs/operators';
import { environment } from 'environments/environment';
import { timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CorsService {
    private headers: Headers = new Headers({});
    constructor(private httpClient: HttpClient) { }

    post(partUrl: string, dataGet: any = {}): Promise<any> {
        return this.httpClient
            .post(`${environment.API_URL}${partUrl}`, dataGet, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .toPromise(); 
    }
    get(partUrl: string, dataGet: any = {}): Promise<any> {
        const params = new HttpParams({
            fromObject: dataGet,
        });

        return this.httpClient
            .get(`${environment.API_URL}${partUrl}?${params}`)
            // .get(`${environment.API_URL}${partUrl}`)
            .toPromise();
    }
    get3(partUrl: string, dataGet: any = {}): Promise<any> {
        const params = new HttpParams({
            fromObject: dataGet,
        });

        return this.httpClient
            .get(`http://192.168.61.19:2000/`)
            // .get(`${environment.API_URL}${partUrl}`)
            .toPromise();
    }


    get1(partUrl: string, dataGet: any = {}): Promise<any> {
        const params = new HttpParams({
            fromObject: dataGet,
        });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            // Aquí agregamos los headers para evitar problemas de CORS
            'Access-Control-Allow-Origin': 'https://rpabackizzi.azurewebsites.net/', // Reemplaza con el dominio de tu frontend
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          });

        return this.httpClient
            .get(`${environment.API_URL}${partUrl}?${params}`,{
                headers:headers,
                responseType:'blob'
            })
            // .pipe(
            //     timeout(600000)
            // )
            .toPromise();
    }
    get2(partUrl: string, dataGet: any = {}): Promise<any> {
        const params = new HttpParams({
            fromObject: dataGet,
        });

        return this.httpClient
            .get(`${environment.API_URL}${partUrl}?${params}`,{
                responseType:'blob'
            })
            // .pipe(
            //     timeout(600000)
            // )
            .toPromise();
    }

    getCommand(partUrl: string): Promise<any> {


        return this.httpClient
            .get(partUrl)
            .toPromise();
    }
    put(partUrl: string, dataGet: any = {}): Promise<any> {


        return this.httpClient
            .put(`${environment.API_URL}${partUrl}`, dataGet, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .toPromise();
    }

    delete(partUrl: string, dataGet: any = {}): Promise<any> {
     

       
        return this.httpClient
            .delete(`${environment.API_URL}${partUrl}`, {
                headers: {
                    'Content-Type': 'application/json',
                },body:dataGet
            },
            )
            .toPromise();
    }


    private handleError(error: HttpErrorResponse) {
        if (error.status === 0 && error.error instanceof ProgressEvent) {
            // A client-side or network error occurred. Handle it accordingly.
        }
    }
}
