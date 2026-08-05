import { expect } from 'vitest';
import { locators, Locator } from 'vitest/browser';

expect.extend({
	toHaveCssClass(actual: HTMLElement, className: string) {
        throw new Error("STUB");
    },
	toHaveModal(actual: HTMLElement, content?: string | string[], selector?: string) {
        throw new Error("STUB");
    },
	toHaveBackdrop(actual: HTMLElement) {
        throw new Error("STUB");
    },
	toHaveOffcanvas(actual: HTMLElement, content?: string, selector?: string) {
        throw new Error("STUB");
    },
	toHaveOffcanvasBackdrop(actual: HTMLElement, selector?: string) {
        throw new Error("STUB");
    },
});

locators.extend({
	// Not recommended by vitest, but can be really useful at least to transition
	// from jasmine tests
	getByCss(selector: string) {
        throw new Error("STUB");
    },
});

declare module 'vitest/browser' {
	interface LocatorSelectors {
		// if the custom method returns a string, it will be converted into a locator
		// if it returns anything else, then it will be returned as usual
		getByCss(selector: string): Locator;
	}
}
