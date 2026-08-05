import {
	AfterContentChecked,
	AfterContentInit,
	afterNextRender,
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ContentChildren,
	DestroyRef,
	Directive,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Input,
	NgZone,
	Output,
	PLATFORM_ID,
	QueryList,
	TemplateRef,
	ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';

import { NgbCarouselConfig } from './carousel-config';

import { BehaviorSubject, combineLatest, NEVER, Observable, timer, zip } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, take } from 'rxjs/operators';
import { ngbCompleteTransition, ngbRunTransition, NgbTransitionOptions } from '@ng-bootstrap/ng-bootstrap/utils';
import {
	NgbCarouselCtx,
	ngbCarouselTransitionIn,
	ngbCarouselTransitionOut,
	NgbSlideEventDirection,
} from './carousel-transition';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

let nextId = 0;
let carouselId = 0;

/**
 * A directive that wraps the individual carousel slide.
 */
@Directive({ selector: 'ng-template[ngbSlide]' })
export class NgbSlide {
	templateRef = inject(TemplateRef);

	/**
	 * Slide id that must be unique for the entire document.
	 *
	 * If not provided, will be generated in the `ngb-slide-xx` format.
	 */
	@Input() id = `ngb-slide-${nextId++}`;

	/**
	 * An event emitted when the slide transition is finished
	 *
	 * @since 8.0.0
	 */
	@Output() slid = new EventEmitter<NgbSingleSlideEvent>();
}

/**
 * Carousel is a component to easily create and control slideshows.
 *
 * Allows to set intervals, change the way user interacts with the slides and provides a programmatic API.
 */
@Component({
	selector: 'ngb-carousel',
	exportAs: 'ngbCarousel',
	imports: [NgTemplateOutlet],
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'carousel slide',
		'[style.display]': '"block"',
		tabIndex: '0',
		'(keydown.arrowLeft)': 'keyboard && arrowLeft()',
		'(keydown.arrowRight)': 'keyboard && arrowRight()',
		'(mouseenter)': 'mouseHover = true',
		'(mouseleave)': 'mouseHover = false',
		'(focusin)': 'focused = true',
		'(focusout)': 'focused = false',
	},
	template: `
		<div class="carousel-indicators" [class.visually-hidden]="!showNavigationIndicators" role="tablist">
			@for (slide of slides; track slide) {
				<button
					type="button"
					data-bs-target
					[class.active]="slide.id === activeId"
					role="tab"
					[attr.aria-labelledby]="'slide-' + slide.id"
					[attr.aria-controls]="'slide-' + slide.id"
					[attr.aria-selected]="slide.id === activeId"
					(click)="focus(); select(slide.id, NgbSlideEventSource.INDICATOR)"
				></button>
			}
		</div>
		<div class="carousel-inner">
			@for (slide of slides; track slide; let i = $index; let c = $count) {
				<div class="carousel-item" [id]="'slide-' + slide.id" role="tabpanel">
					<span
						class="visually-hidden"
						i18n="Currently selected slide number read by screen reader@@ngb.carousel.slide-number"
					>
						Slide {{ i + 1 }} of {{ c }}
					</span>
					<ng-template [ngTemplateOutlet]="slide.templateRef" />
				</div>
			}
		</div>
		@if (showNavigationArrows) {
			<button
				class="carousel-control-prev"
				type="button"
				(click)="arrowLeft()"
				[attr.aria-labelledby]="id + '-previous'"
			>
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden" i18n="@@ngb.carousel.previous" [id]="id + '-previous'">Previous</span>
			</button>
			<button class="carousel-control-next" type="button" (click)="arrowRight()" [attr.aria-labelledby]="id + '-next'">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden" i18n="@@ngb.carousel.next" [id]="id + '-next'">Next</span>
			</button>
		}
	`,
})
export class NgbCarousel implements AfterContentChecked, AfterContentInit, AfterViewInit {
	@ContentChildren(NgbSlide) slides: QueryList<NgbSlide>;

	public NgbSlideEventSource = NgbSlideEventSource;

	private _config = inject(NgbCarouselConfig);
	private _platformId = inject(PLATFORM_ID);
	private _ngZone = inject(NgZone);
	private _cd = inject(ChangeDetectorRef);
	private _container = inject(ElementRef);
	private _destroyRef = inject(DestroyRef);
	private _injector = inject(Injector);

	private _interval$ = new BehaviorSubject(this._config.interval);
	private _mouseHover$ = new BehaviorSubject(false);
	private _focused$ = new BehaviorSubject(false);
	private _pauseOnHover$ = new BehaviorSubject(this._config.pauseOnHover);
	private _pauseOnFocus$ = new BehaviorSubject(this._config.pauseOnFocus);
	private _pause$ = new BehaviorSubject(false);
	private _wrap$ = new BehaviorSubject(this._config.wrap);

	id = `ngb-carousel-${carouselId++}`;

	/**
	 * A flag to enable/disable the animations.
	 *
	 * @since 8.0.0
	 */
	@Input() animation = this._config.animation;

	/**
	 * The slide id that should be displayed **initially**.
	 *
	 * For subsequent interactions use methods `select()`, `next()`, etc. and the `(slide)` output.
	 */
	@Input() activeId: string;

	/**
	 * Time in milliseconds before the next slide is shown.
	 */
	@Input()
	set interval(value: number) {
        throw new Error("STUB");
    }

	get interval() {
        throw new Error("STUB");
    }

	/**
	 * If `true`, will 'wrap' the carousel by switching from the last slide back to the first.
	 */
	@Input()
	set wrap(value: boolean) {
        throw new Error("STUB");
    }

	get wrap() {
        throw new Error("STUB");
    }

	/**
	 * If `true`, allows to interact with carousel using keyboard 'arrow left' and 'arrow right'.
	 */
	@Input() keyboard = this._config.keyboard;

	/**
	 * If `true`, will pause slide switching when mouse cursor hovers the slide.
	 *
	 * @since 2.2.0
	 */
	@Input()
	set pauseOnHover(value: boolean) {
        throw new Error("STUB");
    }

	get pauseOnHover() {
        throw new Error("STUB");
    }

	/**
	 * If `true`, will pause slide switching when the focus is inside the carousel.
	 */
	@Input()
	set pauseOnFocus(value: boolean) {
        throw new Error("STUB");
    }

	get pauseOnFocus() {
        throw new Error("STUB");
    }

	/**
	 * If `true`, 'previous' and 'next' navigation arrows will be visible on the slide.
	 *
	 * @since 2.2.0
	 */
	@Input() showNavigationArrows = this._config.showNavigationArrows;

	/**
	 * If `true`, navigation indicators at the bottom of the slide will be visible.
	 *
	 * @since 2.2.0
	 */
	@Input() showNavigationIndicators = this._config.showNavigationIndicators;

	/**
	 * An event emitted just before the slide transition starts.
	 *
	 * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
	 */
	@Output() slide = new EventEmitter<NgbSlideEvent>();

	/**
	 * An event emitted right after the slide transition is completed.
	 *
	 * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
	 *
	 * @since 8.0.0
	 */
	@Output() slid = new EventEmitter<NgbSlideEvent>();

	/*
	 * Keep the ids of the panels currently transitionning
	 * in order to allow only the transition revertion
	 */
	private _transitionIds: [string, string] | null = null;

	set mouseHover(value: boolean) {
        throw new Error("STUB");
    }

	get mouseHover() {
        throw new Error("STUB");
    }

	set focused(value: boolean) {
        throw new Error("STUB");
    }

	get focused() {
        throw new Error("STUB");
    }

	arrowLeft() {
        throw new Error("STUB");
    }

	arrowRight() {
        throw new Error("STUB");
    }

	ngAfterContentInit() {
        throw new Error("STUB");
    }

	ngAfterContentChecked() {
        throw new Error("STUB");
    }

	ngAfterViewInit() {
        throw new Error("STUB");
    }

	/**
	 * Navigates to a slide with the specified identifier.
	 */
	select(slideId: string, source?: NgbSlideEventSource) {
        throw new Error("STUB");
    }

	/**
	 * Navigates to the previous slide.
	 */
	prev(source?: NgbSlideEventSource) {
        throw new Error("STUB");
    }

	/**
	 * Navigates to the next slide.
	 */
	next(source?: NgbSlideEventSource) {
		this._cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.START, source);
	}

	/**
	 * Pauses cycling through the slides.
	 */
	pause() {
        throw new Error("STUB");
    }

	/**
	 * Restarts cycling through the slides from start to end.
	 */
	cycle() {
        throw new Error("STUB");
    }

	/**
	 * Set the focus on the carousel.
	 */
	focus() {
		this._container.nativeElement.focus();
	}

	private _cycleToSelected(slideIdx: string, direction: NgbSlideEventDirection, source?: NgbSlideEventSource) {
		const transitionIds = this._transitionIds;
		if (transitionIds && (transitionIds[0] !== slideIdx || transitionIds[1] !== this.activeId)) {
			// Revert prevented
			return;
		}

		let selectedSlide = this._getSlideById(slideIdx);
		if (selectedSlide && selectedSlide.id !== this.activeId) {
			this._transitionIds = [this.activeId, slideIdx];
			this.slide.emit({
				prev: this.activeId,
				current: selectedSlide.id,
				direction: direction,
				paused: this._pause$.value,
				source,
			});

			const options: NgbTransitionOptions<NgbCarouselCtx> = {
				animation: this.animation,
				runningTransition: 'stop',
				context: { direction },
			};

			const transitions: Array<Observable<any>> = [];
			const activeSlide = this._getSlideById(this.activeId);
			if (activeSlide) {
				const activeSlideTransition = ngbRunTransition(
					this._ngZone,
					this._getSlideElement(activeSlide.id),
					ngbCarouselTransitionOut,
					options,
				);
				activeSlideTransition.subscribe(() => {
                    throw new Error("STUB");
                });
				transitions.push(activeSlideTransition);
			}

			const previousId = this.activeId;
			this.activeId = selectedSlide.id;
			const nextSlide = this._getSlideById(this.activeId);
			const transition = ngbRunTransition(
				this._ngZone,
				this._getSlideElement(selectedSlide.id),
				ngbCarouselTransitionIn,
				options,
			);
			transition.subscribe(() => {
                throw new Error("STUB");
            });
			transitions.push(transition);

			zip(...transitions)
				.pipe(take(1))
				.subscribe(() => {
                    throw new Error("STUB");
                });
		}

		// we get here after the interval fires or any external API call like next(), prev() or select()
		this._cd.markForCheck();
	}

	private _getSlideEventDirection(currentActiveSlideId: string, nextActiveSlideId: string): NgbSlideEventDirection {
        throw new Error("STUB");
    }

	private _getSlideById(slideId: string): NgbSlide | null {
		return this.slides.find((slide) => { throw new Error("STUB"); }) || null;
	}

	private _getSlideIdxById(slideId: string): number {
		const slide = this._getSlideById(slideId);
		return slide != null ? this.slides.toArray().indexOf(slide) : -1;
	}

	private _getNextSlide(currentSlideId: string): string {
		const slideArr = this.slides.toArray();
		const currentSlideIdx = this._getSlideIdxById(currentSlideId);
		const isLastSlide = currentSlideIdx === slideArr.length - 1;

		return isLastSlide
			? this.wrap
				? slideArr[0].id
				: slideArr[slideArr.length - 1].id
			: slideArr[currentSlideIdx + 1].id;
	}

	private _getPrevSlide(currentSlideId: string): string {
        throw new Error("STUB");
    }

	private _getSlideElement(slideId: string): HTMLElement {
		return this._container.nativeElement.querySelector(`#slide-${slideId}`);
	}
}

/**
 * A slide change event emitted right after the slide transition is completed.
 */
export interface NgbSlideEvent {
	/**
	 * The previous slide id.
	 */
	prev: string;

	/**
	 * The current slide id.
	 */
	current: string;

	/**
	 * The slide event direction.
	 *
	 * <span class="badge bg-info text-dark">since 12.0.0</span> Possible values are `'start' | 'end'`.
	 *
	 * <span class="badge bg-secondary">before 12.0.0</span> Possible values were `'left' | 'right'`.
	 */
	direction: NgbSlideEventDirection;

	/**
	 * Whether the pause() method was called (and no cycle() call was done afterwards).
	 *
	 * @since 5.1.0
	 */
	paused: boolean;

	/**
	 * Source triggering the slide change event.
	 *
	 * Possible values are `'timer' | 'arrowLeft' | 'arrowRight' | 'indicator'`
	 *
	 * @since 5.1.0
	 */
	source?: NgbSlideEventSource;
}

/**
 * A slide change event emitted right after the slide transition is completed.
 *
 * @since 8.0.0
 */
export interface NgbSingleSlideEvent {
	/**
	 * true if the slide is shown, false otherwise
	 */
	isShown: boolean;

	/**
	 * The slide event direction.
	 *
	 * <span class="badge bg-info text-dark">since 12.0.0</span> Possible values are `'start' | 'end'`.
	 *
	 * <span class="badge bg-secondary">before 12.0.0</span> Possible values were `'left' | 'right'`.
	 */
	direction: NgbSlideEventDirection;

	/**
	 * Source triggering the slide change event.
	 *
	 * Possible values are `'timer' | 'arrowLeft' | 'arrowRight' | 'indicator'`
	 *
	 */
	source?: NgbSlideEventSource;
}

export enum NgbSlideEventSource {
	TIMER = 'timer',
	ARROW_LEFT = 'arrowLeft',
	ARROW_RIGHT = 'arrowRight',
	INDICATOR = 'indicator',
}
