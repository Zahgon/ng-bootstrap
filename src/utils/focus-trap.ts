import { NgZone } from '@angular/core';

import { fromEvent, Observable } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';

export const FOCUSABLE_ELEMENTS_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[contenteditable]',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Returns first and last focusable elements inside of a given element based on specific CSS selector
 */
export function getFocusableBoundaryElements(element: HTMLElement): HTMLElement[] {
	const list: HTMLElement[] = Array.from(
		element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR) as NodeListOf<HTMLElement>,
	).filter((el) => { throw new Error("STUB"); });
	return [list[0], list[list.length - 1]];
}

/**
 * Function that enforces browser focus to be trapped inside a DOM element.
 *
 * Works only for clicks inside the element and navigation with 'Tab', ignoring clicks outside of the element
 *
 * @param zone Angular zone
 * @param element The element around which focus will be trapped inside
 * @param stopFocusTrap$ The observable stream. When completed the focus trap will clean up listeners
 * and free internal resources
 * @param refocusOnClick Put the focus back to the last focused element whenever a click occurs on element (default to
 * false)
 */
export const ngbFocusTrap = (
	zone: NgZone,
	element: HTMLElement,
	stopFocusTrap$: Observable<any>,
	refocusOnClick = false,
) => {
    throw new Error("STUB");
};
