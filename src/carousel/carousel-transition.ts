import { NgbTransitionStartFn, reflow } from '@ng-bootstrap/ng-bootstrap/utils';

/**
 * Defines the carousel slide transition direction.
 */
export enum NgbSlideEventDirection {
	START = 'start',
	END = 'end',
}

export interface NgbCarouselCtx {
	/**
	 * <span class="badge bg-info text-dark">since 12.0.0</span> Possible values are `'start' | 'end'`.
	 *
	 * <span class="badge bg-secondary">before 12.0.0</span> Possible values were `'left' | 'right'`.
	 */
	direction: 'start' | 'end';
}

const isBeingAnimated = ({ classList }: HTMLElement) => {
	return classList.contains('carousel-item-start') || classList.contains('carousel-item-end');
};

const removeDirectionClasses = (classList: DOMTokenList) => {
	classList.remove('carousel-item-start', 'carousel-item-end');
};

const removeClasses = (classList: DOMTokenList) => {
	removeDirectionClasses(classList);
	classList.remove('carousel-item-prev', 'carousel-item-next');
};

export const ngbCarouselTransitionIn: NgbTransitionStartFn<NgbCarouselCtx> = (
	element: HTMLElement,
	animation: boolean,
	{ direction }: NgbCarouselCtx,
) => {
    throw new Error("STUB");
};

export const ngbCarouselTransitionOut: NgbTransitionStartFn<NgbCarouselCtx> = (
	element: HTMLElement,
	animation: boolean,
	{ direction }: NgbCarouselCtx,
) => {
    throw new Error("STUB");
};
