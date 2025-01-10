import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate } from '@angular/animations';
import { INavbarData } from './helper';
import { transition } from '@angular/animations';

import { DarkService } from '../../services/darkmode/dark.service';

@Component({
  selector: 'app-sublevel-menu',
  template: `
    <ul *ngIf="collapsed && data.items && data.items.length > 0" class="sublevel-nav"
    [@submenu]="expanded ? 
    {value: 'visible', params: {transitionParams : '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*' } } :
    {value: 'hidden', params: {transitionParams : '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0' } } "
    >
      <li *ngFor="let item of data.items" class="sublevel-nav-item" style="margin-top: 10px">
        <a *ngIf="item.items && item.items.length > 0" class="sublevel-nav-link" (click)="handleClick(item)"> 
          <!-- <i class="sublevel-link-icon fa fa-circle"> </i> -->
          <span *ngIf="collapsed" class="sublevel-link-text"> {{item.Label}} </span>
          <i *ngIf="item.items && collapsed" class="menu-collapse-icon" [ngClass]="!item.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down' "> </i>
        </a>
        <a class="sublevel-nav-link" [class]=" mode ? 'dark' : 'light' " *ngIf="!item.items || (item.items && item.items.length === 0)"
          [routerLink]="[item.routerLink]"
          routerLinkActive="active-sublevel"
          [routerLinkActiveOptions]="{exact: true}"
        >
          <i class="sublevel-link-icon" [class]="item.icon" [style]=" mode ? 'color: #FFF' : 'color: #000' "> </i>
          <span *ngIf="collapsed" class="sublevel-link-text"> {{item.Label}} </span>
        </a>
        <div *ngIf="item.items && item.items.length > 0">
          <app-sublevel-menu
            [collapsed]="collapsed"
            [multiple]="multiple"
            [expanded]="item.expanded"
          >
          </app-sublevel-menu>
        </div>
      </li>
    </ul>
  `,
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible <=> hidden', [style({overflow: 'hidden'}), 
      animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
    ])
  ]

})
export class SublevelMenuComponent implements OnInit {

  @Input() data: INavbarData = {
    routerLink: '',
    icon: '',
    Label: '',
    items: [],
    access: []
  }


  @Input() collapsed = false;

  @Input() animating: boolean | undefined;

  @Input() expanded: boolean | undefined;

  @Input() multiple: boolean | undefined;



  ngOnInit(): void {
    this.darkModeSubscription();
  }

  constructor(private dark: DarkService) {}

  mode: boolean | undefined;

  handleClick(item: any) {
    if(!this.multiple) {
      if(this.data.items && this.data.items.length > 0) {
        for(let modelItem of this.data.items) {
          if(item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }

  private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
    });
  }
}
