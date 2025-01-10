import { Component } from '@angular/core';
import { LayoutService } from '@services';

@Component({
    templateUrl: './forgotpassword.component.html'
})
export class ForgotPasswordComponent {

    constructor(private layoutService: LayoutService) {}

	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

}
