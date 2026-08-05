import {
	afterNextRender,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Input,
	NgZone,
	OnInit,
	Output,
	ViewEncapsulation,
	ChangeDetectionStrategy,
} from '@angular/core';

import { Observable } from 'rxjs';

import { reflow, ngbRunTransition } from '@ng-bootstrap/ng-bootstrap/utils';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';

@Component({
	selector: 'ngb-offcanvas-backdrop',
	encapsulation: ViewEncapsulation.None,
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {
		'[class]': '"offcanvas-backdrop" + (backdropClass ? " " + backdropClass : "")',
		'[class.show]': '!animation',
		'[class.fade]': 'animation',
		'(mousedown)': 'dismiss()',
	},
})
export class NgbOffcanvasBackdrop implements OnInit {
	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _zone = inject(NgZone);
	private _injector = inject(Injector);

	@Input() animation: boolean;
	@Input() backdropClass: string;
	@Input() static: boolean;

	@Output('dismiss') dismissEvent = new EventEmitter();

	ngOnInit() {
        throw new Error("STUB");
    }

	hide(): Observable<void> {
        throw new Error("STUB");
    }

	dismiss() {
        throw new Error("STUB");
    }
}
