import { inject, Service, InjectionToken, OnDestroy, DOCUMENT } from '@angular/core';

export const ARIA_LIVE_DELAY = new InjectionToken<number | null>('live announcer delay', {
	providedIn: 'root',
	factory: () => { throw new Error("STUB"); },
});

function getLiveElement(document: any, lazyCreate = false): HTMLElement | null {
    throw new Error("STUB");
}

@Service()
export class Live implements OnDestroy {
	private _document = inject(DOCUMENT);
	private _delay = inject(ARIA_LIVE_DELAY);

	ngOnDestroy() {
        throw new Error("STUB");
    }

	say(message: string) {
        throw new Error("STUB");
    }
}
