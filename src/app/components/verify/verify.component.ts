import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CorsService } from '@services';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  loading: boolean = true;
  userName: string = '';
  project: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cors: CorsService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      this.project = params['project'] || null;

      if (token) {
        const cleanToken = token.endsWith('?') ? token.slice(0, -1) : token;
        this.cors.get(`LoginSaml/session?token=${encodeURIComponent(cleanToken)}`)
          .then(userData => {
            if (userData && userData.staff) {
              sessionStorage.setItem('user', JSON.stringify(userData));
              this.userName = userData.name;

              // Aquí haces la distinción por staff
              if (userData.staff.toLowerCase() === 'wincallmx') {
                this.router.navigate(['/CyberIdeas-Proyects']);
              } else if (userData.staff.toLowerCase() === 'mariana') {
                this.router.navigate(['/mariana']);
              } else if (userData.staff.toLowerCase() === 'cx') {
                this.router.navigate(['/home']);
              } else {
                this.router.navigate(['/403']);
              }
            } else {
              this.handleInvalidUser();
            }
          })
          .catch(() => {
            this.handleInvalidUser();
          });
        return;
      }

      if (!this.project) {
        this.router.navigate(['/CyberIdeas-Proyects']);
        return;
      }

      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        this.userName = userData?.name;
        this.redirectToProject();
      } else {
        this.handleInvalidUser();
      }
    });
  }

  redirectToProject() {
    if (this.project === 'mariana') {
      this.router.navigate(['/mariana']);
    } else if (this.project === 'cx') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/403']);
    }
    this.loading = false;
  }

  handleInvalidUser() {
    window.location.href = `https://rpabackizzi.azurewebsites.net/Loginsaml/Login`;
  }
}