import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	templateUrl: './notfound.component.html'
})
export class NotfoundComponent implements OnInit{constructor(private router: Router) { }

ngOnInit(): void {
}
goHome() {
  sessionStorage.removeItem('user');
  this.router.navigate(['/']);
}

}