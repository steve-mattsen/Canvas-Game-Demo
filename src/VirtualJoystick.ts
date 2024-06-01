import { Box, Line, TOrigin, Vec2 } from "./Geo";
import { OnScreenControl } from "./Input";

export default class VirtualJoystick extends OnScreenControl {
	box: Box;
	value: Vec2;
	size: number = 200;
	id: string;
	deadZone = 25;
	constructor(id: string) {
		super(id);
		this.box = new Box(0, window.innerHeight - this.size, this.size, this.size);
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
		if (line.length() < (this.size / 2)) {
			let factor = (line.length() - this.deadZone) / ((this.size / 2) - this.deadZone);
			this.value.x *= factor;
			this.value.y *= factor;
		}
	}
}
