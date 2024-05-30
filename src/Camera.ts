import { Box, BoxSpec, Vec2, TOrigin } from "./Geo";
import Vars from "./Vars";

export class Camera {
	pos: Vec2;
	zoom: number;
	box: Box = new Box(0, 0, 0, 0, ['center', 'middle']);
	constructor(pos: Vec2, zoom = 4) {
		this.pos = pos;
		this.zoom = zoom;
		this.updateDims();
	}
	updateDims() {
		this.box.width = Vars.canvasWidth / this.zoom;
		this.box.height = Vars.canvasHeight / this.zoom;
	}
}