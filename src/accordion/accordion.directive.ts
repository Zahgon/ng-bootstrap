import {
	AfterContentChecked,
	AfterContentInit,
	ChangeDetectorRef,
	Component,
	ContentChild,
	ContentChildren,
	DestroyRef,
	Directive,
	ElementRef,
	EmbeddedViewRef,
	EventEmitter,
	inject,
	Input,
	OnDestroy,
	Output,
	QueryList,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbAccordionConfig } from './accordion-config';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap/collapse';
import { isString } from '@ng-bootstrap/ng-bootstrap/utils';

let nextId = 0;

/**
 * A directive that wraps the content of an accordion item's collapsible body.
 *
 * The actual content is provided in a child `ng-template` element.
 * Depending on the state of the accordion, the template will be either inserted or removed from the DOM.
 *
 * @since 14.1.0
 */
@Component({
	selector: '[ngbAccordionBody]',
	template: `
		<ng-container #container />
		<ng-content />
	`,
	host: {
		class: 'accordion-body',
	},
})
export class NgbAccordionBody implements AfterContentChecked, OnDestroy {
	private _item = inject(NgbAccordionItem);
	private _viewRef: EmbeddedViewRef<any> | null = null;

	/**
	 * the `ElementRef` of the component
	 *
	 * @since 18.0.0
	 */
	public readonly elementRef = inject(ElementRef);

	@ViewChild('container', { read: ViewContainerRef, static: true }) private _vcr: ViewContainerRef;
	@ContentChild(TemplateRef, { static: true }) private _bodyTpl: TemplateRef<any>;

	ngAfterContentChecked(): void {
        throw new Error("STUB");
    }

	ngOnDestroy(): void {
        throw new Error("STUB");
    }

	private _destroyViewIfExists(): void {
        throw new Error("STUB");
    }

	private _createViewIfNotExists(): void {
        throw new Error("STUB");
    }
}

/**
 * A directive that wraps the collapsible item's content of the accordion.
 *
 * Internally it reuses the [`NgbCollapse` directive](#/components/collapse)
 *
 * @since 14.1.0
 */
@Directive({
	exportAs: 'ngbAccordionCollapse',
	selector: '[ngbAccordionCollapse]',
	host: {
		role: 'region',
		class: 'accordion-collapse',
		'[id]': 'item.collapseId',
		'[attr.aria-labelledby]': 'item.toggleId',
	},
	hostDirectives: [NgbCollapse],
})
export class NgbAccordionCollapse {
	item = inject(NgbAccordionItem);
	ngbCollapse = inject(NgbCollapse);
}

/**
 * A directive to put on a toggling element inside the accordion item's header.
 * It will register click handlers that toggle the associated panel and will handle accessibility attributes.
 *
 * This directive is used internally by the [`NgbAccordionButton` directive](#/components/accordion/api#NgbAccordionButton).
 *
 * @since 14.1.0
 */
@Directive({
	selector: '[ngbAccordionToggle]',
	host: {
		'[id]': 'item.toggleId',
		'[class.collapsed]': 'item.collapsed',
		'[attr.aria-controls]': 'item.collapseId',
		'[attr.aria-expanded]': '!item.collapsed',
		'(click)': '!item.disabled && accordion.toggle(item.id)',
	},
})
export class NgbAccordionToggle {
	item = inject(NgbAccordionItem);
	accordion = inject(NgbAccordionDirective);
}

/**
 * A directive to put on a button element inside an accordion item's header.
 *
 * If you want a custom markup for the header, you can also use the [`NgbAccordionToggle` directive](#/components/accordion/api#NgbAccordionToggle).
 *
 * @since 14.1.0
 */
@Directive({
	selector: 'button[ngbAccordionButton]',
	host: {
		'[disabled]': 'item.disabled',
		class: 'accordion-button',
		type: 'button',
	},
	hostDirectives: [NgbAccordionToggle],
})
export class NgbAccordionButton {
	item = inject(NgbAccordionItem);
}

/**
 * A directive that wraps an accordion item's header.
 *
 * @since 14.1.0
 */
@Directive({
	selector: '[ngbAccordionHeader]',
	host: {
		role: 'heading',
		class: 'accordion-header',
		'[class.collapsed]': 'item.collapsed',
	},
})
export class NgbAccordionHeader {
	item = inject(NgbAccordionItem);
}

/**
 * A directive that wraps an accordion item: a toggleable header + body that collapses.
 *
 * You can get hold of the `NgbAccordionItem` instance in the template with `#item="ngbAccordionItem"`.
 * It allows to check if the item is collapsed or not, toggle the collapse state, etc.
 *
 * Every accordion item has a string ID that is automatically generated in the `ngb-accordion-item-XX` format, unless provided explicitly.
 *
 * @since 14.1.0
 */
@Directive({
	selector: '[ngbAccordionItem]',
	exportAs: 'ngbAccordionItem',
	host: {
		'[id]': 'id',
		class: 'accordion-item',
	},
})
export class NgbAccordionItem implements AfterContentInit {
	private _accordion = inject(NgbAccordionDirective);
	private _cd = inject(ChangeDetectorRef);
	private _destroyRef = inject(DestroyRef);

	private _collapsed = true;
	private _id = `ngb-accordion-item-${nextId++}`;
	private _destroyOnHide: boolean | undefined;

	private _collapseAnimationRunning = false;

	@ContentChild(NgbAccordionCollapse, { static: true }) private _collapse: NgbAccordionCollapse;

	/**
	 * Sets the custom ID of the accordion item. It must be unique for the document.
	 *
	 * @param id The ID of the accordion item, must be a non-empty string
	 */
	@Input('ngbAccordionItem') set id(id: string) {
        throw new Error("STUB");
    }

	/**
	 * If `true`, the content of the accordion item's body will be removed from the DOM. It will be just hidden otherwise.
	 *
	 * This property can also be set up on the parent [`NgbAccordion` directive](#/components/accordion/api#NgbAccordionDirective).
	 *
	 * @defaultValue `true` - initialized from the parent NgbAccordion directive
	 */
	@Input() set destroyOnHide(destroyOnHide: boolean) {
        throw new Error("STUB");
    }

	get destroyOnHide(): boolean {
        throw new Error("STUB");
    }

	/**
	 * If `true`, the accordion item will be disabled.
	 * It won't react to user's clicks, but still will be toggelable programmatically.
	 */
	@Input() disabled = false;

	/**
	 *	If `true`, the accordion item will be collapsed. Otherwise, it will be expanded.
	 *
	 * @defaultValue `true`
	 */
	@Input() set collapsed(collapsed: boolean) {
        throw new Error("STUB");
    }

	/**
	 * Event emitted before the expanding animation starts. It has no payload.
	 *
	 * @since 15.1.0
	 */
	@Output() show = new EventEmitter<void>();

	/**
	 * Event emitted when the expanding animation is finished. It has no payload.
	 */
	@Output() shown = new EventEmitter<void>();

	/**
	 * Event emitted before the collapsing animation starts. It has no payload.
	 *
	 * @since 15.1.0
	 */
	@Output() hide = new EventEmitter<void>();

	/**
	 * Event emitted when the collapsing animation is finished and before the content is removed from DOM.
	 * It has no payload.
	 */
	@Output() hidden = new EventEmitter<void>();

	get collapsed() {
        throw new Error("STUB");
    }

	get id() {
        throw new Error("STUB");
    }

	get toggleId() {
        throw new Error("STUB");
    }

	get collapseId() {
        throw new Error("STUB");
    }

	get _shouldBeInDOM() {
        throw new Error("STUB");
    }

	ngAfterContentInit() {
        throw new Error("STUB");
    }

	/**
	 * Toggles an accordion item.
	 */
	toggle() {
        throw new Error("STUB");
    }

	/**
	 * Expands an accordion item.
	 */
	expand() {
        throw new Error("STUB");
    }

	/**
	 * Collapses an accordion item.
	 */
	collapse() {
        throw new Error("STUB");
    }
}

/**
 * Accordion is a stack of cards that have a header and collapsible body.
 *
 * This directive is a container for these items and provides an API to handle them.
 *
 * @since 14.1.0
 */
@Directive({
	selector: '[ngbAccordion]',
	exportAs: 'ngbAccordion',
	host: {
		class: 'accordion',
	},
})
export class NgbAccordionDirective {
	private _config = inject(NgbAccordionConfig);
	private _anItemWasAlreadyExpandedDuringInitialisation = false;

	@ContentChildren(NgbAccordionItem, { descendants: false }) private _items?: QueryList<NgbAccordionItem>;
	/**
	 * If `true`, accordion will be animated.
	 */
	@Input() animation = this._config.animation;

	/**
	 * If `true`, only one item at the time can stay open.
	 */
	@Input() closeOthers = this._config.closeOthers;
	/**
	 * If `true`, the content of the accordion items body will be removed from the DOM. It will be just hidden otherwise.
	 *
	 * This property can be overwritten at the [`NgbAccordionItem`](#/components/accordion/api#NgbAccordionItem) level
	 */
	@Input() destroyOnHide = this._config.destroyOnHide;

	/**
	 * Event emitted before expanding animation starts. The payload is the id of shown accordion item.
	 *
	 * @since 15.1.0
	 */
	@Output() show = new EventEmitter<string>();

	/**
	 * Event emitted when the expanding animation is finished. The payload is the id of shown accordion item.
	 */
	@Output() shown = new EventEmitter<string>();

	/**
	 * Event emitted before the collapsing animation starts. The payload is the id of hidden accordion item.
	 *
	 * @since 15.1.0
	 */
	@Output() hide = new EventEmitter<string>();

	/**
	 * Event emitted when the collapsing animation is finished and before the content is removed from DOM.
	 * The payload is the id of hidden accordion item.
	 */
	@Output() hidden = new EventEmitter<string>();

	/**
	 * Toggles an item with the given id.
	 *
	 * It will toggle an item, even if it is disabled.
	 *
	 * @param itemId The id of the item to toggle.
	 */
	toggle(itemId: string) {
        throw new Error("STUB");
    }

	/**
	 * Expands an item with the given id.
	 *
	 * If `closeOthers` is `true`, it will collapse other panels.
	 *
	 * @param itemId The id of the item to expand.
	 */
	expand(itemId: string) {
        throw new Error("STUB");
    }

	/**
	 * Expands all items.
	 *
	 * If `closeOthers` is `true` and all items are closed, it will open the first one. Otherwise, it will keep the opened one.
	 */
	expandAll() {
        throw new Error("STUB");
    }

	/**
	 * Collapses an item with the given id.
	 *
	 * Has no effect if the `itemId` does not correspond to any item.
	 *
	 * @param itemId The id of the item to collapse.
	 */
	collapse(itemId: string) {
        throw new Error("STUB");
    }

	/**
	 * Collapses all items.
	 */
	collapseAll() {
        throw new Error("STUB");
    }

	/**
	 * Checks if an item with the given id is expanded.
	 *
	 * If the `itemId` does not correspond to any item, it returns `false`.
	 *
	 * @param itemId The id of the item to check.
	 */
	isExpanded(itemId: string) {
        throw new Error("STUB");
    }

	/**
	 * It checks, if the item can be expanded in the current state of the accordion.
	 * With `closeOthers` there can be only one expanded item at a time.
	 *
	 * @internal
	 */
	_ensureCanExpand(toExpand: NgbAccordionItem) {
        throw new Error("STUB");
    }

	private _getItem(itemId: string): NgbAccordionItem | undefined {
        throw new Error("STUB");
    }
}
