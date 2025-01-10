import { Component, OnInit } from '@angular/core';
import { INavbarData } from './helper';
import { DarkService } from '../../services/darkmode/dark.service';
import { Router } from '@angular/router';
import { navData } from './nav-dat';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(private dark: DarkService, private router: Router) {}

  collapsed: boolean = false;
  navData = navData;
  mode: boolean | undefined;
  multiple: boolean = false;

  userName: any;
  nombre: string = '';
  apellidoP: string = '';
  apellidoM: string = '';

  ngOnInit(): void {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userName = user.name; // Suponiendo que el campo 'name' contiene el nombre completo del usuario
      this.separarNombre();
      this.darkModeSubscription();

      const usuarioRol = user.rol; // Suponiendo que el campo 'rol' contiene el rol del usuario
      if (usuarioRol) {
        this.navData = this.navData.filter(option => option.access.includes(usuarioRol!));
      }
    } else {
      this.router.navigate(['/403']);
    }
  }

  toggleMode() {
    this.dark.toggleDarkMode();
    this.mode = this.dark.isDarkModeEnabled();
  }

  navigateTo(item: INavbarData) {
    if (!this.multiple) {
      this.navData.forEach(modelItem => {
        if (modelItem !== item && modelItem.expanded) {
          modelItem.expanded = false;
        }
      });
    }
    item.expanded = !item.expanded;
    console.log('Navegando a la ruta:', item.routerLink);
    if (item.routerLink) {
      this.router.navigate([item.routerLink]);
    } else {
      console.error('La ruta está vacía:', item.routerLink);
    }
  }

  separarNombre() {
    const palabras = this.userName.split(' ');

    this.nombre = palabras[0];

    if (palabras[1]) {
      this.apellidoP = palabras[1];
    }

    if (palabras[2]) {
      this.apellidoM = palabras[2];
    }
  }

  logout() {
    const idpLogoutUrl = 'https://login.microsoftonline.com/3ad84793-7b5f-4519-84ce-96790471f26a/oauth2/v2.0/logout?post_logout_redirect_uri=https://frontrpaizzi.azurewebsites.net/CyberIdeas-Proyects';
    
    // Remover el usuario del sessionStorage
    sessionStorage.removeItem('user');
  
    // Redirigir al IDP para cerrar la sesión
    window.location.href = idpLogoutUrl;
  }
  

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
    });
  }
}
