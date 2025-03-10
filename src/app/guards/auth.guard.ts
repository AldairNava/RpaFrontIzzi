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
    "administrador":['extraccion','izzi-rpacx','ajustes','notDone','depuracion','limpieza','reporteFidelizacion','reportes','ajustesCambioServicioRetencion','robots','ordenes','okcliente'],
    "Reporte":['izzi-rpacx','reporteFidelizacion'],
    "Extraccion":['izzi-rpacx','extraccion'],
    "Depuracion":['izzi-rpacx','depuracion','reportes'],
    "Ajustes":['izzi-rpacx','ajustesCambioServicioRetencion','reportes'],
    "AjustesNotDone":['izzi-rpacx','notDone','reportes'],
    "testAjustes1":['izzi-rpacx','ajustes','reportes','ordenes'],
    "eBarrera":['extraccion','izzi-rpacx','ajustes','notDone','depuracion','reporteFidelizacion','reportes','robots','okcliente'],
    "testReportes":['izzi-rpacx','reportes'],
    "ACS":['izzi-rpacx','ajustesCambioServicioRetencion'],
    "recuperadores":['izzi-rpacx','limpieza'],
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
