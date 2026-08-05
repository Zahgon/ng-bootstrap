import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDateStruct } from './ngb-date-struct';
import { DatepickerViewModel, NgbDayTemplateData, NgbMarkDisabled } from './datepicker-view-model';
import { inject, Service } from '@angular/core';
import { isInteger, toInteger } from '@ng-bootstrap/ng-bootstrap/utils';
import { Observable, Subject } from 'rxjs';
import {
	buildMonths,
	checkDateInRange,
	checkMinBeforeMax,
	generateSelectBoxMonths,
	generateSelectBoxYears,
	isChangedDate,
	isChangedMonth,
	isDateSelectable,
	nextMonthDisabled,
	prevMonthDisabled,
} from './datepicker-tools';

import { filter } from 'rxjs/operators';
import { NgbDatepickerI18n } from './datepicker-i18n';

export type DatepickerServiceInputs = Partial<{
	dayTemplateData: NgbDayTemplateData;
	displayMonths: number;
	disabled: boolean;
	firstDayOfWeek: number;
	focusVisible: boolean;
	markDisabled: NgbMarkDisabled;
	maxDate: NgbDate | null;
	minDate: NgbDate | null;
	navigation: 'select' | 'arrows' | 'none';
	outsideDays: 'visible' | 'collapsed' | 'hidden';
	weekdays: Exclude<Intl.DateTimeFormatOptions['weekday'], undefined> | boolean;
}>;

@Service({ autoProvided: false })
export class NgbDatepickerService {
	private _VALIDATORS: {
		[K in keyof DatepickerServiceInputs]: (v: DatepickerServiceInputs[K]) => Partial<DatepickerViewModel> | void;
	} = {
		dayTemplateData: (dayTemplateData: NgbDayTemplateData) => {
            throw new Error("STUB");
        },
		displayMonths: (displayMonths: number) => {
            throw new Error("STUB");
        },
		disabled: (disabled: boolean) => {
            throw new Error("STUB");
        },
		firstDayOfWeek: (firstDayOfWeek: number) => {
            throw new Error("STUB");
        },
		focusVisible: (focusVisible: boolean) => {
            throw new Error("STUB");
        },
		markDisabled: (markDisabled: NgbMarkDisabled) => {
            throw new Error("STUB");
        },
		maxDate: (date: NgbDate | null) => {
            throw new Error("STUB");
        },
		minDate: (date: NgbDate | null) => {
            throw new Error("STUB");
        },
		navigation: (navigation: 'select' | 'arrows' | 'none') => {
            throw new Error("STUB");
        },
		outsideDays: (outsideDays: 'visible' | 'collapsed' | 'hidden') => {
            throw new Error("STUB");
        },
		weekdays: (weekdays: boolean | Exclude<Intl.DateTimeFormatOptions['weekday'], undefined>) => {
            throw new Error("STUB");
        },
	};

	private _calendar = inject(NgbCalendar);
	private _i18n = inject(NgbDatepickerI18n);

	private _model$ = new Subject<DatepickerViewModel>();

	private _dateSelect$ = new Subject<NgbDate>();

	private _state: DatepickerViewModel = {
		dayTemplateData: null,
		markDisabled: null,
		maxDate: null,
		minDate: null,
		disabled: false,
		displayMonths: 1,
		firstDate: null,
		firstDayOfWeek: 1,
		lastDate: null,
		focusDate: null,
		focusVisible: false,
		months: [],
		navigation: 'select',
		outsideDays: 'visible',
		prevDisabled: false,
		nextDisabled: false,
		selectedDate: null,
		selectBoxes: { years: [], months: [] },
		weekdayWidth: 'narrow',
		weekdaysVisible: true,
	};

	get model$(): Observable<DatepickerViewModel> {
        throw new Error("STUB");
    }

	get dateSelect$(): Observable<NgbDate> {
        throw new Error("STUB");
    }

	set(options: DatepickerServiceInputs) {
		let patch = Object.keys(options)
			.map((key) => { throw new Error("STUB"); })
			.reduce((obj, part) => { throw new Error("STUB"); }, {});

		if (Object.keys(patch).length > 0) {
			this._nextState(patch);
		}
	}

	focus(date?: NgbDate | null) {
		const focusedDate = this.toValidDate(date, null);
		if (focusedDate != null && !this._state.disabled && isChangedDate(this._state.focusDate, focusedDate)) {
			this._nextState({ focusDate: date });
		}
	}

	focusSelect() {
        throw new Error("STUB");
    }

	open(date?: NgbDate | null) {
        throw new Error("STUB");
    }

	select(date?: NgbDate | null, options: { emitEvent?: boolean } = {}) {
        throw new Error("STUB");
    }

	toValidDate(date?: NgbDateStruct | null, defaultValue?: NgbDate | null): NgbDate | null {
		const ngbDate = NgbDate.from(date);
		if (defaultValue === undefined) {
			defaultValue = this._calendar.getToday();
		}
		return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
	}

	getMonth(struct: NgbDateStruct) {
		for (let month of this._state.months) {
			if (struct.month === month.number && struct.year === month.year) {
				return month;
			}
		}
		throw new Error(`month ${struct.month} of year ${struct.year} not found`);
	}

	private _nextState(patch: Partial<DatepickerViewModel>) {
		const newState = this._updateState(patch);
		this._patchContexts(newState);
		this._state = newState;
		this._model$.next(this._state);
	}

	private _patchContexts(state: DatepickerViewModel) {
		const { months, displayMonths, selectedDate, focusDate, focusVisible, disabled, outsideDays } = state;
		state.months.forEach((month) => {
            throw new Error("STUB");
        });
	}

	private _updateState(patch: Partial<DatepickerViewModel>): DatepickerViewModel {
		// patching fields
		const state = Object.assign({}, this._state, patch);

		let startDate = state.firstDate;

		// min/max dates changed
		if ('minDate' in patch || 'maxDate' in patch) {
			checkMinBeforeMax(state.minDate, state.maxDate);
			state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
			state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
			startDate = state.focusDate;
		}

		// disabled
		if ('disabled' in patch) {
			state.focusVisible = false;
		}

		// initial rebuild via 'select()'
		if ('selectedDate' in patch && this._state.months.length === 0) {
			startDate = state.selectedDate;
		}

		// terminate early if only focus visibility was changed
		if ('focusVisible' in patch) {
			return state;
		}

		// focus date changed
		if ('focusDate' in patch) {
			state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
			startDate = state.focusDate;

			// nothing to rebuild if only focus changed and it is still visible
			if (
				state.months.length !== 0 &&
				state.focusDate &&
				!state.focusDate.before(state.firstDate) &&
				!state.focusDate.after(state.lastDate)
			) {
				return state;
			}
		}

		// first date changed
		if ('firstDate' in patch) {
			state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
			startDate = state.firstDate;
		}

		// rebuilding months
		if (startDate) {
			const forceRebuild =
				'dayTemplateData' in patch ||
				'firstDayOfWeek' in patch ||
				'markDisabled' in patch ||
				'minDate' in patch ||
				'maxDate' in patch ||
				'disabled' in patch ||
				'outsideDays' in patch ||
				'weekdaysVisible' in patch;

			const months = buildMonths(this._calendar, startDate, state, this._i18n, forceRebuild);

			// updating months and boundary dates
			state.months = months;
			state.firstDate = months[0].firstDate;
			state.lastDate = months[months.length - 1].lastDate;

			// reset selected date if 'markDisabled' returns true
			if ('selectedDate' in patch && !isDateSelectable(state.selectedDate, state)) {
				state.selectedDate = null;
			}

			// adjusting focus after months were built
			if ('firstDate' in patch) {
				if (!state.focusDate || state.focusDate.before(state.firstDate) || state.focusDate.after(state.lastDate)) {
					state.focusDate = startDate;
				}
			}

			// adjusting months/years for the select box navigation
			const yearChanged = !this._state.firstDate || this._state.firstDate.year !== state.firstDate.year;
			const monthChanged = !this._state.firstDate || this._state.firstDate.month !== state.firstDate.month;
			if (state.navigation === 'select') {
				// years ->  boundaries (min/max were changed)
				if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.years.length === 0 || yearChanged) {
					state.selectBoxes.years = generateSelectBoxYears(state.firstDate, state.minDate, state.maxDate);
				}

				// months -> when current year or boundaries change
				if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.months.length === 0 || yearChanged) {
					state.selectBoxes.months = generateSelectBoxMonths(
						this._calendar,
						state.firstDate,
						state.minDate,
						state.maxDate,
					);
				}
			} else {
				state.selectBoxes = { years: [], months: [] };
			}

			// updating navigation arrows -> boundaries change (min/max) or month/year changes
			if (
				(state.navigation === 'arrows' || state.navigation === 'select') &&
				(monthChanged || yearChanged || 'minDate' in patch || 'maxDate' in patch || 'disabled' in patch)
			) {
				state.prevDisabled = state.disabled || prevMonthDisabled(this._calendar, state.firstDate, state.minDate);
				state.nextDisabled = state.disabled || nextMonthDisabled(this._calendar, state.lastDate, state.maxDate);
			}
		}

		return state;
	}
}
