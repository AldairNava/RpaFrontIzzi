import { Component } from '@angular/core';
import { LayoutService } from '@services';

@Component({
	templateUrl: './login.component.html'
})
export class LoginComponent {

	rememberMe: boolean = false;

	constructor(private layoutService: LayoutService) {}

	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

}
