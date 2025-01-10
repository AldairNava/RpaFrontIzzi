import { Directive, HostListener, Renderer2, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[toLowerCase]',
})
export class LowerCaseDirective implements OnChanges {
  constructor(private el: ElementRef, private control: NgControl) {}


   ngOnChanges(changes: SimpleChanges) {
    if (changes) {
debugger
      if (changes.errorMessage?.currentValue) {



          Object.keys(changes.errorMessage.currentValue).forEach((error) => {
            //this.el.nativeElement.innerHTML = this.errorLabel[error] || '';
          });

      }
    }
  }
  @HostListener('input', ['$event']) onEvent($event: any): any {
    debugger;
    const upper = this.el.nativeElement.value.toLowerCase();
    if (this.control.control) {
      this.control.control.setValue(upper);
    }
  }
}
