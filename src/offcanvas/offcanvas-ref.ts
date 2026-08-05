import { ComponentRef } from '@angular/core';

import { Observable, of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { isPromise, ContentRef } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbOffcanvasBackdrop } from './offcanvas-backdrop';
import { NgbOffcanvasPanel } from './offcanvas-panel';

/**
 * A reference to the currently opened (active) offcanvas.
 *
 * Instances of this class can be injected into your component passed as offcanvas content.
 * So you can `.close()` or `.dismiss()` the offcanvas window from your component.
 *
 * @since 12.1.0
 */
export class NgbActiveOffcanvas {
	/**
	 * Closes the offcanvas with an optional `result` value.
	 *
	 * The `NgbOffcanvasRef.result` promise will be resolved with the provided value.
	 */
	close(result?: any): void {
        throw new Error("STUB");
    }

	/**
	 * Dismisses the offcanvas with an optional `reason` value.
	 *
	 * The `NgbOffcanvasRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {
        throw new Error("STUB");
    }
}

/**
 * A reference to the newly opened offcanvas returned by the `NgbOffcanvas.open()` method.
 *
 * @since 12.1.0
 */
export class NgbOffcanvasRef {
	private _closed = new Subject<any>();
	private _dismissed = new Subject<any>();
	private _hidden = new Subject<void>();
	private _resolve: (result?: any) => void;
	private _reject: (reason?: any) => void;

	/**
	 * The instance of a component used for the offcanvas content.
	 *
	 * When a `TemplateRef` is used as the content or when the offcanvas is closed, will return `undefined`.
	 */
	get componentInstance(): any {
        throw new Error("STUB");
    }

	/**
	 * The promise that is resolved when the offcanvas is closed and rejected when the offcanvas is dismissed.
	 */
	result: Promise<any>;

	/**
	 * The observable that emits when the offcanvas is closed via the `.close()` method.
	 *
	 * It will emit the result passed to the `.close()` method.
	 */
	get closed(): Observable<any> {
        throw new Error("STUB");
    }

	/**
	 * The observable that emits when the offcanvas is dismissed via the `.dismiss()` method.
	 *
	 * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
	 * reasons like backdrop click or ESC key press.
	 */
	get dismissed(): Observable<any> {
        throw new Error("STUB");
    }

	/**
	 * The observable that emits when both offcanvas window and backdrop are closed and animations were finished.
	 * At this point offcanvas and backdrop elements will be removed from the DOM tree.
	 *
	 * This observable will be completed after emitting.
	 */
	get hidden(): Observable<void> {
        throw new Error("STUB");
    }

	/**
	 * The observable that emits when offcanvas is fully visible and animation was finished.
	 * The offcanvas DOM element is always available synchronously after calling 'offcanvas.open()' service.
	 *
	 * This observable will be completed after emitting.
	 * It will not emit, if offcanvas is closed before open animation is finished.
	 */
	get shown(): Observable<void> {
        throw new Error("STUB");
    }

	constructor(
		private _panelCmptRef: ComponentRef<NgbOffcanvasPanel>,
		private _contentRef: ContentRef,
		private _backdropCmptRef?: ComponentRef<NgbOffcanvasBackdrop>,
		private _beforeDismiss?: () => boolean | Promise<boolean>,
	) {
        throw new Error("STUB");
    }

	/**
	 * Closes the offcanvas with an optional `result` value.
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
	 * Dismisses the offcanvas with an optional `reason` value.
	 *
	 * The `NgbOffcanvasRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {
        throw new Error("STUB");
    }

	private _removeOffcanvasElements() {
        throw new Error("STUB");
    }
}
