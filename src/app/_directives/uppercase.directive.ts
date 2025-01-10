import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[toUpperCase]',
})
export class UppercaseDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event']) onEvent($event: any): any {
    const upper = this.el.nativeElement.value.toUpperCase();
    if (this.control.control) {
      this.control.control.setValue(upper);
    }
  }
}
