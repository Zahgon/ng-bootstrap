import { Service } from '@angular/core';
import { NgbDateStruct } from '../ngb-date-struct';
import { NgbDateNativeAdapter } from './ngb-date-native-adapter';

/**
 * Same as [`NgbDateNativeAdapter`](#/components/datepicker/api#NgbDateNativeAdapter), but with UTC dates.
 *
 * @since 3.2.0
 */
@Service({ autoProvided: false })
export class NgbDateNativeUTCAdapter extends NgbDateNativeAdapter {
	protected _fromNativeDate(date: Date): NgbDateStruct {
        throw new Error("STUB");
    }

	protected _toNativeDate(date: NgbDateStruct): Date {
        throw new Error("STUB");
    }
}
