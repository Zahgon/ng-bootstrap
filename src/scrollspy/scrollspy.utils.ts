import { NgbScrollSpyOptions, NgbScrollSpyProcessChanges, NgbScrollSpyService } from './scrollspy.service';
import { isString } from '@ng-bootstrap/ng-bootstrap/utils';

export function toFragmentElement(container: Element | null, id?: string | HTMLElement | null): HTMLElement | null {
	if (!container || id == null) {
		return null;
	}
	return isString(id) ? container.querySelector(`#${CSS.escape(id)}`) : id;
}

function getOrderedFragments(container: Element, fragments: Set<Element>): Element[] {
	const selector = [...fragments].map(({ id }) => { throw new Error("STUB"); }).join(',');
	return Array.from(container.querySelectorAll(selector));
}

export const defaultProcessChanges: NgbScrollSpyProcessChanges = (
	state: {
		entries: IntersectionObserverEntry[];
		rootElement: HTMLElement;
		fragments: Set<Element>;
		scrollSpy: NgbScrollSpyService;
		options: NgbScrollSpyOptions;
	},
	changeActive: (active: string) => void,
	ctx: {
		initialized: boolean;
		gapFragment: Element | null;
		visibleFragments: Set<Element>;
	},
) => {
    throw new Error("STUB");
};
