import { Box, TOrigin, Vec2 } from "./Geo";
import { OnScreenControl } from "./Input";

export default class VirtualJoystick extends OnScreenControl {
	box: Box;
	pos: TOrigin;
	posOffset: Vec2;
	value: Vec2;
	size: number = 100;
	id: string;
	constructor(id: string) {
		super(id);
		this.box = new Box(0, window.innerHeight - this.size, this.size, this.size);
		this.value = new Vec2(0, 0);
	}
}
