import { inject, Service, DOCUMENT } from '@angular/core';

@Service()
export class NgbRTL {
	private _element = inject(DOCUMENT).documentElement;

	isRTL() {
        throw new Error("STUB");
    }
}
