import { NgControl } from '@angular/forms';
import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[errorInput]',
})
export class ErrorInputClassDirective implements OnChanges {


  constructor(private el: ElementRef, private control: NgControl) {
    // console.log(control);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.el);

    if (changes) {
      debugger;
      if (changes.errorMessage?.currentValue) {
      }
    }
  }
}
