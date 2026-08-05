import { ComponentRef } from '@angular/core';

import { Observable, of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgbModalBackdrop } from './modal-backdrop';
import { NgbModalWindow } from './modal-window';
import { NgbModalUpdatableOptions } from './modal-config';

import { isPromise, ContentRef } from '@ng-bootstrap/ng-bootstrap/utils';

/**
 * A reference to the currently opened (active) modal.
 *
 * Instances of this class can be injected into your component passed as modal content.
 * So you can `.update()`, `.close()` or `.dismiss()` the modal window from your component.
 */
export class NgbActiveModal {
	/**
	 * Updates options of an opened modal.
	 *
	 * @since 14.2.0
	 */
	update(options: NgbModalUpdatableOptions): void {
        throw new Error("STUB");
    }
	/**
	 * Closes the modal with an optional `result` value.
	 *
	 * The `NgbModalRef.result` promise will be resolved with the provided value.
	 */
	close(result?: any): void {
        throw new Error("STUB");
    }

	/**
	 * Dismisses the modal with an optional `reason` value.
	 *
	 * The `NgbModalRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {
        throw new Error("STUB");
    }
}

/**
 * A reference to the newly opened modal returned by the `NgbModal.open()` method.
 */
export class NgbModalRef {
	private _closed = new Subject<any>();
	private _dismissed = new Subject<any>();
	private _hidden = new Subject<void>();
	private _resolve: (result?: any) => void;
	private _reject: (reason?: any) => void;

	/**
	 * Updates options of an opened modal.
	 *
	 * @since 14.2.0
	 */
	update(options: NgbModalUpdatableOptions): void {
        throw new Error("STUB");
    }

	/**
	 * The instance of a component used for the modal content.
	 *
	 * When a `TemplateRef` is used as the content or when the modal is closed, will return `undefined`.
	 */
	get componentInstance(): any {
        throw new Error("STUB");
    }

	/**
	 * The promise that is resolved when the modal is closed and rejected when the modal is dismissed.
	 */
	result: Promise<any>;

	/**
	 * The observable that emits when the modal is closed via the `.close()` method.
	 *
	 * It will emit the result passed to the `.close()` method.
	 *
	 * @since 8.0.0
	 */
	get closed(): Observable<any> {
        throw new Error("STUB");
    }

	/**
	 * The observable that emits when the modal is dismissed via the `.dismiss()` method.
	 *
	 * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
	 * reasons like backdrop click or ESC key press.
	 *
	 * @since 8.0.0
	 */
	get dismissed(): Observable<any> {
        throw new Error("STUB");
    }

	/**
	 * The observable that emits when both modal window and backdrop are closed and animations were finished.
	 * At this point modal and backdrop elements will be removed from the DOM tree.
	 *
	 * This observable will be completed after emitting.
	 *
	 * @since 8.0.0
	 */
	get hidden(): Observable<void> {
        throw new Error("STUB");
    }

	/**
	 * The observable that emits when modal is fully visible and animation was finished.
	 * Modal DOM element is always available synchronously after calling 'modal.open()' service.
	 *
	 * This observable will be completed after emitting.
	 * It will not emit, if modal is closed before open animation is finished.
	 *
	 * @since 8.0.0
	 */
	get shown(): Observable<void> {
        throw new Error("STUB");
    }

	constructor(
		private _windowCmptRef: ComponentRef<NgbModalWindow>,
		private _contentRef: ContentRef,
		private _backdropCmptRef?: ComponentRef<NgbModalBackdrop>,
		private _beforeDismiss?: () => boolean | Promise<boolean>,
	) {
        throw new Error("STUB");
    }

	/**
	 * Closes the modal with an optional `result` value.
	 *
	 * The `NgbMobalRef.result` promise will be resolved with the provided value.
	 */
	close(result?: any): void {
        throw new Error("STUB");
    }

	private _dismiss(reason?: any) {
        throw new Error("STUB");
    }

	/**
	 * Dismisses the modal with an optional `reason` value.
	 *
	 * The `NgbModalRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {
        throw new Error("STUB");
    }

	private _removeModalElements() {
        throw new Error("STUB");
    }
}
