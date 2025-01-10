import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        // Caso 1: Datos del usuario recibidos a través de la URL
        try {
          const user = decodeURIComponent(params['user']);
          console.log('Usuario decodificado desde la URL:', user); // Consola de depuración
          sessionStorage.setItem('user', JSON.stringify({ name: user }));

          // Redirigir al componente principal después de guardar el usuario
          this.router.navigate(['/mariana']);
        } catch (e) {
          console.error('Error al decodificar o almacenar el usuario:', e);
          window.location.href = 'https://rpabackizzi.azurewebsites.net/Loginsaml/Login';
        }
      } else {
        // Caso 2: Datos del usuario leídos desde sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          console.log('Usuario encontrado en sessionStorage:', JSON.parse(storedUser)); // Consola de depuración
          // Redirigir directamente a mariana si el usuario ya está en sessionStorage
          this.router.navigate(['/mariana']);
        } else {
          window.location.href = 'https://rpabackizzi.azurewebsites.net/Loginsaml/Login';
        }
      }
    });
  }
}
