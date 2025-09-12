import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    loading = false;

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) {
            window.location.href = 'https://rpabackizzi.azurewebsites.net/Loginsaml/Login';
            return false;
        }

        // Parsea el usuario y valida campos
        try {
            const user = JSON.parse(userStr);

            // Verifica existencia de user y departamento
            if (
                user.User && user.Departamento &&
                (user.Departamento === 'mariana' || user.Departamento === 'wincallmx')
            ) {
                return true;
            } else {
                this.loading = false;
                console.log('departamento de user:', user);
                console.log('departamento de userStr:', userStr);
                console.log('departamento de usuario:', user.departamento);
                this.router.navigate(['/403']).then(() => this.loading = false);
                return false;
            }
        } catch (err) {
            // Si hay error en el parseo o formato inválido, fuerza login
            window.location.href = 'https://rpabackizzi.azurewebsites.net/Loginsaml/Login';
            return false;
        }
    }
}
