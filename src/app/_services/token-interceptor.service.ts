import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }
intercept(req: HttpRequest <any>, next: HttpHandler):Observable<HttpEvent<any>> {

  var tk = localStorage.getItem("token");
  var t=tk;
  let jwttoken= req.clone({
    setHeaders: {
      Authorization: "Bearer " + tk
    }
   })
   return next.handle(jwttoken);
}
}
