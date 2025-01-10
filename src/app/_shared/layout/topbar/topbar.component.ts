import { Component } from '@angular/core';
import { LayoutService } from '@services';

@Component({
  selector: 'topbar',
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  constructor(public layoutService: LayoutService) {}

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  onProfileButtonClick() {
    this.layoutService.showProfileSidebar();
  }
}
