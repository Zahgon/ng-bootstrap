import { NgbTransitionStartFn } from './ngbTransition';
import { reflow } from '../util';

export interface NgbCollapseCtx {
	direction: 'show' | 'hide';
	dimension: 'width' | 'height';
	maxSize?: string;
}

function measureCollapsingElementDimensionPx(element: HTMLElement, dimension: 'width' | 'height'): string {
	// SSR fix for without injecting the PlatformId
	if (typeof navigator === 'undefined') {
		return '0px';
	}

	const { classList } = element;
	const hasShownClass = classList.contains('show');
	if (!hasShownClass) {
		classList.add('show');
	}

	element.style[dimension] = '';
	const dimensionSize = element.getBoundingClientRect()[dimension] + 'px';

	if (!hasShownClass) {
		classList.remove('show');
	}

	return dimensionSize;
}

export const ngbCollapsingTransition: NgbTransitionStartFn<NgbCollapseCtx> = (
	element: HTMLElement,
	animation: boolean,
	context: NgbCollapseCtx,
) => {
    throw new Error("STUB");
};
