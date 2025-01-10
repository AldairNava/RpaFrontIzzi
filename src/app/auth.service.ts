import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  validateToken(token: string) {
    // Decodifica el token para extraer las reclamaciones (claims)
    // const decodedToken = jwt_decode(token);
    // Almacena la información relevante en sessionStorage
    sessionStorage.setItem('token', token);
    // sessionStorage.setItem('user_id', decodedToken['sub']); // Ajusta según las reclamaciones del token

    // Redirige al dashboard
    this.router.navigate(['/mariana']);
  }
}
