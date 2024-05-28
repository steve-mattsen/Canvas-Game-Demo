import { Box, Line, TOrigin, Vec2 } from "./Geo";
import { OnScreenControl } from "./Input";
import { Obj } from "./Obj";
import Vars from "./Vars";

export default class VirtualJoystick extends OnScreenControl {
	box: Box;
	pos: TOrigin;
	posOffset: Vec2;
	value: Vec2;
	size: number = 200;
	id: string;
	constructor(id: string) {
		super(id);
		this.box = new Box(0, window.innerHeight - this.size, this.size, this.size);
		this.value = new Vec2(0, 0);
	}
	screenToValue(point: Vec2) {
		let middle = this.box.getCenterMiddle();
		this.value = new Line(middle.x, middle.y, point.x, point.y).normal();
	}
}
