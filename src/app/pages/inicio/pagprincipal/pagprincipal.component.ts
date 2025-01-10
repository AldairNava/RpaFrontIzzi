import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'pagprincipal',
  templateUrl: './pagprincipal.component.html',
  styleUrls: ['./pagprincipal.component.scss']
})
export class PagprincipalComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.validateToken(token);
    }
  }

  navigateToProjects1() {
    this.router.navigate(['/login-Izzi']);
  }

  navigateToProjects2() {
    this.router.navigate(['/verify']);
  }
}
