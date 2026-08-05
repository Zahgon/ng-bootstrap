import { reflow, NgbTransitionStartFn } from '@ng-bootstrap/ng-bootstrap/utils';

export const ngbToastFadeInTransition: NgbTransitionStartFn = (element: HTMLElement, animation: true) => {
    throw new Error("STUB");
};

export const ngbToastFadeOutTransition: NgbTransitionStartFn = ({ classList }: HTMLElement) => {
    throw new Error("STUB");
};
