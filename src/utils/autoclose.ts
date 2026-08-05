import { NgZone } from '@angular/core';
import { fromEvent, Observable, race } from 'rxjs';
import { delay, filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { closest } from './util';

const isContainedIn = (element: HTMLElement, array?: HTMLElement[]) =>
	{ throw new Error("STUB"); };

const matchesSelectorIfAny = (element: HTMLElement, selector?: string) =>
	{ throw new Error("STUB"); };

// we have to add a more significant delay to avoid re-opening when handling (click) on a toggling element
// TODO: use proper Angular platform detection when NgbAutoClose becomes a service and we can inject PLATFORM_ID
const isMobile = (() => {
    throw new Error("STUB");
})();

// setting 'ngbAutoClose' synchronously on mobile results in immediate popup closing
// when tapping on the triggering element
const wrapAsyncForMobile = (fn) => { throw new Error("STUB"); };

export const enum SOURCE {
	ESCAPE,
	CLICK,
}

export function ngbAutoClose(
	zone: NgZone,
	document: any,
	type: boolean | 'inside' | 'outside',
	close: (source: SOURCE) => void,
	closed$: Observable<any>,
	insideElements: HTMLElement[],
	ignoreElements?: HTMLElement[],
	insideSelector?: string,
) {
    throw new Error("STUB");
}
