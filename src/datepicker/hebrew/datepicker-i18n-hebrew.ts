import { NgbDatepickerI18n } from '../datepicker-i18n';
import { NgbDateStruct } from '../ngb-date-struct';
import { hebrewNumerals, isHebrewLeapYear } from './hebrew';
import { Service } from '@angular/core';

const WEEKDAYS = ['שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת', 'ראשון'];
const MONTHS = ['תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
const MONTHS_LEAP = [
	'תשרי',
	'חשון',
	'כסלו',
	'טבת',
	'שבט',
	'אדר א׳',
	'אדר ב׳',
	'ניסן',
	'אייר',
	'סיון',
	'תמוז',
	'אב',
	'אלול',
];

/**
 * @since 3.2.0
 */
@Service({ autoProvided: false })
export class NgbDatepickerI18nHebrew extends NgbDatepickerI18n {
	getMonthShortName(month: number, year?: number): string {
        throw new Error("STUB");
    }

	getMonthFullName(month: number, year?: number): string {
		return isHebrewLeapYear(year) ? MONTHS_LEAP[month - 1] || '' : MONTHS[month - 1] || '';
	}

	getWeekdayLabel(weekday: number, width?: Intl.DateTimeFormatOptions['weekday']) {
		return WEEKDAYS[weekday - 1] || '';
	}

	getDayAriaLabel(date: NgbDateStruct): string {
		return `${hebrewNumerals(date.day)} ${this.getMonthFullName(date.month, date.year)} ${hebrewNumerals(date.year)}`;
	}

	getDayNumerals(date: NgbDateStruct): string {
        throw new Error("STUB");
    }

	getWeekNumerals(weekNumber: number): string {
        throw new Error("STUB");
    }

	getYearNumerals(year: number): string {
        throw new Error("STUB");
    }
}
