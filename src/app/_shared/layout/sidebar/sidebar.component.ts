import { Component, OnInit, ElementRef } from '@angular/core';
import { LayoutService } from '@services';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent  {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
}
