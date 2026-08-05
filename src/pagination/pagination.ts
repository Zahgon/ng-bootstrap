import {
	Component,
	ContentChild,
	Directive,
	EventEmitter,
	inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	TemplateRef,
} from '@angular/core';
import { getValueInRange, isNumber } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbPaginationConfig } from './pagination-config';
import { NgTemplateOutlet } from '@angular/common';

/**
 * A context for the
 * * `NgbPaginationFirst`
 * * `NgbPaginationPrevious`
 * * `NgbPaginationNext`
 * * `NgbPaginationLast`
 * * `NgbPaginationEllipsis`
 * * `NgbPaginationPages`
 *
 * link templates in case you want to override one.
 *
 * @since 4.1.0
 */
export interface NgbPaginationLinkContext {
	/**
	 * Page number displayed by the current link.
	 */
	currentPage: number;

	/**
	 * If `true`, the current link is disabled.
	 */
	disabled: boolean;
}

/**
 * A context for the `NgbPaginationNumber` link template in case you want to override one.
 *
 * Extends `NgbPaginationLinkContext`.
 *
 * @since 4.1.0
 */
export interface NgbPaginationNumberContext extends NgbPaginationLinkContext {
	/**
	 * The page number, displayed by the current page link.
	 */
	$implicit: number;
}

/**
 * A context for the `NgbPaginationPages` pages template in case you want to override
 * the way all pages are displayed.
 *
 * @since 9.1.0
 */
export interface NgbPaginationPagesContext {
	/**
	 * The currently selected page number.
	 */
	$implicit: number;

	/**
	 * If `true`, pagination is disabled.
	 */
	disabled: boolean;

	/**
	 * Pages numbers that should be rendered starting with 1.
	 */
	pages: number[];
}

/**
 * A directive to match the 'ellipsis' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationEllipsis]' })
export class NgbPaginationEllipsis {
	templateRef = inject(TemplateRef<NgbPaginationLinkContext>);
}

/**
 * A directive to match the 'first' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationFirst]' })
export class NgbPaginationFirst {
	templateRef = inject(TemplateRef<NgbPaginationLinkContext>);
}

/**
 * A directive to match the 'last' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationLast]' })
export class NgbPaginationLast {
	templateRef = inject(TemplateRef<NgbPaginationLinkContext>);
}

/**
 * A directive to match the 'next' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationNext]' })
export class NgbPaginationNext {
	templateRef = inject(TemplateRef<NgbPaginationLinkContext>);
}

/**
 * A directive to match the page 'number' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationNumber]' })
export class NgbPaginationNumber {
	templateRef = inject(TemplateRef<NgbPaginationNumberContext>);
}

/**
 * A directive to match the 'previous' link template
 *
 * @since 4.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationPrevious]' })
export class NgbPaginationPrevious {
	templateRef = inject(TemplateRef<NgbPaginationLinkContext>);
}

/**
 * A directive to match the 'pages' whole content
 *
 * @since 9.1.0
 */
@Directive({ selector: 'ng-template[ngbPaginationPages]' })
export class NgbPaginationPages {
	templateRef = inject(TemplateRef<NgbPaginationPagesContext>);
}

/**
 * A component that displays page numbers and allows to customize them in several ways.
 */
@Component({
	selector: 'ngb-pagination',
	imports: [NgTemplateOutlet],
	host: {
		role: 'navigation',
	},
	template: `
		<ng-template #first><span aria-hidden="true" i18n="@@ngb.pagination.first">&laquo;&laquo;</span></ng-template>
		<ng-template #previous><span aria-hidden="true" i18n="@@ngb.pagination.previous">&laquo;</span></ng-template>
		<ng-template #next><span aria-hidden="true" i18n="@@ngb.pagination.next">&raquo;</span></ng-template>
		<ng-template #last><span aria-hidden="true" i18n="@@ngb.pagination.last">&raquo;&raquo;</span></ng-template>
		<ng-template #ellipsis>...</ng-template>
		<ng-template #defaultNumber let-page let-currentPage="currentPage">{{ page }}</ng-template>
		<ng-template #defaultPages let-page let-pages="pages" let-disabled="disabled">
			@for (pageNumber of pages; track $index) {
				<li
					class="page-item"
					[class.active]="pageNumber === page"
					[class.disabled]="isEllipsis(pageNumber) || disabled"
				>
					@if (isEllipsis(pageNumber)) {
						<a class="page-link" tabindex="-1" aria-disabled="true">
							<ng-template
								[ngTemplateOutlet]="tplEllipsis?.templateRef || ellipsis"
								[ngTemplateOutletContext]="{ disabled: true, currentPage: page }"
							/>
						</a>
					} @else {
						<a
							class="page-link"
							href
							(click)="selectPage(pageNumber); $event.preventDefault()"
							[attr.tabindex]="disabled ? '-1' : null"
							[attr.aria-disabled]="disabled ? 'true' : null"
							[attr.aria-current]="pageNumber === page ? 'page' : null"
						>
							<ng-template
								[ngTemplateOutlet]="tplNumber?.templateRef || defaultNumber"
								[ngTemplateOutletContext]="{ disabled: disabled, $implicit: pageNumber, currentPage: page }"
							/>
						</a>
					}
				</li>
			}
		</ng-template>
		<ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
			@if (boundaryLinks) {
				<li class="page-item" [class.disabled]="previousDisabled()">
					<a
						aria-label="First"
						i18n-aria-label="@@ngb.pagination.first-aria"
						class="page-link"
						href
						(click)="selectPage(1); $event.preventDefault()"
						[attr.tabindex]="previousDisabled() ? '-1' : null"
						[attr.aria-disabled]="previousDisabled() ? 'true' : null"
					>
						<ng-template
							[ngTemplateOutlet]="tplFirst?.templateRef || first"
							[ngTemplateOutletContext]="{ disabled: previousDisabled(), currentPage: page }"
						/>
					</a>
				</li>
			}
			@if (directionLinks) {
				<li class="page-item" [class.disabled]="previousDisabled()">
					<a
						aria-label="Previous"
						i18n-aria-label="@@ngb.pagination.previous-aria"
						class="page-link"
						href
						(click)="selectPage(page - 1); $event.preventDefault()"
						[attr.tabindex]="previousDisabled() ? '-1' : null"
						[attr.aria-disabled]="previousDisabled() ? 'true' : null"
					>
						<ng-template
							[ngTemplateOutlet]="tplPrevious?.templateRef || previous"
							[ngTemplateOutletContext]="{ disabled: previousDisabled() }"
						/>
					</a>
				</li>
			}
			<ng-template
				[ngTemplateOutlet]="tplPages?.templateRef || defaultPages"
				[ngTemplateOutletContext]="{ $implicit: page, pages: pages, disabled: disabled }"
			/>
			@if (directionLinks) {
				<li class="page-item" [class.disabled]="nextDisabled()">
					<a
						aria-label="Next"
						i18n-aria-label="@@ngb.pagination.next-aria"
						class="page-link"
						href
						(click)="selectPage(page + 1); $event.preventDefault()"
						[attr.tabindex]="nextDisabled() ? '-1' : null"
						[attr.aria-disabled]="nextDisabled() ? 'true' : null"
					>
						<ng-template
							[ngTemplateOutlet]="tplNext?.templateRef || next"
							[ngTemplateOutletContext]="{ disabled: nextDisabled(), currentPage: page }"
						/>
					</a>
				</li>
			}
			@if (boundaryLinks) {
				<li class="page-item" [class.disabled]="nextDisabled()">
					<a
						aria-label="Last"
						i18n-aria-label="@@ngb.pagination.last-aria"
						class="page-link"
						href
						(click)="selectPage(pageCount); $event.preventDefault()"
						[attr.tabindex]="nextDisabled() ? '-1' : null"
						[attr.aria-disabled]="nextDisabled() ? 'true' : null"
					>
						<ng-template
							[ngTemplateOutlet]="tplLast?.templateRef || last"
							[ngTemplateOutletContext]="{ disabled: nextDisabled(), currentPage: page }"
						/>
					</a>
				</li>
			}
		</ul>
	`,
})
export class NgbPagination implements OnChanges {
	private _config = inject(NgbPaginationConfig);

	pageCount = 0;
	pages: number[] = [];

	@ContentChild(NgbPaginationEllipsis, { static: false }) tplEllipsis?: NgbPaginationEllipsis;
	@ContentChild(NgbPaginationFirst, { static: false }) tplFirst?: NgbPaginationFirst;
	@ContentChild(NgbPaginationLast, { static: false }) tplLast?: NgbPaginationLast;
	@ContentChild(NgbPaginationNext, { static: false }) tplNext?: NgbPaginationNext;
	@ContentChild(NgbPaginationNumber, { static: false }) tplNumber?: NgbPaginationNumber;
	@ContentChild(NgbPaginationPrevious, { static: false }) tplPrevious?: NgbPaginationPrevious;
	@ContentChild(NgbPaginationPages, { static: false }) tplPages?: NgbPaginationPages;

	/**
	 * If `true`, pagination links will be disabled.
	 */
	@Input() disabled = this._config.disabled;

	/**
	 * If `true`, the "First" and "Last" page links are shown.
	 */
	@Input() boundaryLinks = this._config.boundaryLinks;

	/**
	 * If `true`, the "Next" and "Previous" page links are shown.
	 */
	@Input() directionLinks = this._config.directionLinks;

	/**
	 * If `true`, the ellipsis symbols and first/last page numbers will be shown when `maxSize` > number of pages.
	 */
	@Input() ellipses = this._config.ellipses;

	/**
	 * Whether to rotate pages when `maxSize` > number of pages.
	 *
	 * The current page always stays in the middle if `true`.
	 */
	@Input() rotate = this._config.rotate;

	/**
	 *  The number of items in your paginated collection.
	 *
	 *  Note, that this is not the number of pages. Page numbers are calculated dynamically based on
	 *  `collectionSize` and `pageSize`. Ex. if you have 100 items in your collection and displaying 20 items per page,
	 *  you'll end up with 5 pages.
	 */
	@Input({ required: true }) collectionSize: number;

	/**
	 *  The maximum number of pages to display.
	 */
	@Input() maxSize = this._config.maxSize;

	/**
	 *  The current page.
	 *
	 *  Page numbers start with `1`.
	 */
	@Input() page = 1;

	/**
	 *  The number of items per page.
	 */
	@Input() pageSize = this._config.pageSize;

	/**
	 *  An event fired when the page is changed. Will fire only if collection size is set and all values are valid.
	 *
	 *  Event payload is the number of the newly selected page.
	 *
	 *  Page numbers start with `1`.
	 */
	@Output() pageChange = new EventEmitter<number>(true);

	/**
	 * The pagination display size.
	 *
	 * Bootstrap currently supports small and large sizes.
	 *
	 * If the passed value is a string (ex. 'custom'), it will just add the `pagination-custom` css class
	 */
	@Input() size = this._config.size;

	hasPrevious(): boolean {
        throw new Error("STUB");
    }

	hasNext(): boolean {
        throw new Error("STUB");
    }

	nextDisabled(): boolean {
        throw new Error("STUB");
    }

	previousDisabled(): boolean {
        throw new Error("STUB");
    }

	selectPage(pageNumber: number): void {
        throw new Error("STUB");
    }

	ngOnChanges(changes: SimpleChanges): void {
        throw new Error("STUB");
    }

	isEllipsis(pageNumber): boolean {
        throw new Error("STUB");
    }

	/**
	 * Appends ellipses and first/last page number to the displayed pages
	 */
	private _applyEllipses(start: number, end: number) {
        throw new Error("STUB");
    }

	/**
	 * Rotates page numbers based on maxSize items visible.
	 * Currently selected page stays in the middle:
	 *
	 * Ex. for selected page = 6:
	 * [5,*6*,7] for maxSize = 3
	 * [4,5,*6*,7] for maxSize = 4
	 */
	private _applyRotation(): [number, number] {
        throw new Error("STUB");
    }

	/**
	 * Paginates page numbers based on maxSize items per page.
	 */
	private _applyPagination(): [number, number] {
        throw new Error("STUB");
    }

	private _setPageInRange(newPageNo) {
        throw new Error("STUB");
    }

	private _updatePages(newPage: number) {
        throw new Error("STUB");
    }
}
