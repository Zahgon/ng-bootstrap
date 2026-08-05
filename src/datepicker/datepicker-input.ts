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
	Output,
	SimpleChanges,
	TemplateRef,
	ViewContainerRef,
	DOCUMENT,
} from '@angular/core';

import {
	AbstractControl,
	ControlValueAccessor,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	ValidationErrors,
	Validator,
} from '@angular/forms';

import { ngbAutoClose, ngbFocusTrap, ngbPositioning, addPopperOffset } from '@ng-bootstrap/ng-bootstrap/utils';

import { NgbDateAdapter } from './adapters/ngb-date-adapter';
import { NgbDatepicker, NgbDatepickerNavigateEvent } from './datepicker';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDateParserFormatter } from './ngb-date-parser-formatter';
import { NgbDateStruct } from './ngb-date-struct';
import { NgbInputDatepickerConfig } from './datepicker-input-config';
import { NgbDatepickerConfig } from './datepicker-config';
import { isString } from '@ng-bootstrap/ng-bootstrap/utils';
import { Subject } from 'rxjs';
import { ContentTemplateContext } from './datepicker-content-template-context';

/**
 * A directive that allows to stick a datepicker popup to an input field.
 *
 * Manages interaction with the input field itself, does value formatting and provides forms integration.
 */
@Directive({
	selector: 'input[ngbDatepicker]',
	exportAs: 'ngbDatepicker',
	host: {
		'(input)': 'manualDateChange($any($event).target.value)',
		'(change)': 'manualDateChange($any($event).target.value, true)',
		'(focus)': 'onFocus()',
		'(blur)': 'onBlur()',
		'[disabled]': 'disabled',
	},
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => { throw new Error("STUB"); }), multi: true },
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => { throw new Error("STUB"); }), multi: true },
		{ provide: NgbDatepickerConfig, useExisting: NgbInputDatepickerConfig },
	],
})
export class NgbInputDatepicker implements OnChanges, OnDestroy, ControlValueAccessor, Validator {
	static ngAcceptInputType_autoClose: boolean | string;
	static ngAcceptInputType_disabled: boolean | '';
	static ngAcceptInputType_navigation: string;
	static ngAcceptInputType_outsideDays: string;
	static ngAcceptInputType_weekdays: boolean | string;

	private _parserFormatter = inject(NgbDateParserFormatter);
	private _elRef = inject(ElementRef<HTMLInputElement>);
	private _vcRef = inject(ViewContainerRef);
	private _ngZone = inject(NgZone);
	private _calendar = inject(NgbCalendar);
	private _dateAdapter = inject(NgbDateAdapter<any>);
	private _document = inject(DOCUMENT);
	private _changeDetector = inject(ChangeDetectorRef);
	private _injector = inject(Injector);
	private _config = inject(NgbInputDatepickerConfig);

	private _cRef: ComponentRef<NgbDatepicker> | null = null;
	private _disabled = false;
	private _elWithFocus: HTMLElement | null = null;
	private _model: NgbDate | null = null;
	private _inputValue: string;
	private _afterRenderRef: AfterRenderRef | undefined;
	private _positioning = ngbPositioning();
	private _destroyCloseHandlers$ = new Subject<void>();

	/**
	 * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
	 *
	 * * `true` - the popup will close on both date selection and outside click.
	 * * `false` - the popup can only be closed manually via `close()` or `toggle()` methods.
	 * * `"inside"` - the popup will close on date selection, but not outside clicks.
	 * * `"outside"` - the popup will close only on the outside click and not on date selection/inside clicks.
	 *
	 * @since 3.0.0
	 */
	@Input() autoClose = this._config.autoClose;

	/**
	 * The reference to a custom content template.
	 *
	 * Allows to completely override the way datepicker.
	 *
	 * See [`NgbDatepickerContent`](#/components/datepicker/api#NgbDatepickerContent) for more details.
	 *
	 * @since 14.2.0
	 */
	@Input() contentTemplate: TemplateRef<ContentTemplateContext>;

	/**
	 * An optional class applied to the datepicker popup element.
	 *
	 * @since 9.1.0
	 */
	@Input() datepickerClass: string;

	/**
	 * The reference to a custom template for the day.
	 *
	 * Allows to completely override the way a day 'cell' in the calendar is displayed.
	 *
	 * See [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext) for the data you get inside.
	 */
	@Input() dayTemplate: TemplateRef<DayTemplateContext>;

	/**
	 * The callback to pass any arbitrary data to the template cell via the
	 * [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext)'s `data` parameter.
	 *
	 * `current` is the month that is currently displayed by the datepicker.
	 *
	 * @since 3.3.0
	 */
	@Input() dayTemplateData: (date: NgbDate, current?: { year: number; month: number }) => any;

	/**
	 * The number of months to display.
	 */
	@Input() displayMonths: number;

	/**
	 * The first day of the week.
	 *
	 * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
	 */
	@Input() firstDayOfWeek: number;

	/**
	 * The reference to the custom template for the datepicker footer.
	 *
	 * @since 3.3.0
	 */
	@Input() footerTemplate: TemplateRef<any>;

	/**
	 * The callback to mark some dates as disabled.
	 *
	 * It is called for each new date when navigating to a different month.
	 *
	 * `current` is the month that is currently displayed by the datepicker.
	 */
	@Input() markDisabled: (date: NgbDate, current?: { year: number; month: number }) => boolean;

	/**
	 * The earliest date that can be displayed or selected. Also used for form validation.
	 *
	 * If not provided, 'year' select box will display 10 years before the current month.
	 */
	@Input() minDate: NgbDateStruct;

	/**
	 * The latest date that can be displayed or selected. Also used for form validation.
	 *
	 * If not provided, 'year' select box will display 10 years after the current month.
	 */
	@Input() maxDate: NgbDateStruct;

	/**
	 * Navigation type.
	 *
	 * * `"select"` - select boxes for month and navigation arrows
	 * * `"arrows"` - only navigation arrows
	 * * `"none"` - no navigation visible at all
	 */
	@Input() navigation: 'select' | 'arrows' | 'none';

	/**
	 * The way of displaying days that don't belong to the current month.
	 *
	 * * `"visible"` - days are visible
	 * * `"hidden"` - days are hidden, white space preserved
	 * * `"collapsed"` - days are collapsed, so the datepicker height might change between months
	 *
	 * For the 2+ months view, days in between months are never shown.
	 */
	@Input() outsideDays: 'visible' | 'collapsed' | 'hidden';

	/**
	 * The preferred placement of the datepicker popup, among the [possible values](#/guides/positioning#api).
	 *
	 * The default order of preference is `"bottom-start bottom-end top-start top-end"`
	 *
	 * Please see the [positioning overview](#/positioning) for more details.
	 */
	@Input() placement = this._config.placement;

	/**
	 * Allows to change default Popper options when positioning the popup.
	 * Receives current popper options and returns modified ones.
	 *
	 * @since 13.1.0
	 */
	@Input() popperOptions = this._config.popperOptions;

	/**
	 * If `true`, when closing datepicker will focus element that was focused before datepicker was opened.
	 *
	 * Alternatively you could provide a selector or an `HTMLElement` to focus. If the element doesn't exist or invalid,
	 * we'll fallback to focus document body.
	 *
	 * @since 5.2.0
	 */
	@Input() restoreFocus: true | string | HTMLElement;

	/**
	 * If `true`, week numbers will be displayed.
	 */
	@Input() showWeekNumbers: boolean;

	/**
	 * The date to open calendar with.
	 *
	 * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
	 * If nothing or invalid date is provided, calendar will open with current month.
	 *
	 * You could use `navigateTo(date)` method as an alternative.
	 */
	@Input() startDate: { year: number; month: number; day?: number };

	/**
	 * A selector specifying the element the datepicker popup should be appended to.
	 *
	 * Currently only supports `"body"`.
	 */
	@Input() container = this._config.container;

	/**
	 * A css selector or html element specifying the element the datepicker popup should be positioned against.
	 *
	 * By default the input is used as a target.
	 *
	 * @since 4.2.0
	 */
	@Input() positionTarget = this._config.positionTarget;

	/**
	 * The way weekdays should be displayed.
	 *
	 * * `true` - weekdays are displayed using default width
	 * * `false` - weekdays are not displayed
	 * * `"short" | "long" | "narrow"` - weekdays are displayed using specified width
	 *
	 * @since 9.1.0
	 */
	@Input() weekdays: Exclude<Intl.DateTimeFormatOptions['weekday'], undefined> | boolean;

	/**
	 * An event emitted when user selects a date using keyboard or mouse.
	 *
	 * The payload of the event is currently selected `NgbDate`.
	 *
	 * @since 1.1.1
	 */
	@Output() dateSelect = new EventEmitter<NgbDate>();

	/**
	 * Event emitted right after the navigation happens and displayed month changes.
	 *
	 * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
	 */
	@Output() navigate = new EventEmitter<NgbDatepickerNavigateEvent>();

	/**
	 * An event fired after closing datepicker window.
	 *
	 * @since 4.2.0
	 */
	@Output() closed = new EventEmitter<void>();

	@Input()
	get disabled() {
        throw new Error("STUB");
    }
	set disabled(value: any) {
        throw new Error("STUB");
    }

	private _onChange = (_: any) => {
        throw new Error("STUB");
    };
	private _onTouched = () => {
        throw new Error("STUB");
    };
	private _validatorChange = () => {
        throw new Error("STUB");
    };

	registerOnChange(fn: (value: any) => any): void {
        throw new Error("STUB");
    }

	registerOnTouched(fn: () => any): void {
        throw new Error("STUB");
    }

	registerOnValidatorChange(fn: () => void): void {
        throw new Error("STUB");
    }

	setDisabledState(isDisabled: boolean): void {
        throw new Error("STUB");
    }

	validate(c: AbstractControl): ValidationErrors | null {
        throw new Error("STUB");
    }

	writeValue(value) {
        throw new Error("STUB");
    }

	manualDateChange(value: string, updateView = false) {
        throw new Error("STUB");
    }

	isOpen() {
        throw new Error("STUB");
    }

	/**
	 * Opens the datepicker popup.
	 *
	 * If the related form control contains a valid date, the corresponding month will be opened.
	 */
	open() {
        throw new Error("STUB");
    }

	/**
	 * Closes the datepicker popup.
	 */
	close() {
        throw new Error("STUB");
    }

	/**
	 * Toggles the datepicker popup.
	 */
	toggle() {
        throw new Error("STUB");
    }

	/**
	 * Navigates to the provided date.
	 *
	 * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
	 * If nothing or invalid date provided calendar will open current month.
	 *
	 * Use the `[startDate]` input as an alternative.
	 */
	navigateTo(date?: { year: number; month: number; day?: number }) {
        throw new Error("STUB");
    }

	onBlur() {
        throw new Error("STUB");
    }

	onFocus() {
        throw new Error("STUB");
    }

	ngOnChanges(changes: SimpleChanges) {
        throw new Error("STUB");
    }

	ngOnDestroy() {
        throw new Error("STUB");
    }

	private _applyDatepickerInputs(datepickerComponentRef: ComponentRef<NgbDatepicker>): void {
        throw new Error("STUB");
    }

	private _applyPopupClass(newClass: string, oldClass?: string) {
        throw new Error("STUB");
    }

	private _applyPopupStyling(nativeElement: HTMLElement) {
        throw new Error("STUB");
    }

	private _subscribeForDatepickerOutputs(datepickerInstance: NgbDatepicker) {
        throw new Error("STUB");
    }

	private _writeModelValue(model: NgbDate | null) {
        throw new Error("STUB");
    }

	private _fromDateStruct(date: NgbDateStruct | null): NgbDate | null {
        throw new Error("STUB");
    }

	private _setCloseHandlers() {
        throw new Error("STUB");
    }
}
