import { isNumber, toInteger } from '@ng-bootstrap/ng-bootstrap/utils';

export class NgbTime {
	hour: number;
	minute: number;
	second: number;

	constructor(hour?: number, minute?: number, second?: number) {
		this.hour = toInteger(hour);
		this.minute = toInteger(minute);
		this.second = toInteger(second);
	}

	changeHour(step = 1) {
        throw new Error("STUB");
    }

	updateHour(hour: number) {
        throw new Error("STUB");
    }

	changeMinute(step = 1) {
        throw new Error("STUB");
    }

	updateMinute(minute: number) {
        throw new Error("STUB");
    }

	changeSecond(step = 1) {
        throw new Error("STUB");
    }

	updateSecond(second: number) {
        throw new Error("STUB");
    }

	isValid(checkSecs = true) {
		return isNumber(this.hour) && isNumber(this.minute) && (checkSecs ? isNumber(this.second) : true);
	}

	toString() {
		return `${this.hour || 0}:${this.minute || 0}:${this.second || 0}`;
	}
}
