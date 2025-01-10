import { Component } from '@angular/core';
import { LayoutService } from '@services';

@Component({
	templateUrl: './newpassword.component.html'
})
export class NewPasswordComponent {

	rememberMe: boolean = false;

	constructor(private layoutService: LayoutService) {}

	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

}
