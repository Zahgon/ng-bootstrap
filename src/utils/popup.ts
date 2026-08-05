import {
	afterNextRender,
	ApplicationRef,
	ComponentRef,
	inject,
	Injector,
	NgZone,
	TemplateRef,
	Type,
	ViewContainerRef,
	ViewRef,
	DOCUMENT,
} from '@angular/core';

import { Observable, of, Subject } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { ngbRunTransition } from './transition/ngbTransition';

export class ContentRef {
	constructor(
		public nodes: Node[][],
		public viewRef?: ViewRef,
		public componentRef?: ComponentRef<any>,
	) {}
}

export class PopupService<T> {
	private _windowRef: ComponentRef<T> | null = null;
	private _contentRef: ContentRef | null = null;

	private _document = inject(DOCUMENT);
	private _applicationRef = inject(ApplicationRef);
	private _injector = inject(Injector);
	private _viewContainerRef = inject(ViewContainerRef);
	private _ngZone = inject(NgZone);

	constructor(private _componentType: Type<T>) {}

	open(
		content?: string | TemplateRef<any>,
		templateContext?: any,
		animation = false,
	): { windowRef: ComponentRef<T>; transition$: Observable<void> } {
        throw new Error("STUB");
    }

	close(animation = false): Observable<void> {
        throw new Error("STUB");
    }

	private _getContentRef(content?: string | TemplateRef<any>, templateContext?: any): ContentRef {
        throw new Error("STUB");
    }
}
