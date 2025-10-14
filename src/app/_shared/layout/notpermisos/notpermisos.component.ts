import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'notpermisos',
  templateUrl: './notpermisos.component.html',
  // styleUrls: ['./notpermisos.component.scss']
})
export class NotpermisosComponent implements OnInit{
  
  constructor(private router: Router) { }

ngOnInit(): void {
}
goHome() {
  sessionStorage.removeItem('user');
  this.router.navigate(['/']);
}

}