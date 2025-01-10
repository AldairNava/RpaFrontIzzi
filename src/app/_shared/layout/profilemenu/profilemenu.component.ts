import { LayoutService } from '@services';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'profilemenu',
  templateUrl: './profilemenu.component.html',
})
export class ProfilemenuComponent {


  usuarioInfo: any = { "userID": null, "firstName": null, "lastName": null, "email": null, "mobile": null, "gender": null, "role": null, "pWd": null, "memberSince": null };
  constructor(public layoutService: LayoutService,private router:Router) {

    this.usuarioInfo = JSON.parse(localStorage.getItem("userData") || "{}");
  }

  get visible(): boolean {
    return this.layoutService.state.profileSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.profileSidebarVisible = _val;
  }
  cerrarSesion(){
    localStorage.clear();
    this.router.navigate(['/'])
  }
}
