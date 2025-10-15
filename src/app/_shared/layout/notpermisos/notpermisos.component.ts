import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'notpermisos',
  templateUrl: './notpermisos.component.html',
})
export class NotpermisosComponent implements OnInit {
  mensaje: string = '';
  titulo: string = 'Oops!';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    // Validar los 3 escenarios
    if (user?.active === 0 || user?.active === false || user?.active === '0') {
      this.mensaje = 'USUARIO INHABILITADO, POR FAVOR CONTACTE CON SU SUPERVISOR.';
    } 
    else if ((user?.staff || '').toLowerCase() === 'mariana') {
      this.mensaje = 'NO CUENTA CON LOS PERMISOS PARA ESTE APLICATIVO. SI LOS REQUIERE, POR FAVOR CONTACTESE CON SU SUPERVISOR PARA HABILITARLOS.';
    } 
    else {
      this.mensaje = 'PERMISOS INSUFICIENTES, INICIA SESIÓN NUEVAMENTE CON UNA CUENTA AUTORIZADA O SOLICITA PERMISOS PARA INGRESAR.';
    }
  }

  goHome() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
