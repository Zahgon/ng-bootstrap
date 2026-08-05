import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	Directive,
	ElementRef,
	inject,
	Input,
	NgZone,
	QueryList,
	ViewChildren,
	ViewEncapsulation,
} from '@angular/core';
import { distinctUntilChanged, skip, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ngbNavFadeInTransition, ngbNavFadeOutTransition } from './nav-transition';
import { ngbRunTransition, NgbTransitionOptions } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbNav, NgbNavItem } from './nav';
import { NgTemplateOutlet } from '@angular/common';

@Directive({
	selector: '[ngbNavPane]',
	host: {
		'[id]': 'item.panelDomId',
		class: 'tab-pane',
		'[class.fade]': 'nav.animation',
		'[attr.role]': 'role ? role : nav.roles ? "tabpanel" : undefined',
		'[attr.aria-labelledby]': 'item.domId',
	},
})
export class NgbNavPane {
	nativeElement = inject(ElementRef).nativeElement as HTMLElement;

	@Input() item: NgbNavItem;
	@Input() nav: NgbNav;
	@Input() role: string;
}

/**
 * The outlet where currently active nav content will be displayed.
 *
 * @since 5.2.0
 */
@Component({
	selector: '[ngbNavOutlet]',
	imports: [NgbNavPane, NgTemplateOutlet],
	host: {
		class: 'tab-content',
	},
	encapsulation: ViewEncapsulation.None,
	template: `
		@for (item of nav.items; track item) {
			@if (item.isPanelInDom() || isPanelTransitioning(item)) {
				<div ngbNavPane [item]="item" [nav]="nav" [role]="paneRole">
					<ng-template
						[ngTemplateOutlet]="item.contentTpl?.templateRef || null"
						[ngTemplateOutletContext]="{ $implicit: item.active || isPanelTransitioning(item) }"
					/>
				</div>
			}
		}
	`,
})
export class NgbNavOutlet implements AfterViewInit {
	private _cd = inject(ChangeDetectorRef);
	private _ngZone = inject(NgZone);

	private _activePane: NgbNavPane | null = null;

	@ViewChildren(NgbNavPane) private _panes: QueryList<NgbNavPane>;

	/**
	 * A role to set on the nav pane
	 */
	@Input() paneRole;

	/**
	 * Reference to the `NgbNav`
	 */
	@Input('ngbNavOutlet') nav: NgbNav;

	isPanelTransitioning(item: NgbNavItem) {
        throw new Error("STUB");
    }

	ngAfterViewInit() {
        throw new Error("STUB");
    }

	private _updateActivePane() {
        throw new Error("STUB");
    }

	private _getPaneForItem(item: NgbNavItem | null) {
        throw new Error("STUB");
    }

	private _getActivePane(): NgbNavPane | null {
        throw new Error("STUB");
    }
}
