import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[errorMessage]',
})
export class ErrorMessageDirective implements OnChanges {
  @Input() errorMessage: any = '';
  @Input() estatus?: boolean;
  errorText: string = '';

  errorLabel: any = {
    email: 'e-mail invalido',
    required: 'Campo requerido',
  };

  constructor(private el: ElementRef) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {

      if (changes.errorMessage?.currentValue) {
        console.log(this.estatus);


        if (this.estatus) {
          Object.keys(changes.errorMessage.currentValue).forEach((error) => {
            this.el.nativeElement.innerHTML = this.errorLabel[error] || '';
          });
        }
      }
    }
  }
}
