import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { MessageService } from 'primeng/api';
import { CorsService } from '@services';

@Component({
  selector: 'pagprincipal',
  templateUrl: './pagprincipal.component.html',
  styleUrls: ['./pagprincipal.component.scss'],
  providers: [MessageService]
})
export class PagprincipalComponent implements OnInit {

  alerta: { titulo: string, mensaje: string, tipo: string } | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private corsService: CorsService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.validateToken(token);
    }

    // Si está en localhost, setea usuario de prueba
    if (this.corsService.isLocalHost()) {
      const userMock = {
        user: 'p-bnava',
        email: 'p-bnava@izzi.mx',
        name: 'p-bnava',
        role: 'administrador',
        staff: 'wincallmx',
        area: 'administrativa',
        departamento: 'wincallmx',
        active: true
      };
      sessionStorage.setItem('user', JSON.stringify(userMock));
    }

    const user = sessionStorage.getItem('user');
    if (user) {
      const usuario = JSON.parse(user);
      this.alerta = {
        titulo: 'Usuario autenticado',
        mensaje: `¡Bienvenido ${usuario.name || ''}! Selecciona tu proyecto.`,
        tipo: 'alerta-success'
      };
    } else {
      this.alerta = {
        titulo: 'Se requiere inicio de sesión',
        mensaje: 'Por favor, inicia sesión para continuar.',
        tipo: 'alerta-warn'
      };
    }

    // Ocultar alerta tras 5 segundos
    setTimeout(() => { this.alerta = null; }, 5000);
  }

  navigateToProjects(project: string) {
    this.router.navigate(['/verify'], { queryParams: { project } });
  }

}
