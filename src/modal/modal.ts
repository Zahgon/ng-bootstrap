import { inject, Service, Injector } from '@angular/core';

import { NgbModalConfig, NgbModalOptions } from './modal-config';
import { NgbModalRef } from './modal-ref';
import { NgbModalStack } from './modal-stack';

/**
 * A service for opening modal windows.
 *
 * Creating a modal is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 */
@Service()
export class NgbModal {
	private _injector = inject(Injector);
	private _modalStack = inject(NgbModalStack);
	private _config = inject(NgbModalConfig);

	/**
	 * Opens a new modal window with the specified content and supplied options.
	 *
	 * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
	 * then instances of those components can be injected with an instance of the `NgbActiveModal` class. You can then
	 * use `NgbActiveModal` methods to close / dismiss modals from "inside" of your component.
	 *
	 * Also see the [`NgbModalOptions`](#/components/modal/api#NgbModalOptions) for the list of supported options.
	 */
	open(content: any, options: NgbModalOptions = {}): NgbModalRef {
        throw new Error("STUB");
    }

	/**
	 * Returns an observable that holds the active modal instances.
	 */
	get activeInstances() {
        throw new Error("STUB");
    }

	/**
	 * Dismisses all currently displayed modal windows with the supplied reason.
	 *
	 * @since 3.1.0
	 */
	dismissAll(reason?: any) {
        throw new Error("STUB");
    }

	/**
	 * Indicates if there are currently any open modal windows in the application.
	 *
	 * @since 3.3.0
	 */
	hasOpenModals(): boolean {
        throw new Error("STUB");
    }
}
