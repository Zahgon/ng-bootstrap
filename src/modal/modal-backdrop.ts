import {
	afterNextRender,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	Injector,
	Input,
	NgZone,
	OnInit,
	ViewEncapsulation,
	ChangeDetectionStrategy,
} from '@angular/core';

import { Observable } from 'rxjs';

import { ngbRunTransition, isDefined, reflow } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbModalUpdatableOptions } from './modal-config';

const BACKDROP_ATTRIBUTES: string[] = ['animation', 'backdropClass'];

@Component({
	selector: 'ngb-modal-backdrop',
	encapsulation: ViewEncapsulation.None,
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {
		'[class]': '"modal-backdrop" + (backdropClass ? " " + backdropClass : "")',
		'[class.show]': '!animation',
		'[class.fade]': 'animation',
		'[style.z-index]': '1055',
	},
})
export class NgbModalBackdrop implements OnInit {
	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _zone = inject(NgZone);
	private _injector = inject(Injector);
	private _cdRef = inject(ChangeDetectorRef);

	@Input() animation: boolean;
	@Input() backdropClass: string;

	ngOnInit() {
        throw new Error("STUB");
    }

	hide(): Observable<void> {
        throw new Error("STUB");
    }

	updateOptions(options: NgbModalUpdatableOptions) {
        throw new Error("STUB");
    }
}
