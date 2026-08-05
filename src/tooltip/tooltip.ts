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

import {
	isString,
	listenToTriggers,
	ngbAutoClose,
	ngbPositioning,
	PopupService,
	addPopperOffset,
	ngbCompleteTransition,
} from '@ng-bootstrap/ng-bootstrap/utils';

import { NgbTooltipConfig } from './tooltip-config';
import { Subject } from 'rxjs';

let nextId = 0;

@Component({
	selector: 'ngb-tooltip-window',
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '"tooltip" + (tooltipClass ? " " + tooltipClass : "")',
		'[class.fade]': 'animation',
		role: 'tooltip',
		'[id]': 'id',
		'(mouseenter)': 'onMouseEnter()',
		'(mouseleave)': 'onMouseLeave()',
	},
	styleUrl: './tooltip.scss',
	template: `
		<div class="tooltip-arrow" data-popper-arrow></div>
		<div class="tooltip-inner">
			<ng-content />
		</div>
	`,
})
export class NgbTooltipWindow {
	@Input() animation: boolean;
	@Input() id: string;
	@Input() tooltipClass: string;
	@Input() onMouseEnter: () => void;
	@Input() onMouseLeave: () => void;
}

/**
 * A lightweight and extensible directive for fancy tooltip creation.
 */
@Directive({ selector: '[ngbTooltip]', exportAs: 'ngbTooltip' })
export class NgbTooltip implements OnInit, OnDestroy, OnChanges {
	static ngAcceptInputType_autoClose: boolean | string;

	private _config = inject(NgbTooltipConfig);

	/**
	 * If `true`, tooltip opening and closing will be animated.
	 *
	 * @since 8.0.0
	 */
	@Input() animation = this._config.animation;

	/**
	 * Indicates whether the tooltip should be closed on `Escape` key and inside/outside clicks:
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
	 * The preferred placement of the tooltip, among the [possible values](#/guides/positioning#api).
	 *
	 * The default order of preference is `"auto"`.
	 *
	 * Please see the [positioning overview](#/positioning) for more details.
	 */
	@Input() placement = this._config.placement;

	/**
	 * Allows to change default Popper options when positioning the tooltip.
	 * Receives current popper options and returns modified ones.
	 *
	 * @since 13.1.0
	 */
	@Input() popperOptions = this._config.popperOptions;

	/**
	 * Specifies events that should trigger the tooltip.
	 *
	 * Supports a space separated list of event names.
	 * For more details see the [triggers demo](#/components/tooltip/examples#triggers).
	 */
	@Input() triggers = this._config.triggers;

	/**
	 * A css selector or html element specifying the element the tooltip should be positioned against.
	 * By default, the element `ngbTooltip` directive is applied to will be set as a target.
	 *
	 * @since 13.1.0
	 */
	@Input() positionTarget?: string | HTMLElement;

	/**
	 * A selector specifying the element the tooltip should be appended to.
	 *
	 * Currently only supports `"body"`.
	 */
	@Input() container = this._config.container;

	/**
	 * If `true`, tooltip is disabled and won't be displayed.
	 *
	 * @since 1.1.0
	 */
	@Input() disableTooltip = this._config.disableTooltip;

	/**
	 * An optional class applied to the tooltip window element.
	 *
	 * @since 3.2.0
	 */
	@Input() tooltipClass = this._config.tooltipClass;

	/**
	 * Default template context for `TemplateRef`, can be overridden with `open` method.
	 *
	 * @since 15.1.0
	 */
	@Input() tooltipContext: any;

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
	 * An event emitted when the tooltip opening animation has finished. Contains no payload.
	 */
	@Output() shown = new EventEmitter();

	/**
	 * An event emitted when the tooltip closing animation has finished. Contains no payload.
	 */
	@Output() hidden = new EventEmitter();

	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _ngZone = inject(NgZone);
	private _document = inject(DOCUMENT);
	private _changeDetector = inject(ChangeDetectorRef);
	private _injector = inject(Injector);

	private _ngbTooltip: string | TemplateRef<any> | null | undefined;
	private _ngbTooltipWindowId = `ngb-tooltip-${nextId++}`;
	private _popupService = new PopupService(NgbTooltipWindow);
	private _windowRef: ComponentRef<NgbTooltipWindow> | null = null;
	private _unregisterListenersFn;
	private _positioning = ngbPositioning();
	private _afterRenderRef: AfterRenderRef | undefined;

	private _mouseEnterTooltip = new Subject<void>();
	private _mouseLeaveTooltip = new Subject<void>();

	private _opening = true;
	private _transitioning = false;

	/**
	 * The string content or a `TemplateRef` for the content to be displayed in the tooltip.
	 *
	 * If the content if falsy, the tooltip won't open.
	 */
	@Input()
	set ngbTooltip(value: string | TemplateRef<any> | null | undefined) {
        throw new Error("STUB");
    }

	get ngbTooltip() {
        throw new Error("STUB");
    }

	/**
	 * Opens the tooltip.
	 *
	 * This is considered to be a "manual" triggering.
	 * The `context` is an optional value to be injected into the tooltip template when it is created.
	 */
	open(context?: any) {
        throw new Error("STUB");
    }

	/**
	 * Closes the tooltip.
	 *
	 * This is considered to be a "manual" triggering of the tooltip.
	 */
	close(animation = this.animation): void {
        throw new Error("STUB");
    }

	/**
	 * Toggles the tooltip.
	 *
	 * This is considered to be a "manual" triggering of the tooltip.
	 */
	toggle(): void {
        throw new Error("STUB");
    }

	/**
	 * Returns `true`, if the tooltip is currently shown.
	 */
	isOpen(): boolean {
        throw new Error("STUB");
    }

	ngOnInit() {
        throw new Error("STUB");
    }

	ngOnChanges({ tooltipClass }: SimpleChanges) {
        throw new Error("STUB");
    }

	ngOnDestroy() {
        throw new Error("STUB");
    }

	private _getPositionTargetElement(): HTMLElement {
        throw new Error("STUB");
    }
}
