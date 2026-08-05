import { Service } from '@angular/core';
import { NgbDatepicker } from './datepicker';

/**
 * A service that represents the keyboard navigation.
 *
 * Default keyboard shortcuts [are documented in the overview](#/components/datepicker/overview#keyboard-shortcuts)
 *
 * @since 5.2.0
 */
@Service()
export class NgbDatepickerKeyboardService {
	/**
	 * Processes a keyboard event.
	 */
	processKey(event: KeyboardEvent, datepicker: NgbDatepicker) {
        throw new Error("STUB");
    }
}
