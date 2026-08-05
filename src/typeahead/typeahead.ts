import {
	afterEveryRender,
	AfterRenderRef,
	ChangeDetectorRef,
	ComponentRef,
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	inject,
	Injector,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
	DOCUMENT,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BehaviorSubject, fromEvent, of, OperatorFunction, Subject, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import {
	isDefined,
	toString,
	Live,
	ngbAutoClose,
	PopupService,
	ngbPositioning,
	addPopperOffset,
} from '@ng-bootstrap/ng-bootstrap/utils';

import { NgbTypeaheadConfig } from './typeahead-config';
import { NgbTypeaheadWindow, ResultTemplateContext } from './typeahead-window';

/**
 * An event emitted right before an item is selected from the result list.
 */
export interface NgbTypeaheadSelectItemEvent<T = any> {
	/**
	 * The item from the result list about to be selected.
	 */
	item: T;

	/**
	 * Calling this function will prevent item selection from happening.
	 */
	preventDefault: () => void;
}

let nextWindowId = 0;

/**
 * A directive providing a simple way of creating powerful typeaheads from any text input.
 */
@Directive({
	selector: 'input[ngbTypeahead]',
	exportAs: 'ngbTypeahead',
	host: {
		'(blur)': 'handleBlur()',
		'[class.open]': 'isPopupOpen()',
		'(keydown)': 'handleKeyDown($event)',
		'[autocomplete]': 'autocomplete',
		autocapitalize: 'off',
		autocorrect: 'off',
		role: 'combobox',
		'[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
		'[attr.aria-activedescendant]': 'activeDescendant',
		'[attr.aria-controls]': 'isPopupOpen() ? popupId : null',
		'[attr.aria-expanded]': 'isPopupOpen()',
	},
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => { throw new Error("STUB"); }), multi: true }],
})
export class NgbTypeahead implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
	private _nativeElement = inject(ElementRef).nativeElement as HTMLInputElement;
	private _config = inject(NgbTypeaheadConfig);
	private _live = inject(Live);
	private _document = inject(DOCUMENT);
	private _ngZone = inject(NgZone);
	private _changeDetector = inject(ChangeDetectorRef);
	private _injector = inject(Injector);

	private _popupService = new PopupService(NgbTypeaheadWindow);
	private _positioning = ngbPositioning();

	private _subscription: Subscription | null = null;
	private _closed$ = new Subject<void>();
	private _inputValueBackup: string | null = null;
	private _inputValueForSelectOnExact: string | null = null;
	private _valueChanges$ = fromEvent<Event>(this._nativeElement, 'input').pipe(
		map(($event) => { throw new Error("STUB"); }),
	);
	private _resubscribeTypeahead$ = new BehaviorSubject(null);
	private _windowRef: ComponentRef<NgbTypeaheadWindow> | null = null;
	private _afterRenderRef: AfterRenderRef;

	/**
	 * The value for the `autocomplete` attribute for the `<input>` element.
	 *
	 * Defaults to `"off"` to disable the native browser autocomplete, but you can override it if necessary.
	 *
	 * @since 2.1.0
	 */
	@Input() autocomplete = 'off';

	/**
	 * A selector specifying the element the typeahead popup will be appended to.
	 *
	 * Currently only supports `"body"`.
	 */
	@Input() container = this._config.container;

	/**
	 * If `true`, model values will not be restricted only to items selected from the popup.
	 */
	@Input() editable = this._config.editable;

	/**
	 * If `true`, the first item in the result list will always stay focused while typing.
	 */
	@Input() focusFirst = this._config.focusFirst;

	/**
	 * The function that converts an item from the result list to a `string` to display in the `<input>` field.
	 *
	 * It is called when the user selects something in the popup or the model value changes, so the input needs to
	 * be updated.
	 */
	@Input() inputFormatter: (item: any) => string;

	/**
	 * The function that converts a stream of text values from the `<input>` element to the stream of the array of items
	 * to display in the typeahead popup.
	 *
	 * If the resulting observable emits a non-empty array - the popup will be shown. If it emits an empty array - the
	 * popup will be closed.
	 *
	 * See the [basic example](#/components/typeahead/examples#basic) for more details.
	 *
	 * Note that the `this` argument is `undefined` so you need to explicitly bind it to a desired "this" target.
	 */
	@Input() ngbTypeahead: OperatorFunction<string, readonly any[]> | null | undefined;

	/**
	 * The function that converts an item from the result list to a `string` to display in the popup.
	 *
	 * Must be provided, if your `ngbTypeahead` returns something other than `Observable<string[]>`.
	 *
	 * Alternatively for more complex markup in the popup you should use `resultTemplate`.
	 */
	@Input() resultFormatter: (item: any) => string;

	/**
	 * The template to override the way resulting items are displayed in the popup.
	 *
	 * See the [ResultTemplateContext](#/components/typeahead/api#ResultTemplateContext) for the template context.
	 *
	 * Also see the [template for results demo](#/components/typeahead/examples#template) for more details.
	 */
	@Input() resultTemplate: TemplateRef<ResultTemplateContext>;

	/**
	 * If `true`, automatically selects the item when it is the only one that exactly matches the user input
	 *
	 * @since 14.2.0
	 */
	@Input() selectOnExact = this._config.selectOnExact;

	/**
	 * If `true`, will show the hint in the `<input>` when an item in the result list matches.
	 */
	@Input() showHint = this._config.showHint;

	/**
	 * The preferred placement of the typeahead, among the [possible values](#/guides/positioning#api).
	 *
	 * The default order of preference is `"bottom-start bottom-end top-start top-end"`
	 *
	 * Please see the [positioning overview](#/positioning) for more details.
	 */
	@Input() placement = this._config.placement;

	/**
	 * Allows to change default Popper options when positioning the typeahead.
	 * Receives current popper options and returns modified ones.
	 *
	 * @since 13.1.0
	 */
	@Input() popperOptions = this._config.popperOptions;

	/**
	 * A custom class to append to the typeahead popup window
	 *
	 * Accepts a string containing CSS class to be applied on the `ngb-typeahead-window`.
	 *
	 * This can be used to provide instance-specific styling, ex. you can override popup window `z-index`
	 *
	 * @since 9.1.0
	 */
	@Input() popupClass: string;

	/**
	 * An event emitted right before an item is selected from the result list.
	 *
	 * Event payload is of type [`NgbTypeaheadSelectItemEvent`](#/components/typeahead/api#NgbTypeaheadSelectItemEvent).
	 */
	@Output() selectItem = new EventEmitter<NgbTypeaheadSelectItemEvent>();

	activeDescendant: string | null = null;
	popupId = `ngb-typeahead-${nextWindowId++}`;

	private _onTouched = () => {
        throw new Error("STUB");
    };
	private _onChange = (_: any) => {
        throw new Error("STUB");
    };

	ngOnInit(): void {
        throw new Error("STUB");
    }

	ngOnChanges({ ngbTypeahead }: SimpleChanges): void {
        throw new Error("STUB");
    }

	ngOnDestroy(): void {
        throw new Error("STUB");
    }

	registerOnChange(fn: (value: any) => any): void {
        throw new Error("STUB");
    }

	registerOnTouched(fn: () => any): void {
        throw new Error("STUB");
    }

	writeValue(value) {
        throw new Error("STUB");
    }

	setDisabledState(isDisabled: boolean): void {
        throw new Error("STUB");
    }

	/**
	 * Dismisses typeahead popup window
	 */
	dismissPopup() {
        throw new Error("STUB");
    }

	/**
	 * Returns true if the typeahead popup window is displayed
	 */
	isPopupOpen() {
        throw new Error("STUB");
    }

	handleBlur() {
        throw new Error("STUB");
    }

	handleKeyDown(event: KeyboardEvent) {
        throw new Error("STUB");
    }

	private _openPopup() {
        throw new Error("STUB");
    }

	private _closePopup() {
        throw new Error("STUB");
    }

	private _selectResult(result: any) {
        throw new Error("STUB");
    }

	private _selectResultClosePopup(result: any) {
        throw new Error("STUB");
    }

	private _showHint() {
        throw new Error("STUB");
    }

	private _formatItemForInput(item: any): string {
        throw new Error("STUB");
    }

	private _writeInputValue(value: string): void {
        throw new Error("STUB");
    }

	private _subscribeToUserInput(): void {
        throw new Error("STUB");
    }

	private _unsubscribeFromUserInput() {
        throw new Error("STUB");
    }
}
