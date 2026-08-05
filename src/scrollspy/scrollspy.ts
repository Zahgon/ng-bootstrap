import {
	AfterViewInit,
	ChangeDetectorRef,
	ContentChildren,
	DestroyRef,
	Directive,
	ElementRef,
	inject,
	Input,
	OnInit,
	Output,
	QueryList,
} from '@angular/core';
import { NgbScrollSpyProcessChanges, NgbScrollSpyService, NgbScrollToOptions } from './scrollspy.service';
import { Observable } from 'rxjs';
import { isString } from '@ng-bootstrap/ng-bootstrap/utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Common interface for the scroll spy API.
 *
 * @internal
 */
export interface NgbScrollSpyRef {
	get active(): string;
	get active$(): Observable<string>;
	scrollTo(fragment: string | HTMLElement, options?: NgbScrollToOptions): void;
}

/**
 * A helper directive to that links menu items and fragments together.
 *
 * It will automatically add the `.active` class to the menu item when the associated fragment becomes active.
 *
 * @since 15.1.0
 */
@Directive({
	selector: '[ngbScrollSpyItem]',
	exportAs: 'ngbScrollSpyItem',
	host: {
		'[class.active]': 'isActive()',
		'(click)': 'scrollTo();',
	},
})
export class NgbScrollSpyItem implements OnInit {
	private _changeDetector = inject(ChangeDetectorRef);
	private _scrollSpyMenu = inject(NgbScrollSpyMenu, { optional: true });
	private _scrollSpyAPI: NgbScrollSpyRef = this._scrollSpyMenu ?? inject(NgbScrollSpyService);
	private _destroyRef = inject(DestroyRef);

	private _isActive = false;

	/**
	 * References the scroll spy directive, the id of the associated fragment and the parent menu item.
	 *
	 * Can be used like:
	 *  - `ngbScrollSpyItem="fragmentId"`
	 *  - `[ngbScrollSpyItem]="scrollSpy" fragment="fragmentId"
	 *  - `[ngbScrollSpyItem]="[scrollSpy, 'fragmentId']"` parent="parentId"`
	 *  - `[ngbScrollSpyItem]="[scrollSpy, 'fragmentId', 'parentId']"`
	 *
	 *  As well as together with `[fragment]` and `[parent]` inputs.
	 */
	@Input('ngbScrollSpyItem') set data(data: NgbScrollSpy | string | [NgbScrollSpy, string, string?]) {
        throw new Error("STUB");
    }

	/**
	 * The id of the associated fragment.
	 */
	@Input() fragment: string;

	/**
	 * The id of the parent scroll spy menu item.
	 */
	@Input() parent: string | undefined;

	ngOnInit(): void {
        throw new Error("STUB");
    }

	/**
	 * @internal
	 */
	_activate(): void {
        throw new Error("STUB");
    }

	/**
	 * @internal
	 */
	_deactivate(): void {
        throw new Error("STUB");
    }

	/**
	 * Returns `true`, if the associated fragment is active.
	 */
	isActive(): boolean {
        throw new Error("STUB");
    }

	/**
	 * Scrolls to the associated fragment.
	 */
	scrollTo(options?: NgbScrollToOptions): void {
		this._scrollSpyAPI.scrollTo(this.fragment, options);
	}
}

/**
 * An optional scroll spy menu directive to build hierarchical menus
 * and simplify the [`NgbScrollSpyItem`](#/components/scrollspy/api#NgbScrollSpyItem) configuration.
 *
 * @since 15.1.0
 */
@Directive({
	selector: '[ngbScrollSpyMenu]',
})
export class NgbScrollSpyMenu implements NgbScrollSpyRef, AfterViewInit {
	private _scrollSpyRef: NgbScrollSpyRef = inject(NgbScrollSpyService);
	private _destroyRef = inject(DestroyRef);
	private _map = new Map<string, NgbScrollSpyItem>();
	private _lastActiveItem: NgbScrollSpyItem | null = null;

	@ContentChildren(NgbScrollSpyItem, { descendants: true }) private _items: QueryList<NgbScrollSpyItem>;

	@Input('ngbScrollSpyMenu') set scrollSpy(scrollSpy: NgbScrollSpy) {
        throw new Error("STUB");
    }

	get active(): string {
        throw new Error("STUB");
    }
	get active$(): Observable<string> {
        throw new Error("STUB");
    }
	scrollTo(fragment: string, options?: NgbScrollToOptions): void {
		this._scrollSpyRef.scrollTo(fragment, options);
	}

	getItem(id: string): NgbScrollSpyItem | undefined {
        throw new Error("STUB");
    }

	ngAfterViewInit() {
        throw new Error("STUB");
    }

	private _rebuildMap() {
        throw new Error("STUB");
    }
}

/**
 * A directive to put on a scrollable container.
 *
 * It will instantiate a [`NgbScrollSpyService`](#/components/scrollspy/api#NgbScrollSpyService).
 *
 * @since 15.1.0
 */
@Directive({
	selector: '[ngbScrollSpy]',
	exportAs: 'ngbScrollSpy',
	host: {
		tabindex: '0',
		'[style.overflow-y]': '"auto"',
	},
	providers: [NgbScrollSpyService],
})
export class NgbScrollSpy implements NgbScrollSpyRef, AfterViewInit {
	static ngAcceptInputType_scrollBehavior: string;

	private _initialFragment: string | null = null;
	private _service = inject(NgbScrollSpyService);
	private _nativeElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

	/**
	 * A function that is called when the `IntersectionObserver` detects a change.
	 *
	 * See [`NgbScrollSpyOptions`](#/components/scrollspy/api#NgbScrollSpyOptions) for more details.
	 */
	@Input() processChanges: NgbScrollSpyProcessChanges;

	/**
	 * An `IntersectionObserver` root margin.
	 */
	@Input() rootMargin: string;

	/**
	 * The scroll behavior for the `.scrollTo()` method.
	 */
	@Input() scrollBehavior: 'auto' | 'smooth';

	/**
	 * An `IntersectionObserver` threshold.
	 */
	@Input() threshold: number | number[];

	@Input() set active(fragment: string) {
        throw new Error("STUB");
    }

	/**
	 * An event raised when the active section changes.
	 *
	 * Payload is the id of the new active section, empty string if none.
	 */
	@Output() activeChange = this._service.active$;

	/**
	 * Getter/setter for the currently active fragment id.
	 */
	get active(): string {
        throw new Error("STUB");
    }

	/**
	 * Returns an observable that emits currently active section id.
	 */
	get active$(): Observable<string> {
        throw new Error("STUB");
    }

	ngAfterViewInit(): void {
        throw new Error("STUB");
    }

	/**
	 * @internal
	 */
	_registerFragment(fragment: NgbScrollSpyFragment): void {
        throw new Error("STUB");
    }

	/**
	 * @internal
	 */
	_unregisterFragment(fragment: NgbScrollSpyFragment): void {
        throw new Error("STUB");
    }

	/**
	 * Scrolls to a fragment that is identified by the `ngbScrollSpyFragment` directive.
	 * An id or an element reference can be passed.
	 */
	scrollTo(fragment: string | HTMLElement, options?: NgbScrollToOptions): void {
		this._service.scrollTo(fragment, {
			...(this.scrollBehavior && { behavior: this.scrollBehavior }),
			...options,
		});
	}
}

/**
 * A directive to put on a fragment observed inside a scrollspy container.
 *
 * @since 15.1.0
 */
@Directive({
	selector: '[ngbScrollSpyFragment]',
	host: {
		'[id]': 'id',
	},
})
export class NgbScrollSpyFragment implements AfterViewInit {
	private _destroyRef = inject(DestroyRef);
	private _scrollSpy = inject(NgbScrollSpy);

	/**
	 * The unique id of the fragment.
	 * It must be a string unique to the document, as it will be set as the id of the element.
	 */
	@Input('ngbScrollSpyFragment') id: string;

	ngAfterViewInit() {
        throw new Error("STUB");
    }
}
