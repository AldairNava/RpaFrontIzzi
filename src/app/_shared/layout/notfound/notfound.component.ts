import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	templateUrl: './notfound.component.html'
})
export class NotfoundComponent implements OnInit{constructor(private router: Router) { }

ngOnInit(): void {
}
// navigateToProjects1() {
//   this.router.navigate(['/login-Izzi']);
// }
// navigateToProjects2() {
//   this.router.navigate(['/login-Mariana']);
// }

}