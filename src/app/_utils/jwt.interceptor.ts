import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as moment from 'moment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const isLoggedIn = localStorage.getItem('access_token') || null;

        const isApiUrl = request.url.includes('U_Usuario');
        if (!isApiUrl) {
            let body = request.body;
            this.buscarFechas(body);

            // console.log(body);


            request = request.clone({
                body: body,
                setHeaders: { Authorization: `Bearer ${isLoggedIn}` },
            });
        }

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    err.error['errorMessage'] =
                        'La sesión ha caducado, que vuelva a ingresar nuevamente.';
                    this.router.navigateByUrl('/inicio-sesion');
                }

                if (err.error) {
                    if (err.error['errors'] != undefined) {
                        let errorString: string = '';

                        for (const key in err.error['errors']) {
                            if (
                                Object.prototype.hasOwnProperty.call(
                                    err.error['errors'],
                                    key
                                )
                            ) {
                                errorString += err.error['errors'][key] + ', ';
                            }
                        }

                        err.error['errorMessage'] =
                            'Errores: ' + errorString.slice(0, -1);
                        return throwError(err);
                    }
                }

                return throwError(err);
            })
        );
    }

    buscarFechas(objeto: any) {
        for (const key in objeto) {
            if (objeto.hasOwnProperty(key)) {
                if (moment(objeto[key]).isValid()) {
                  objeto[key] = moment(objeto[key]).format('YYYY-MM-DD');
                }

                if (typeof objeto[key] === 'object') {
                    this.buscarFechas(objeto[key]);
                }
                if (Array.isArray(objeto[key])) {
                    for (let i = 0; i < objeto[key].length; i++) {
                        this.buscarFechas(objeto[key][i]);
                    }
                }
            }
        }
    }
}
