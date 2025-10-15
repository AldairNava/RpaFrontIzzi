import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PermisoService {
  private baseUrl = `${environment.API_URL}User`;

  constructor(private http: HttpClient) {}

  obtenerPermisos(role: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/permisos/${role}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private permisoService: PermisoService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> {
    const path = route.url[0]?.path;
    const usuarioInfo = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log('Usuario Info:', usuarioInfo);

    // 🧱 1️⃣ Validar que exista Role
    if (!usuarioInfo?.role) {
      this.router.navigate(['/403'], { skipLocationChange: true });
      return of(false);
    }

    if (
      usuarioInfo?.active === 0 ||
      usuarioInfo?.active === false ||
      usuarioInfo?.active === '0'
    ) {
      console.warn('Usuario inactivo, acceso denegado.');
      this.router.navigate(['/403'], { skipLocationChange: true });
      return of(false);
    }

    // 🧭 3️⃣ Validar staff permitido
    const staff = (usuarioInfo?.staff || '').toLowerCase();
    if (staff !== 'cx' && staff !== 'wincallmx') {
      this.router.navigate(['/403'], { skipLocationChange: true });
      return of(false);
    }

    // ✅ 4️⃣ Verificar permisos por rol
    return this.permisoService.obtenerPermisos(usuarioInfo.role).pipe(
      map((permisos: string[]) => {
        if (permisos.includes(path)) {
          return true;
        }
        this.router.navigate(['/403'], { skipLocationChange: true });
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/403'], { skipLocationChange: true });
        return of(false);
      })
    );
  }
}
