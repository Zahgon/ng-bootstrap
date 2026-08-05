import { inject, Service } from '@angular/core';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

/**
 * A configuration service for the [NgbAlert](#/components/alert/api#NgbAlert) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all alerts used in the application.
 */
@Service()
export class NgbAlertConfig {
	private _ngbConfig = inject(NgbConfig);
	private _animation: boolean;

	dismissible = true;
	type = 'warning';

	/**
	 * @defaultValue `true`
	 */
	get animation(): boolean {
        throw new Error("STUB");
    }
	set animation(animation: boolean) {
        throw new Error("STUB");
    }
}
