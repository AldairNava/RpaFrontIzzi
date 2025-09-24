import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'pagprincipal',
  templateUrl: './pagprincipal.component.html',
  styleUrls: ['./pagprincipal.component.scss'],
  providers: [MessageService]
})
export class PagprincipalComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}
  alerta: { titulo: string, mensaje: string, tipo: string } | null = null;

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.validateToken(token);
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
    // Opcional: ocultar después de 5s
    setTimeout(() => { this.alerta = null; }, 5000);
  }

  navigateToProjects(project: string) {
    this.router.navigate(['/verify'], { queryParams: { project } });
  }

}
