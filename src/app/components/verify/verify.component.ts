import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
// verify.component.ts
// verify.component.ts
export class VerifyComponent implements OnInit {
  mode: boolean = true;
  loading: boolean = true;
  staff: string | null = null; // Nuevo campo para controlar la lógica de staff

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let userData: any;

      if (params['user']) {
        try {
          const decoded = decodeURIComponent(params['user']);
          userData = JSON.parse(decoded);
          sessionStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error('Error al decodificar el usuario:', e);
          window.location.href = 'https://rpabackizzi.azurewebsites.net/Loginsaml/Login';
          return;
        }
      } else {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          userData = JSON.parse(storedUser);
        } else {
          window.location.href = 'https://rpabackizzi.azurewebsites.net/Loginsaml/Login';
          return;
        }
      }

      this.staff = userData?.Departamento?.toLowerCase();

      if (this.staff === 'mariana') {
        this.router.navigate(['/mariana']).then(() => this.loading = false);
      } else if (this.staff === 'cx') {
        this.router.navigate(['/home']).then(() => this.loading = false);
      } else if (this.staff === 'wincallmx') {
        this.loading = false;
      } else {
        this.router.navigate(['/403']).then(() => this.loading = false);
      }
    });
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }
}
