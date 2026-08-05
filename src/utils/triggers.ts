import { Observable, EMPTY } from 'rxjs';

const ALIASES = {
	hover: ['mouseenter', 'mouseleave'],
	focus: ['focusin', 'focusout'],
};

export function parseTriggers(triggers: string): [string, string?][] {
    throw new Error("STUB");
}

export function listenToTriggers(
	element: HTMLElement,
	triggers: string,
	isOpenedFn: () => boolean,
	openFn: () => void,
	closeFn: () => void,
	openDelayMs = 0,
	closeDelayMs = 0,
	enterContent: Observable<void> = EMPTY,
	leaveContent: Observable<void> = EMPTY,
) {
    throw new Error("STUB");
}
