import {
	AfterContentInit,
	afterNextRender,
	afterEveryRender,
	AfterRenderRef,
	ChangeDetectorRef,
	ContentChild,
	ContentChildren,
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	inject,
	Injector,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	SimpleChanges,
	DOCUMENT,
} from '@angular/core';

import { fromEvent, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import {
	ngbPositioning,
	Placement,
	PlacementArray,
	addPopperOffset,
	ngbAutoClose,
	SOURCE,
	FOCUSABLE_ELEMENTS_SELECTOR,
	getActiveElement,
} from '@ng-bootstrap/ng-bootstrap/utils';

import { NgbDropdownConfig } from './dropdown-config';

/**
 * A directive you should put on a dropdown item to enable keyboard navigation.
 * Arrow keys will move focus between items marked with this directive.
 *
 * @since 4.1.0
 */
@Directive({
	selector: '[ngbDropdownItem]',
	host: {
		class: 'dropdown-item',
		'[class.disabled]': 'disabled',
		'[tabIndex]': 'disabled ? -1 : tabindex',
	},
})
export class NgbDropdownItem {
	static ngAcceptInputType_disabled: boolean | '';

	private _disabled = false;

	nativeElement = inject(ElementRef).nativeElement as HTMLElement;

	@Input() tabindex: string | number = 0;

	@Input()
	set disabled(value: boolean) {
        throw new Error("STUB");
    }

	get disabled(): boolean {
        throw new Error("STUB");
    }
}

/**
 * A directive that will be applied if dropdown item is a button.
 * It will only set the disabled property.
 */
@Directive({
	selector: 'button[ngbDropdownItem]',
	host: { '[disabled]': 'item.disabled' },
})
export class NgbDropdownButtonItem {
	item = inject(NgbDropdownItem);
}

/**
 * A directive that wraps dropdown menu content and dropdown items.
 */
@Directive({
	selector: '[ngbDropdownMenu]',
	host: {
		class: 'dropdown-menu',
		'[class.show]': 'dropdown.isOpen()',
		'(keydown.ArrowUp)': 'dropdown.onKeyDown($any($event))',
		'(keydown.ArrowDown)': 'dropdown.onKeyDown($any($event))',
		'(keydown.Home)': 'dropdown.onKeyDown($any($event))',
		'(keydown.End)': 'dropdown.onKeyDown($any($event))',
		'(keydown.Enter)': 'dropdown.onKeyDown($any($event))',
		'(keydown.Space)': 'dropdown.onKeyDown($any($event))',
		'(keydown.Tab)': 'dropdown.onKeyDown($any($event))',
		'(keydown.Shift.Tab)': 'dropdown.onKeyDown($any($event))',
	},
})
export class NgbDropdownMenu {
	dropdown = inject(NgbDropdown);
	nativeElement = inject(ElementRef).nativeElement as HTMLElement;

	@ContentChildren(NgbDropdownItem) menuItems: QueryList<NgbDropdownItem>;
}

/**
 * A directive to mark an element to which dropdown menu will be anchored.
 *
 * This is a simple version of the `NgbDropdownToggle` directive.
 * It plays the same role, but doesn't listen to click events to toggle dropdown menu thus enabling support
 * for events other than click.
 *
 * @since 1.1.0
 */
@Directive({
	selector: '[ngbDropdownAnchor]',
	host: {
		class: 'dropdown-toggle',
		'[class.show]': 'dropdown.isOpen()',
		'[attr.aria-expanded]': 'dropdown.isOpen()',
	},
})
export class NgbDropdownAnchor {
	dropdown = inject(NgbDropdown);
	nativeElement = inject(ElementRef).nativeElement as HTMLElement;
}

/**
 * A directive to mark an element that will toggle dropdown via the `click` event.
 *
 * You can also use `NgbDropdownAnchor` as an alternative.
 */
@Directive({
	selector: '[ngbDropdownToggle]',
	host: {
		class: 'dropdown-toggle',
		'[class.show]': 'dropdown.isOpen()',
		'[attr.aria-expanded]': 'dropdown.isOpen()',
		'(click)': 'dropdown.toggle()',
		'(keydown.ArrowUp)': 'dropdown.onKeyDown($any($event))',
		'(keydown.ArrowDown)': 'dropdown.onKeyDown($any($event))',
		'(keydown.Home)': 'dropdown.onKeyDown($any($event))',
		'(keydown.End)': 'dropdown.onKeyDown($any($event))',
		'(keydown.Tab)': 'dropdown.onKeyDown($any($event))',
		'(keydown.Shift.Tab)': 'dropdown.onKeyDown($any($event))',
	},
	providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => { throw new Error("STUB"); }) }],
})
export class NgbDropdownToggle extends NgbDropdownAnchor {}

/**
 * A directive that provides contextual overlays for displaying lists of links and more.
 */
@Directive({
	selector: '[ngbDropdown]',
	exportAs: 'ngbDropdown',
	host: { '[class.show]': 'isOpen()' },
})
export class NgbDropdown implements OnInit, AfterContentInit, OnChanges, OnDestroy {
	static ngAcceptInputType_autoClose: boolean | string;
	static ngAcceptInputType_display: string;

	private _changeDetector = inject(ChangeDetectorRef);
	private _config = inject(NgbDropdownConfig);
	private _document = inject(DOCUMENT);
	private _injector = inject(Injector);
	private _ngZone = inject(NgZone);
	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;

	private _destroyCloseHandlers$ = new Subject<void>();
	private _afterRenderRef: AfterRenderRef | undefined;
	private _bodyContainer: HTMLElement | null = null;

	private _positioning = ngbPositioning();

	@ContentChild(NgbDropdownMenu, { static: false }) private _menu: NgbDropdownMenu;
	@ContentChild(NgbDropdownAnchor, { static: false }) private _anchor: NgbDropdownAnchor;

	/**
	 * Indicates whether the dropdown should be closed when clicking one of dropdown items or pressing ESC.
	 *
	 * * `true` - the dropdown will close on both outside and inside (menu) clicks.
	 * * `false` - the dropdown can only be closed manually via `close()` or `toggle()` methods.
	 * * `"inside"` - the dropdown will close on inside menu clicks, but not outside clicks.
	 * * `"outside"` - the dropdown will close only on the outside clicks and not on menu clicks.
	 */
	@Input() autoClose = this._config.autoClose;

	/**
	 * A custom class that is applied only to the `ngbDropdownMenu` parent element.
	 * * In case of the inline dropdown it will be the `<div ngbDropdown>`
	 * * In case of the dropdown with  `container="body"` it will be the `<div class="dropdown">` attached to the `<body>`
	 *
	 * Useful mainly when dropdown is attached to the body.
	 * If the dropdown is inline just use `<div ngbDropdown class="custom-class">` instead.
	 *
	 * @since 9.1.0
	 */
	@Input() dropdownClass: string;

	/**
	 * Defines whether or not the dropdown menu is opened initially.
	 */
	@Input('open') _open = false;

	/**
	 * The preferred placement of the dropdown, among the [possible values](#/guides/positioning#api).
	 *
	 * The default order of preference is `"bottom-start bottom-end top-start top-end"`
	 *
	 * Please see the [positioning overview](#/positioning) for more details.
	 */
	@Input() placement = this._config.placement;

	/**
	 * Allows to change default Popper options when positioning the dropdown.
	 * Receives current popper options and returns modified ones.
	 *
	 * @since 13.1.0
	 */
	@Input() popperOptions = this._config.popperOptions;

	/**
	 * A selector specifying the element the dropdown should be appended to.
	 * Currently only supports "body".
	 *
	 * @since 4.1.0
	 */
	@Input() container: null | 'body' = this._config.container;

	/**
	 * Enable or disable the dynamic positioning. The default value is dynamic unless the dropdown is used
	 * inside a Bootstrap navbar. If you need custom placement for a dropdown in a navbar, set it to
	 * dynamic explicitly. See the [positioning of dropdown](#/positioning#dropdown)
	 * and the [navbar demo](/#/components/dropdown/examples#navbar) for more details.
	 *
	 * @since 4.2.0
	 */
	@Input() display: 'dynamic' | 'static';

	/**
	 * An event fired when the dropdown is opened or closed.
	 *
	 * The event payload is a `boolean`:
	 * * `true` - the dropdown was opened
	 * * `false` - the dropdown was closed
	 */
	@Output() openChange = new EventEmitter<boolean>();

	ngOnInit(): void {
        throw new Error("STUB");
    }

	ngAfterContentInit() {
        throw new Error("STUB");
    }

	ngOnChanges(changes: SimpleChanges) {
        throw new Error("STUB");
    }

	/**
	 * Checks if the dropdown menu is open.
	 */
	isOpen(): boolean {
        throw new Error("STUB");
    }

	/**
	 * Opens the dropdown menu.
	 */
	open(): void {
        throw new Error("STUB");
    }

	private _setCloseHandlers() {
        throw new Error("STUB");
    }

	/**
	 * Closes the dropdown menu.
	 */
	close(): void {
        throw new Error("STUB");
    }

	/**
	 * Toggles the dropdown menu.
	 */
	toggle(): void {
        throw new Error("STUB");
    }

	ngOnDestroy() {
        throw new Error("STUB");
    }

	onKeyDown(event: KeyboardEvent) {
        throw new Error("STUB");
    }

	private _isDropup(): boolean {
        throw new Error("STUB");
    }

	private _isEventFromToggle(event: KeyboardEvent) {
        throw new Error("STUB");
    }

	private _getMenuElements(): HTMLElement[] {
        throw new Error("STUB");
    }

	private _positionMenu() {
        throw new Error("STUB");
    }

	private _getFirstPlacement(placement: PlacementArray): Placement {
        throw new Error("STUB");
    }

	private _resetContainer() {
        throw new Error("STUB");
    }

	private _applyContainer(container: null | 'body' = null) {
        throw new Error("STUB");
    }

	private _applyCustomDropdownClass(newClass: string, oldClass?: string) {
        throw new Error("STUB");
    }

	private _applyPlacementClasses(placement?: Placement | null) {
        throw new Error("STUB");
    }
}
