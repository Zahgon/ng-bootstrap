import { inject, Service } from '@angular/core';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

/**
 * A configuration service for the [NgbCollapse](#/components/collapse/api#NgbCollapse) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all collapses used in the application.
 */
@Service()
export class NgbCollapseConfig {
	private _ngbConfig = inject(NgbConfig);
	private _animation: boolean;

	horizontal = false;

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
