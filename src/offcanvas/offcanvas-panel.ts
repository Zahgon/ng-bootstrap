import {
	afterNextRender,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Output,
	ViewEncapsulation,
	DOCUMENT,
	ChangeDetectionStrategy,
} from '@angular/core';

import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import {
	reflow,
	getFocusableBoundaryElements,
	ngbRunTransition,
	NgbTransitionOptions,
} from '@ng-bootstrap/ng-bootstrap/utils';

@Component({
	selector: 'ngb-offcanvas-panel',
	template: '<ng-content />',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {
		'[class]': '"offcanvas offcanvas-" + position  + (panelClass ? " " + panelClass : "")',
		role: 'dialog',
		tabindex: '-1',
		'[attr.aria-modal]': 'true',
		'[attr.aria-labelledby]': 'ariaLabelledBy',
		'[attr.aria-describedby]': 'ariaDescribedBy',
	},
})
export class NgbOffcanvasPanel implements OnInit, OnDestroy {
	private _document = inject(DOCUMENT);
	private _elRef = inject(ElementRef<HTMLElement>);
	private _zone = inject(NgZone);
	private _injector = inject(Injector);

	private _closed$ = new Subject<void>();
	private _elWithFocus: Element | null = null; // element that is focused prior to offcanvas opening

	@Input() animation: boolean;
	@Input() ariaLabelledBy?: string;
	@Input() ariaDescribedBy?: string;
	@Input() keyboard = true;
	@Input() panelClass: string;
	@Input() position: 'start' | 'end' | 'top' | 'bottom' = 'start';

	@Output('dismiss') dismissEvent = new EventEmitter();

	shown = new Subject<void>();
	hidden = new Subject<void>();

	dismiss(reason): void {
        throw new Error("STUB");
    }

	ngOnInit() {
        throw new Error("STUB");
    }

	ngOnDestroy() {
        throw new Error("STUB");
    }

	hide(): Observable<any> {
        throw new Error("STUB");
    }

	private _show() {
        throw new Error("STUB");
    }

	private _enableEventHandling() {
        throw new Error("STUB");
    }

	private _disableEventHandling() {
        throw new Error("STUB");
    }

	private _setFocus() {
        throw new Error("STUB");
    }

	private _restoreFocus() {
        throw new Error("STUB");
    }
}
