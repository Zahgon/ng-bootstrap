import {
	ApplicationRef,
	ComponentRef,
	createComponent,
	EnvironmentInjector,
	EventEmitter,
	inject,
	Service,
	Injector,
	NgZone,
	TemplateRef,
	Type,
	DOCUMENT,
} from '@angular/core';
import { Subject } from 'rxjs';

import { isDefined, isString, ngbFocusTrap, ContentRef, ScrollBar } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbModalBackdrop } from './modal-backdrop';
import { NgbModalOptions, NgbModalUpdatableOptions } from './modal-config';
import { NgbActiveModal, NgbModalRef } from './modal-ref';
import { NgbModalWindow } from './modal-window';
import { take } from 'rxjs/operators';

@Service()
export class NgbModalStack {
	private _applicationRef = inject(ApplicationRef);
	private _injector = inject(Injector);
	private _environmentInjector = inject(EnvironmentInjector);
	private _document = inject(DOCUMENT);
	private _scrollBar = inject(ScrollBar);

	private _activeWindowCmptHasChanged = new Subject<void>();
	private _ariaHiddenValues: Map<Element, string | null> = new Map();
	private _scrollBarRestoreFn: null | (() => void) = null;
	private _modalRefs: NgbModalRef[] = [];
	private _windowCmpts: ComponentRef<NgbModalWindow>[] = [];
	private _activeInstances: EventEmitter<NgbModalRef[]> = new EventEmitter();

	constructor() {
        throw new Error("STUB");
    }

	private _restoreScrollBar() {
        throw new Error("STUB");
    }

	private _hideScrollBar() {
        throw new Error("STUB");
    }

	open(contentInjector: Injector, content: any, options: NgbModalOptions): NgbModalRef {
        throw new Error("STUB");
    }

	get activeInstances() {
        throw new Error("STUB");
    }

	dismissAll(reason?: any) {
        throw new Error("STUB");
    }

	hasOpenModals(): boolean {
        throw new Error("STUB");
    }

	private _attachBackdrop(containerEl: Element): ComponentRef<NgbModalBackdrop> {
        throw new Error("STUB");
    }

	private _attachWindowComponent(containerEl: Element, projectableNodes: Node[][]): ComponentRef<NgbModalWindow> {
        throw new Error("STUB");
    }

	private _getContentRef(
		contentInjector: Injector,
		environmentInjector: EnvironmentInjector,
		content: Type<any> | TemplateRef<any> | string,
		activeModal: NgbActiveModal,
		options: NgbModalOptions,
	): ContentRef {
        throw new Error("STUB");
    }

	private _createFromTemplateRef(templateRef: TemplateRef<any>, activeModal: NgbActiveModal): ContentRef {
        throw new Error("STUB");
    }

	private _createFromString(content: string): ContentRef {
        throw new Error("STUB");
    }

	private _createFromComponent(
		contentInjector: Injector,
		environmentInjector: EnvironmentInjector,
		componentType: Type<any>,
		context: NgbActiveModal,
		options: NgbModalOptions,
	): ContentRef {
        throw new Error("STUB");
    }

	private _setAriaHidden(element: Element) {
        throw new Error("STUB");
    }

	private _revertAriaHidden() {
        throw new Error("STUB");
    }

	private _registerModalRef(ngbModalRef: NgbModalRef) {
        throw new Error("STUB");
    }

	private _registerWindowCmpt(ngbWindowCmpt: ComponentRef<NgbModalWindow>) {
        throw new Error("STUB");
    }
}
