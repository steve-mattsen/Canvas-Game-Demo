import Game from "./Game";
import { Box, Line, TOrigin, Vec2, attachmentLocation, horizontalLocation, verticalLocation } from "./Geo";
import { OnScreenControl } from "./Input";

export default class VirtualJoystick extends OnScreenControl {
	value: Vec2;
	deadZone = 25;
	constructor(id: string, attachment: attachmentLocation, size: Vec2 = new Vec2(200, 200)) {
		super(id, attachment);
		this.value = new Vec2(0, 0);
	}
	screenToValue(point: Vec2) {
		let middle = this.box.getCenterMiddle();
		let line = new Line(middle.x, middle.y, point.x, point.y);
		let length = line.length();
		if (length < this.deadZone) {
			this.value.x = 0;
			this.value.y = 0;
			return;
		}
		this.value = line.normal();
		if (line.length() < (this.size.x / 2)) {
			let factor = (line.length() - this.deadZone) / ((this.size.x / 2) - this.deadZone);
			this.value.x *= factor;
			this.value.y *= factor;
		}
	}
}
