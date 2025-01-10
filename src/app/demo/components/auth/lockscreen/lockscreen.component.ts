import { Component } from '@angular/core';
import { LayoutService } from '@services';

@Component({
    templateUrl: './lockscreen.component.html'
})
export class LockScreenComponent {

    constructor(private layoutService: LayoutService) {}

	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

}
