import {
	AfterViewChecked,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	Output,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { NgbDate } from './ngb-date';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbDatepickerI18n } from './datepicker-i18n';

@Component({
	selector: 'ngb-datepicker-navigation-select',
	encapsulation: ViewEncapsulation.None,
	styleUrl: './datepicker-navigation-select.scss',
	template: `
		<select
			#month
			[disabled]="disabled"
			class="form-select"
			i18n-aria-label="@@ngb.datepicker.select-month"
			aria-label="Select month"
			i18n-title="@@ngb.datepicker.select-month"
			title="Select month"
			(change)="changeMonth($any($event).target.value)"
		>
			@for (m of months; track m) {
				<option [attr.aria-label]="i18n.getMonthFullName(m, date.year)" [value]="m">{{
					i18n.getMonthShortName(m, date.year)
				}}</option>
			}</select
		><select
			#year
			[disabled]="disabled"
			class="form-select"
			i18n-aria-label="@@ngb.datepicker.select-year"
			aria-label="Select year"
			i18n-title="@@ngb.datepicker.select-year"
			title="Select year"
			(change)="changeYear($any($event).target.value)"
		>
			@for (y of years; track y) {
				<option [value]="y">{{ i18n.getYearNumerals(y) }}</option>
			}
		</select>
	`,
})
export class NgbDatepickerNavigationSelect implements AfterViewChecked {
	private _month = -1;
	private _year = -1;

	i18n = inject(NgbDatepickerI18n);

	@Input() date: NgbDate;
	@Input() disabled: boolean;
	@Input() months: number[];
	@Input() years: number[];

	@Output() select = new EventEmitter<NgbDate>();

	@ViewChild('month', { static: true, read: ElementRef }) monthSelect: ElementRef<HTMLSelectElement>;
	@ViewChild('year', { static: true, read: ElementRef }) yearSelect: ElementRef<HTMLSelectElement>;

	changeMonth(month: string) {
        throw new Error("STUB");
    }

	changeYear(year: string) {
        throw new Error("STUB");
    }

	ngAfterViewChecked() {
        throw new Error("STUB");
    }
}
