import {
	ChangeDetectorRef,
	Component,
	forwardRef,
	Input,
	OnChanges,
	SimpleChanges,
	ViewEncapsulation,
	ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isInteger, isNumber, padNumber, toInteger } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbTime } from './ngb-time';
import { NgbTimepickerConfig } from './timepicker-config';
import { NgbTimeAdapter } from './ngb-time-adapter';
import { NgbTimepickerI18n } from './timepicker-i18n';

const FILTER_REGEX = /[^0-9]/g;

/**
 * A directive that helps with wth picking hours, minutes and seconds.
 */
@Component({
	exportAs: 'ngbTimepicker',
	selector: 'ngb-timepicker',
	encapsulation: ViewEncapsulation.None,
	styleUrl: './timepicker.scss',
	template: `
		<fieldset [disabled]="disabled" [class.disabled]="disabled">
			<div class="ngb-tp">
				<div class="ngb-tp-input-container ngb-tp-hour">
					@if (spinners) {
						<button
							tabindex="-1"
							type="button"
							(click)="changeHour(hourStep)"
							class="btn btn-link"
							[class.btn-sm]="isSmallSize"
							[class.btn-lg]="isLargeSize"
							[class.disabled]="disabled"
							[disabled]="disabled"
						>
							<span class="chevron ngb-tp-chevron"></span>
							<span class="visually-hidden" i18n="@@ngb.timepicker.increment-hours">Increment hours</span>
						</button>
					}
					<input
						type="text"
						class="ngb-tp-input form-control"
						[class.form-control-sm]="isSmallSize"
						[class.form-control-lg]="isLargeSize"
						maxlength="2"
						inputmode="numeric"
						placeholder="HH"
						i18n-placeholder="@@ngb.timepicker.HH"
						[value]="formatHour($safeNavigationMigration(model?.hour))"
						(change)="updateHour($any($event).target.value)"
						[readOnly]="readonlyInputs"
						[disabled]="disabled"
						aria-label="Hours"
						i18n-aria-label="@@ngb.timepicker.hours"
						(blur)="handleBlur()"
						(input)="formatInput($any($event).target)"
						(keydown.ArrowUp)="changeHour(hourStep); $event.preventDefault()"
						(keydown.ArrowDown)="changeHour(-hourStep); $event.preventDefault()"
					/>
					@if (spinners) {
						<button
							tabindex="-1"
							type="button"
							(click)="changeHour(-hourStep)"
							class="btn btn-link"
							[class.btn-sm]="isSmallSize"
							[class.btn-lg]="isLargeSize"
							[class.disabled]="disabled"
							[disabled]="disabled"
						>
							<span class="chevron ngb-tp-chevron bottom"></span>
							<span class="visually-hidden" i18n="@@ngb.timepicker.decrement-hours">Decrement hours</span>
						</button>
					}
				</div>
				<div class="ngb-tp-spacer">:</div>
				<div class="ngb-tp-input-container ngb-tp-minute">
					@if (spinners) {
						<button
							tabindex="-1"
							type="button"
							(click)="changeMinute(minuteStep)"
							class="btn btn-link"
							[class.btn-sm]="isSmallSize"
							[class.btn-lg]="isLargeSize"
							[class.disabled]="disabled"
							[disabled]="disabled"
						>
							<span class="chevron ngb-tp-chevron"></span>
							<span class="visually-hidden" i18n="@@ngb.timepicker.increment-minutes">Increment minutes</span>
						</button>
					}
					<input
						type="text"
						class="ngb-tp-input form-control"
						[class.form-control-sm]="isSmallSize"
						[class.form-control-lg]="isLargeSize"
						maxlength="2"
						inputmode="numeric"
						placeholder="MM"
						i18n-placeholder="@@ngb.timepicker.MM"
						[value]="formatMinSec($safeNavigationMigration(model?.minute))"
						(change)="updateMinute($any($event).target.value)"
						[readOnly]="readonlyInputs"
						[disabled]="disabled"
						aria-label="Minutes"
						i18n-aria-label="@@ngb.timepicker.minutes"
						(blur)="handleBlur()"
						(input)="formatInput($any($event).target)"
						(keydown.ArrowUp)="changeMinute(minuteStep); $event.preventDefault()"
						(keydown.ArrowDown)="changeMinute(-minuteStep); $event.preventDefault()"
					/>
					@if (spinners) {
						<button
							tabindex="-1"
							type="button"
							(click)="changeMinute(-minuteStep)"
							class="btn btn-link"
							[class.btn-sm]="isSmallSize"
							[class.btn-lg]="isLargeSize"
							[class.disabled]="disabled"
							[disabled]="disabled"
						>
							<span class="chevron ngb-tp-chevron bottom"></span>
							<span class="visually-hidden" i18n="@@ngb.timepicker.decrement-minutes">Decrement minutes</span>
						</button>
					}
				</div>
				@if (seconds) {
					<div class="ngb-tp-spacer">:</div>
					<div class="ngb-tp-input-container ngb-tp-second">
						@if (spinners) {
							<button
								tabindex="-1"
								type="button"
								(click)="changeSecond(secondStep)"
								class="btn btn-link"
								[class.btn-sm]="isSmallSize"
								[class.btn-lg]="isLargeSize"
								[class.disabled]="disabled"
								[disabled]="disabled"
							>
								<span class="chevron ngb-tp-chevron"></span>
								<span class="visually-hidden" i18n="@@ngb.timepicker.increment-seconds">Increment seconds</span>
							</button>
						}
						<input
							type="text"
							class="ngb-tp-input form-control"
							[class.form-control-sm]="isSmallSize"
							[class.form-control-lg]="isLargeSize"
							maxlength="2"
							inputmode="numeric"
							placeholder="SS"
							i18n-placeholder="@@ngb.timepicker.SS"
							[value]="formatMinSec($safeNavigationMigration(model?.second))"
							(change)="updateSecond($any($event).target.value)"
							[readOnly]="readonlyInputs"
							[disabled]="disabled"
							aria-label="Seconds"
							i18n-aria-label="@@ngb.timepicker.seconds"
							(blur)="handleBlur()"
							(input)="formatInput($any($event).target)"
							(keydown.ArrowUp)="changeSecond(secondStep); $event.preventDefault()"
							(keydown.ArrowDown)="changeSecond(-secondStep); $event.preventDefault()"
						/>
						@if (spinners) {
							<button
								tabindex="-1"
								type="button"
								(click)="changeSecond(-secondStep)"
								class="btn btn-link"
								[class.btn-sm]="isSmallSize"
								[class.btn-lg]="isLargeSize"
								[class.disabled]="disabled"
								[disabled]="disabled"
							>
								<span class="chevron ngb-tp-chevron bottom"></span>
								<span class="visually-hidden" i18n="@@ngb.timepicker.decrement-seconds">Decrement seconds</span>
							</button>
						}
					</div>
				}
				@if (meridian) {
					<div class="ngb-tp-spacer"></div>
					<div class="ngb-tp-meridian">
						<button
							type="button"
							class="btn btn-outline-primary"
							[class.btn-sm]="isSmallSize"
							[class.btn-lg]="isLargeSize"
							[disabled]="disabled"
							[class.disabled]="disabled"
							(click)="toggleMeridian()"
						>
							@if (model && model.hour >= 12) {
								<ng-container i18n="@@ngb.timepicker.PM">{{ i18n.getAfternoonPeriod() }}</ng-container>
							} @else {
								<ng-container>{{ i18n.getMorningPeriod() }}</ng-container>
							}
						</button>
					</div>
				}
			</div>
		</fieldset>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => { throw new Error("STUB"); }), multi: true }],
})
export class NgbTimepicker implements ControlValueAccessor, OnChanges {
	static ngAcceptInputType_size: string;

	disabled: boolean;
	model?: NgbTime;

	private _hourStep: number;
	private _minuteStep: number;
	private _secondStep: number;

	/**
	 * Whether to display 12H or 24H mode.
	 */
	@Input() meridian: boolean;

	/**
	 * If `true`, the spinners above and below inputs are visible.
	 */
	@Input() spinners: boolean;

	/**
	 * If `true`, it is possible to select seconds.
	 */
	@Input() seconds: boolean;

	/**
	 * The number of hours to add/subtract when clicking hour spinners.
	 */
	@Input()
	set hourStep(step: number) {
        throw new Error("STUB");
    }

	get hourStep(): number {
        throw new Error("STUB");
    }

	/**
	 * The number of minutes to add/subtract when clicking minute spinners.
	 */
	@Input()
	set minuteStep(step: number) {
        throw new Error("STUB");
    }

	get minuteStep(): number {
        throw new Error("STUB");
    }

	/**
	 * The number of seconds to add/subtract when clicking second spinners.
	 */
	@Input()
	set secondStep(step: number) {
        throw new Error("STUB");
    }

	get secondStep(): number {
        throw new Error("STUB");
    }

	/**
	 * If `true`, the timepicker is readonly and can't be changed.
	 */
	@Input() readonlyInputs: boolean;

	/**
	 * The size of inputs and buttons.
	 */
	@Input() size: 'small' | 'medium' | 'large';

	constructor(
		private readonly _config: NgbTimepickerConfig,
		private _ngbTimeAdapter: NgbTimeAdapter<any>,
		private _cd: ChangeDetectorRef,
		public i18n: NgbTimepickerI18n,
	) {
		this.meridian = _config.meridian;
		this.spinners = _config.spinners;
		this.seconds = _config.seconds;
		this.hourStep = _config.hourStep;
		this.minuteStep = _config.minuteStep;
		this.secondStep = _config.secondStep;
		this.disabled = _config.disabled;
		this.readonlyInputs = _config.readonlyInputs;
		this.size = _config.size;
	}

	onChange = (_: any) => {
        throw new Error("STUB");
    };
	onTouched = () => {
        throw new Error("STUB");
    };

	writeValue(value) {
        throw new Error("STUB");
    }

	registerOnChange(fn: (value: any) => any): void {
        throw new Error("STUB");
    }

	registerOnTouched(fn: () => any): void {
        throw new Error("STUB");
    }

	setDisabledState(isDisabled: boolean) {
        throw new Error("STUB");
    }

	/**
	 * Increments the hours by the given step.
	 */
	changeHour(step: number) {
        throw new Error("STUB");
    }

	/**
	 * Increments the minutes by the given step.
	 */
	changeMinute(step: number) {
        throw new Error("STUB");
    }

	/**
	 * Increments the seconds by the given step.
	 */
	changeSecond(step: number) {
        throw new Error("STUB");
    }

	/**
	 * Update hours with the new value.
	 */
	updateHour(newVal: string) {
        throw new Error("STUB");
    }

	/**
	 * Update minutes with the new value.
	 */
	updateMinute(newVal: string) {
        throw new Error("STUB");
    }

	/**
	 * Update seconds with the new value.
	 */
	updateSecond(newVal: string) {
        throw new Error("STUB");
    }

	toggleMeridian() {
        throw new Error("STUB");
    }

	formatInput(input: HTMLInputElement) {
        throw new Error("STUB");
    }

	formatHour(value?: number) {
        throw new Error("STUB");
    }

	formatMinSec(value?: number) {
        throw new Error("STUB");
    }

	handleBlur() {
        throw new Error("STUB");
    }

	get isSmallSize(): boolean {
        throw new Error("STUB");
    }

	get isLargeSize(): boolean {
        throw new Error("STUB");
    }

	ngOnChanges(changes: SimpleChanges): void {
        throw new Error("STUB");
    }

	private propagateModelChange(touched = true) {
        throw new Error("STUB");
    }
}
