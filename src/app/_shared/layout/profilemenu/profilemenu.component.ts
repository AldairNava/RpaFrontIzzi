import { LayoutService } from '@services';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'profilemenu',
  templateUrl: './profilemenu.component.html',
})
export class ProfilemenuComponent {

  usuarioInfo: any = {};

  constructor(public layoutService: LayoutService, private router: Router) {
    this.usuarioInfo = JSON.parse(sessionStorage.getItem("user") || "{}");
  }

  get visible(): boolean {
    return this.layoutService.state.profileSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.profileSidebarVisible = _val;
  }

  // --- Adaptación del logout igual que SidenavComponent ---
  logout() {
    const idpLogoutUrl = 'https://login.microsoftonline.com/3ad84793-7b5f-4519-84ce-96790471f26a/oauth2/v2.0/logout?post_logout_redirect_uri=https://frontrpaizzi.azurewebsites.net/CyberIdeas-Proyects';
    
    // Remueve usuario del sessionStorage
    sessionStorage.removeItem('user');

    // Si quieres limpiar localStorage también, lo puedes dejar:
    // localStorage.clear();

    // Redirige al IDP para cerrar la sesión global
    window.location.href = idpLogoutUrl;
  }
}
