import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss'],
})
export class LoadingButtonComponent {
  @Input() loading: boolean = false;
  @Input() label: string = '';
  @Input() labelLoad: string = '';
  constructor() {}
}
