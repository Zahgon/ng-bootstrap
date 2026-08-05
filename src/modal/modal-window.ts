import {
	afterNextRender,
	ChangeDetectorRef,
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
	ViewChild,
	ViewEncapsulation,
	DOCUMENT,
	ChangeDetectionStrategy,
} from '@angular/core';

import { fromEvent, Observable, Subject, zip } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { ModalDismissReasons } from './modal-dismiss-reasons';
import {
	isDefined,
	isString,
	getFocusableBoundaryElements,
	ngbRunTransition,
	NgbTransitionOptions,
	reflow,
} from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbModalUpdatableOptions } from './modal-config';

const WINDOW_ATTRIBUTES: string[] = [
	'animation',
	'ariaLabelledBy',
	'ariaDescribedBy',
	'backdrop',
	'centered',
	'fullscreen',
	'keyboard',
	'role',
	'scrollable',
	'size',
	'windowClass',
	'modalDialogClass',
] as const;

@Component({
	selector: 'ngb-modal-window',
	host: {
		'[class]': '"modal d-block" + (windowClass ? " " + windowClass : "")',
		'[class.fade]': 'animation',
		tabindex: '-1',
		'[attr.aria-modal]': 'true',
		'[attr.aria-labelledby]': 'ariaLabelledBy',
		'[attr.aria-describedby]': 'ariaDescribedBy',
		'[attr.role]': 'role',
	},
	template: `
		<div
			#dialog
			[class]="
				'modal-dialog' +
				(size ? ' modal-' + size : '') +
				(centered ? ' modal-dialog-centered' : '') +
				fullscreenClass +
				(scrollable ? ' modal-dialog-scrollable' : '') +
				(modalDialogClass ? ' ' + modalDialogClass : '')
			"
			role="document"
		>
			<div class="modal-content"><ng-content /></div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './modal.scss',
})
export class NgbModalWindow implements OnInit, OnDestroy {
	private _document = inject(DOCUMENT);
	private _elRef = inject(ElementRef<HTMLElement>);
	private _zone = inject(NgZone);
	private _injector = inject(Injector);
	private _cdRef = inject(ChangeDetectorRef);

	private _closed$ = new Subject<void>();
	private _elWithFocus: Element | null = null; // element that is focused prior to modal opening

	@ViewChild('dialog', { static: true }) private _dialogEl: ElementRef<HTMLElement>;

	@Input() animation: boolean;
	@Input() ariaLabelledBy: string;
	@Input() ariaDescribedBy: string;
	@Input() backdrop: boolean | string = true;
	@Input() centered: string;
	@Input() fullscreen: string | boolean;
	@Input() keyboard = true;
	@Input() role: string = 'dialog';
	@Input() scrollable: string;
	@Input() size: string;
	@Input() windowClass: string;
	@Input() modalDialogClass: string;

	@Output('dismiss') dismissEvent = new EventEmitter();

	shown = new Subject<void>();
	hidden = new Subject<void>();

	get fullscreenClass(): string {
        throw new Error("STUB");
    }

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

	updateOptions(options: NgbModalUpdatableOptions): void {
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

	private _bumpBackdrop() {
        throw new Error("STUB");
    }
}
