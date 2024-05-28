import { Box, Line, TOrigin, Vec2 } from "./Geo";
import { OnScreenControl } from "./Input";
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
	screenToMouseMove(point: Vec2) {
		let middle = this.box.getCenterMiddle();
		let relativeMove = new Line(middle.x, middle.y, point.x, point.y).normal();
		return new Vec2(
			Vars.cameraWidth * relativeMove.x,
			Vars.cameraHeight * relativeMove.y
		)
	}
}
