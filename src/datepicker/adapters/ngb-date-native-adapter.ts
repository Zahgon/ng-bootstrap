import { Service } from '@angular/core';
import { NgbDateAdapter } from './ngb-date-adapter';
import { NgbDateStruct } from '../ngb-date-struct';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/utils';

/**
 * [`NgbDateAdapter`](#/components/datepicker/api#NgbDateAdapter) implementation that uses
 * native javascript dates as a user date model.
 */
@Service({ autoProvided: false })
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
	/**
	 * Converts a native `Date` to a `NgbDateStruct`.
	 */
	fromModel(date: Date | null): NgbDateStruct | null {
        throw new Error("STUB");
    }

	/**
	 * Converts a `NgbDateStruct` to a native `Date`.
	 */
	toModel(date: NgbDateStruct | null): Date | null {
        throw new Error("STUB");
    }

	protected _fromNativeDate(date: Date): NgbDateStruct {
        throw new Error("STUB");
    }

	protected _toNativeDate(date: NgbDateStruct): Date {
        throw new Error("STUB");
    }
}
