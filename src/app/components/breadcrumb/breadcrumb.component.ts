import { Component, OnInit, Input } from '@angular/core';
import { DarkService } from '../../services/darkmode/dark.service';



@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() pageTitle: string = '';


  mode: boolean = false;
  multi: boolean = false;
  p: any[] = [];

  constructor(private dark: DarkService) {}

  ngOnInit(): void {
      this.darkModeSubscription();
      const  parts = this.pageTitle.split('>');
      parts.length > 1 ? this.multi = true : this.multi = false;
      this.p = parts;
      const lastP = parts[1]
      this.p[1] = '>'
      this.p[2] = lastP
  }

   private darkModeSubscription(): void {
    this.dark.darkModeChanges$().subscribe((isDarkModeEnabled: boolean) => {
      this.mode = isDarkModeEnabled;
    });
  }

}
