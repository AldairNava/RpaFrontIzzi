import {
    Component,
    Input,
    OnChanges,
} from '@angular/core';

@Component({
    selector: 'error-message',
    template: `<span style="color:red">{{ errorText }}</span>`,
})
export class ErrorMessageComponent implements OnChanges {
    @Input() errors: any = {};
    errorText: string = '';
    errorLabel: any = {
        password_unmatch: 'Las contraseñas no coinciden',
        email: 'e-mail invalido',
        required: 'Campo requerido',
        min: 'Campo requerido',
        password_usecure: ' Contraseña poco segura',
        minlength: 'Muy pocos caracteres',
    };

    constructor() {}

    ngOnChanges(): void {
        if (this.errors) {
            Object.keys(this.errors).forEach((error) => {
                this.errorText = this.errorLabel[error] || '';
            });
        }
    }
}
