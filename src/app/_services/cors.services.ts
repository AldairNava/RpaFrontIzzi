import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
            .toPromise();
    }

    get3(partUrl: string, dataGet: any = {}): Promise<any> {
        const params = new HttpParams({
            fromObject: dataGet,
        });

        return this.httpClient
            .get(`http://192.168.61.19:2000/`)
            .toPromise();
    }

    get1(partUrl: string, dataGet: any = {}): Promise<any> {
        const params = new HttpParams({
            fromObject: dataGet,
        });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://rpabackizzi.azurewebsites.net/',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        });

        return this.httpClient
            .get(`${environment.API_URL}${partUrl}?${params}`, {
                headers: headers,
                responseType: 'blob'
            })
            .toPromise();
    }

    get2(partUrl: string, dataGet: any = {}): Promise<any> {
        const params = new HttpParams({
            fromObject: dataGet,
        });

        return this.httpClient
            .get(`${environment.API_URL}${partUrl}?${params}`, {
                responseType: 'blob'
            })
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
                },
                body: dataGet
            })
            .toPromise();
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0 && error.error instanceof ProgressEvent) {
            // Manejo básico de error local
        }
    }

    // === Método agregado ===
    isLocalHost(): boolean {
    return !environment.production;
  }
}
