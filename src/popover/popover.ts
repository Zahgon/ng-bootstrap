import {
	afterEveryRender,
	AfterRenderRef,
	ChangeDetectorRef,
	Component,
	ComponentRef,
	Directive,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewEncapsulation,
	DOCUMENT,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {
	isString,
	listenToTriggers,
	ngbAutoClose,
	ngbPositioning,
	PopupService,
	addPopperOffset,
	ngbCompleteTransition,
} from '@ng-bootstrap/ng-bootstrap/utils';

import { NgbPopoverConfig } from './popover-config';

import { Subject } from 'rxjs';

let nextId = 0;

@Component({
	selector: 'ngb-popover-window',
	imports: [NgTemplateOutlet],
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '"popover" + (popoverClass ? " " + popoverClass : "")',
		'[class.fade]': 'animation',
		role: 'tooltip',
		'[id]': 'id',
		'[style.position]': '"absolute"',
		'(mouseenter)': 'onMouseEnter()',
		'(mouseleave)': 'onMouseLeave()',
	},
	template: `
		<div class="popover-arrow" data-popper-arrow></div>
		@if (title) {
			<h3 class="popover-header">
				<ng-template #simpleTitle>{{ title }}</ng-template>
				<ng-template
					[ngTemplateOutlet]="isTitleTemplate() ? $any(title) : simpleTitle"
					[ngTemplateOutletContext]="context"
				/>
			</h3>
		}
		<div class="popover-body">
			<ng-content />
		</div>
	`,
})
export class NgbPopoverWindow {
	@Input() animation: boolean;
	@Input() title: string | TemplateRef<any> | null | undefined;
	@Input() id: string;
	@Input() popoverClass: string;
	@Input() context: any;
	@Input() onMouseEnter: () => void;
	@Input() onMouseLeave: () => void;

	isTitleTemplate() {
        throw new Error("STUB");
    }
}

/**
 * A lightweight and extensible directive for fancy popover creation.
 */
@Directive({ selector: '[ngbPopover]', exportAs: 'ngbPopover' })
export class NgbPopover implements OnInit, OnDestroy, OnChanges {
	static ngAcceptInputType_autoClose: boolean | string;

	private _config = inject(NgbPopoverConfig);

	/**
	 * If `true`, popover opening and closing will be animated.
	 *
	 * @since 8.0.0
	 */
	@Input() animation = this._config.animation;

	/**
	 * Indicates whether the popover should be closed on `Escape` key and inside/outside clicks:
	 *
	 * * `true` - closes on both outside and inside clicks as well as `Escape` presses
	 * * `false` - disables the autoClose feature (NB: triggers still apply)
	 * * `"inside"` - closes on inside clicks as well as Escape presses
	 * * `"outside"` - closes on outside clicks (sometimes also achievable through triggers)
	 * as well as `Escape` presses
	 *
	 * @since 3.0.0
	 */
	@Input() autoClose = this._config.autoClose;

	/**
	 * The string content or a `TemplateRef` for the content to be displayed in the popover.
	 *
	 * If the title and the content are falsy, the popover won't open.
	 */
	@Input() ngbPopover: string | TemplateRef<any> | null | undefined;

	/**
	 * The title of the popover.
	 *
	 * If the title and the content are falsy, the popover won't open.
	 */
	@Input() popoverTitle: string | TemplateRef<any> | null | undefined;

	/**
	 * The preferred placement of the popover, among the [possible values](#/guides/positioning#api).
	 *
	 * The default order of preference is `"auto"`.
	 *
	 * Please see the [positioning overview](#/positioning) for more details.
	 */
	@Input() placement = this._config.placement;

	/**
	 * Allows to change default Popper options when positioning the popover.
	 * Receives current popper options and returns modified ones.
	 *
	 * @since 13.1.0
	 */
	@Input() popperOptions = this._config.popperOptions;

	/**
	 * Specifies events that should trigger the tooltip.
	 *
	 * Supports a space separated list of event names.
	 * For more details see the [triggers demo](#/components/popover/examples#triggers).
	 */
	@Input() triggers = this._config.triggers;

	/**
	 * A css selector or html element specifying the element the popover should be positioned against.
	 * By default, the element `ngbPopover` directive is applied to will be set as a target.
	 *
	 * @since 13.1.0
	 */
	@Input() positionTarget?: string | HTMLElement;

	/**
	 * A selector specifying the element the popover should be appended to.
	 *
	 * Currently only supports `body`.
	 */
	@Input() container = this._config.container;

	/**
	 * If `true`, popover is disabled and won't be displayed.
	 *
	 * @since 1.1.0
	 */
	@Input() disablePopover = this._config.disablePopover;

	/**
	 * An optional class applied to the popover window element.
	 *
	 * @since 2.2.0
	 */
	@Input() popoverClass = this._config.popoverClass;

	/**
	 * Default template context for `TemplateRef`, can be overridden with `open` method.
	 *
	 * @since 15.1.0
	 */
	@Input() popoverContext: any;

	/**
	 * The opening delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
	 *
	 * @since 4.1.0
	 */
	@Input() openDelay = this._config.openDelay;

	/**
	 * The closing delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
	 *
	 * @since 4.1.0
	 */
	@Input() closeDelay = this._config.closeDelay;

	/**
	 * An event emitted when the popover opening animation has finished. Contains no payload.
	 */
	@Output() shown = new EventEmitter<void>();

	/**
	 * An event emitted when the popover closing animation has finished. Contains no payload.
	 *
	 * At this point popover is not in the DOM anymore.
	 */
	@Output() hidden = new EventEmitter<void>();

	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _ngZone = inject(NgZone);
	private _document = inject(DOCUMENT);
	private _changeDetector = inject(ChangeDetectorRef);
	private _injector = inject(Injector);

	private _ngbPopoverWindowId = `ngb-popover-${nextId++}`;
	private _popupService = new PopupService(NgbPopoverWindow);
	private _windowRef: ComponentRef<NgbPopoverWindow> | null = null;
	private _unregisterListenersFn;
	private _positioning = ngbPositioning();
	private _afterRenderRef: AfterRenderRef;

	private _mouseEnterPopover = new Subject<void>();
	private _mouseLeavePopover = new Subject<void>();

	private _opening = true;
	private _transitioning = false;

	/**
	 * Opens the popover.
	 *
	 * This is considered to be a "manual" triggering.
	 * The `context` is an optional value to be injected into the popover template when it is created.
	 */
	open(context?: any) {
        throw new Error("STUB");
    }

	/**
	 * Closes the popover.
	 *
	 * This is considered to be a "manual" triggering of the popover.
	 */
	close(animation = this.animation) {
        throw new Error("STUB");
    }

	/**
	 * Toggles the popover.
	 *
	 * This is considered to be a "manual" triggering of the popover.
	 */
	toggle(): void {
        throw new Error("STUB");
    }

	/**
	 * Returns `true`, if the popover is currently shown.
	 */
	isOpen(): boolean {
        throw new Error("STUB");
    }

	ngOnInit() {
        throw new Error("STUB");
    }

	ngOnChanges({ ngbPopover, popoverTitle, disablePopover, popoverClass }: SimpleChanges) {
        throw new Error("STUB");
    }

	ngOnDestroy() {
        throw new Error("STUB");
    }

	private _isDisabled(): boolean {
        throw new Error("STUB");
    }

	private _getPositionTargetElement(): HTMLElement {
        throw new Error("STUB");
    }
}
