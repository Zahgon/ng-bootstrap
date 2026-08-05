import {
	ChangeDetectorRef,
	Component,
	ContentChild,
	EventEmitter,
	forwardRef,
	inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewEncapsulation,
} from '@angular/core';
import { NgbRatingConfig } from './rating-config';
import { getValueInRange } from '@ng-bootstrap/ng-bootstrap/utils';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

/**
 * The context for the custom star display template defined in the `starTemplate`.
 */
export interface StarTemplateContext {
	/**
	 * The star fill percentage, an integer in the `[0, 100]` range.
	 */
	fill: number;

	/**
	 * Index of the star, starts with `0`.
	 */
	index: number;
}

/**
 * A directive that helps visualising and interacting with a star rating bar.
 */
@Component({
	selector: 'ngb-rating',
	imports: [NgTemplateOutlet],
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'd-inline-flex',
		'[tabindex]': 'disabled ? -1 : tabindex',
		role: 'slider',
		'aria-valuemin': '0',
		'[attr.aria-valuemax]': 'max',
		'[attr.aria-valuenow]': 'nextRate',
		'[attr.aria-valuetext]': 'ariaValueText(nextRate, max)',
		'[attr.aria-readonly]': 'readonly && !disabled ? true : null',
		'[attr.aria-disabled]': 'disabled ? true : null',
		'(blur)': 'handleBlur()',
		'(keydown)': 'handleKeyDown($event)',
		'(mouseleave)': 'reset()',
	},
	template: `
		<ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
		@for (_ of contexts; track _; let index = $index) {
			<span class="visually-hidden">({{ index < nextRate ? '*' : ' ' }})</span>
			<span
				(mouseenter)="enter(index + 1)"
				(click)="handleClick(index + 1)"
				[style.cursor]="isInteractive() ? 'pointer' : 'default'"
			>
				<ng-template
					[ngTemplateOutlet]="starTemplate || starTemplateFromContent || t"
					[ngTemplateOutletContext]="contexts[index]"
				/>
			</span>
		}
	`,
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => { throw new Error("STUB"); }), multi: true }],
})
export class NgbRating implements ControlValueAccessor, OnInit, OnChanges {
	contexts: StarTemplateContext[] = [];
	nextRate: number;

	private _config = inject(NgbRatingConfig);
	private _changeDetectorRef = inject(ChangeDetectorRef);

	/**
	 * If `true`, the rating can't be changed or focused.
	 */
	@Input() disabled = false;

	/**
	 * The maximal rating that can be given.
	 */
	@Input() max = this._config.max;

	/**
	 * The current rating. Could be a decimal value like `3.75`.
	 */
	@Input() rate: number;

	/**
	 * If `true`, the rating can't be changed.
	 */
	@Input() readonly = this._config.readonly;

	/**
	 * If `true`, the rating can be reset to `0` by mouse clicking currently set rating.
	 */
	@Input() resettable = this._config.resettable;

	/**
	 * The template to override the way each star is displayed.
	 *
	 * Alternatively put an `<ng-template>` as the only child of your `<ngb-rating>` element
	 */
	@Input() starTemplate: TemplateRef<StarTemplateContext>;
	@ContentChild(TemplateRef, { static: false }) starTemplateFromContent: TemplateRef<StarTemplateContext>;

	/**
	 * Allows setting a custom rating tabindex.
	 * If the component is disabled, `tabindex` will still be set to `-1`.
	 *
	 * @since 13.1.0
	 */
	@Input() tabindex = this._config.tabindex;

	/**
	 * Allows to provide a function to set a custom aria-valuetext
	 *
	 * @since 14.1.0
	 */
	@Input() ariaValueText(current: number, max: number) {
        throw new Error("STUB");
    }

	/**
	 * An event emitted when the user is hovering over a given rating.
	 *
	 * Event payload equals to the rating being hovered over.
	 */
	@Output() hover = new EventEmitter<number>();

	/**
	 * An event emitted when the user stops hovering over a given rating.
	 *
	 * Event payload equals to the rating of the last item being hovered over.
	 */
	@Output() leave = new EventEmitter<number>();

	/**
	 * An event emitted when the rating is changed.
	 *
	 * Event payload equals to the newly selected rating.
	 */
	@Output() rateChange = new EventEmitter<number>(true);

	onChange = (_: any) => {
        throw new Error("STUB");
    };
	onTouched = () => {
        throw new Error("STUB");
    };

	isInteractive(): boolean {
        throw new Error("STUB");
    }

	enter(value: number): void {
        throw new Error("STUB");
    }

	handleBlur() {
        throw new Error("STUB");
    }

	handleClick(value: number) {
        throw new Error("STUB");
    }

	handleKeyDown(event: KeyboardEvent) {
        throw new Error("STUB");
    }

	ngOnChanges(changes: SimpleChanges) {
        throw new Error("STUB");
    }

	ngOnInit(): void {
        throw new Error("STUB");
    }

	registerOnChange(fn: (value: any) => any): void {
        throw new Error("STUB");
    }

	registerOnTouched(fn: () => any): void {
        throw new Error("STUB");
    }

	reset(): void {
        throw new Error("STUB");
    }

	setDisabledState(isDisabled: boolean) {
        throw new Error("STUB");
    }

	update(value: number, internalChange = true): void {
        throw new Error("STUB");
    }

	writeValue(value) {
        throw new Error("STUB");
    }

	private _updateState(nextValue: number) {
		this.nextRate = nextValue;
		this.contexts.forEach(
			(context, index) => { throw new Error("STUB"); },
		);
	}

	private _updateMax() {
        throw new Error("STUB");
    }

	private _setupContexts() {
        throw new Error("STUB");
    }
}
