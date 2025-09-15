import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CorsService } from '@services';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  mode: boolean = true;
  loading: boolean = true;
  staff: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cors: CorsService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        const cleanToken = token.endsWith('?') ? token.slice(0, -1) : token;
        this.cors.get(`LoginSaml/session?token=${encodeURIComponent(cleanToken)}`)
          .then(userData => {
            if (userData && userData.staff) {
              console.log('Datos del usuario recibidos:', userData);
              // Guarda los datos en sessionStorage tal como llegan
              sessionStorage.setItem('user', JSON.stringify(userData));
              this.staff = userData.staff.toLowerCase();
              this.handleRedirect();
            } else {
              // this.handleInvalidUser();
            }
          })
          .catch(() => {
            // this.handleInvalidUser();
          });
      } else {
        // Si no hay token, busca en sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          this.staff = userData?.staff?.toLowerCase();
          this.handleRedirect();
        } else {
          // this.handleInvalidUser();
        }
      }
    });
  }

  handleRedirect() {
    if (this.staff === 'mariana') {
      this.router.navigate(['/mariana']).then(() => this.loading = false);
    } else if (this.staff === 'cx') {
      this.router.navigate(['/home']).then(() => this.loading = false);
    } else if (this.staff === 'wincallmx') {
      this.loading = false;
    } else {
      this.router.navigate(['/403']).then(() => this.loading = false);
    }
  }

  handleInvalidUser() {
    window.location.href = 'https://rpabackizzi.azurewebsites.net/Loginsaml/Login';
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }
}
