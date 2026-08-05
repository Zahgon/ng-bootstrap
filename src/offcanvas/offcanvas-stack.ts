import {
	ApplicationRef,
	ComponentRef,
	createComponent,
	EventEmitter,
	inject,
	Service,
	Injector,
	NgZone,
	TemplateRef,
	Type,
	DOCUMENT,
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { isDefined, isString, ngbFocusTrap, ContentRef, ScrollBar } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbActiveOffcanvas, NgbOffcanvasRef } from './offcanvas-ref';
import { NgbOffcanvasOptions } from './offcanvas-config';
import { NgbOffcanvasBackdrop } from './offcanvas-backdrop';
import { NgbOffcanvasPanel } from './offcanvas-panel';

@Service()
export class NgbOffcanvasStack {
	private _applicationRef = inject(ApplicationRef);
	private _injector = inject(Injector);
	private _document = inject(DOCUMENT);
	private _scrollBar = inject(ScrollBar);

	private _activePanelCmptHasChanged = new Subject<void>();
	private _scrollBarRestoreFn: null | (() => void) = null;
	private _backdropAttributes = ['animation', 'backdropClass'];
	private _offcanvasRef?: NgbOffcanvasRef;
	private _panelAttributes = ['animation', 'ariaDescribedBy', 'ariaLabelledBy', 'keyboard', 'panelClass', 'position'];
	private _panelCmpt?: ComponentRef<NgbOffcanvasPanel>;
	private _activeInstance: EventEmitter<NgbOffcanvasRef | undefined> = new EventEmitter();

	constructor() {
        throw new Error("STUB");
    }

	private _restoreScrollBar() {
        throw new Error("STUB");
    }

	private _hideScrollBar() {
        throw new Error("STUB");
    }

	open(contentInjector: Injector, content: any, options: NgbOffcanvasOptions): NgbOffcanvasRef {
        throw new Error("STUB");
    }

	get activeInstance() {
        throw new Error("STUB");
    }

	dismiss(reason?: any) {
        throw new Error("STUB");
    }

	hasOpenOffcanvas(): boolean {
        throw new Error("STUB");
    }

	private _attachBackdrop(containerEl: Element): ComponentRef<NgbOffcanvasBackdrop> {
        throw new Error("STUB");
    }

	private _attachWindowComponent(containerEl: Element, projectableNodes: Node[][]): ComponentRef<NgbOffcanvasPanel> {
        throw new Error("STUB");
    }

	private _applyPanelOptions(windowInstance: NgbOffcanvasPanel, options: NgbOffcanvasOptions): void {
        throw new Error("STUB");
    }

	private _applyBackdropOptions(backdropInstance: NgbOffcanvasBackdrop, options: NgbOffcanvasOptions): void {
        throw new Error("STUB");
    }

	private _getContentRef(
		contentInjector: Injector,
		content: Type<any> | TemplateRef<any> | string,
		activeOffcanvas: NgbActiveOffcanvas,
	): ContentRef {
        throw new Error("STUB");
    }

	private _createFromTemplateRef(templateRef: TemplateRef<any>, activeOffcanvas: NgbActiveOffcanvas): ContentRef {
        throw new Error("STUB");
    }

	private _createFromString(content: string): ContentRef {
        throw new Error("STUB");
    }

	private _createFromComponent(
		contentInjector: Injector,
		componentType: Type<any>,
		context: NgbActiveOffcanvas,
	): ContentRef {
        throw new Error("STUB");
    }

	private _registerOffcanvasRef(ngbOffcanvasRef: NgbOffcanvasRef) {
        throw new Error("STUB");
    }

	private _registerPanelCmpt(ngbPanelCmpt: ComponentRef<NgbOffcanvasPanel>) {
        throw new Error("STUB");
    }
}
