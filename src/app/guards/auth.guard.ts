import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,) { }
  canActivate(

    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    let permisos: any = {
    "administrador":['extraccion','izzi-rpacx','ajustes','notDone','depuracion','limpieza','reporteFidelizacion','administracion','ajustesCambioServicioRetencion','robots','ordenes','okcliente','AgenciasExternas'],
    "admin-ajustesSucursales":['izzi-rpacx','ajustesCambioServicioRetencion','ordenes','AgenciasExternas'],
    "admin-rpacx":['extraccion','izzi-rpacx','ajustes','notDone','depuracion','administracion','robots','okcliente'],
    "Reporte":['izzi-rpacx','reporteFidelizacion'],
    "Extraccion":['izzi-rpacx','extraccion'],
    "Depuracion":['izzi-rpacx','depuracion','administracion'],
    "Ajustes":['izzi-rpacx','ajustesCambioServicioRetencion','administracion'],
    "AjustesNotDone":['izzi-rpacx','notDone','administracion'],
    "testAjustes1":['izzi-rpacx','ajustes','administracion'],
    "eBarrera":['extraccion','izzi-rpacx','ajustes','notDone','depuracion','reporteFidelizacion','administracion','robots','okcliente'],
    "testReportes":['izzi-rpacx','administracion'],
    "ACS":['izzi-rpacx','ajustesCambioServicioRetencion'],
    "recuperadores":['izzi-rpacx','limpieza','AgenciasExternas','administracion'],
    }
    console.log("aca", route.url[0].path);
    
    let usuarioInfo = JSON.parse(localStorage.getItem("userData") || "{}")
	console.log("rol",route.url[0].path);

    if (usuarioInfo?.role) {

      if (permisos[usuarioInfo?.role].includes(route.url[0].path)) { return true }
    }

    

    this.router.navigate(['/403'], { skipLocationChange: true });
    return false;
  }

}
