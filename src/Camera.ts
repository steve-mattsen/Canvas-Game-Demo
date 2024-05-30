import { Box, BoxSpec, Vec2, TOrigin } from "./Geo";
import Vars from "./Vars";

export class Camera extends Box {
	zoom: number;
	constructor(x: number, y: number, w: number, h: number, origin?: TOrigin, zoom = 4) {
		super(x, y, w, h, origin);
		this.zoom = zoom;
		this.updateDims();
	}
	updateDims() {
		this.width = Vars.canvasWidth / this.zoom;
		this.height = Vars.canvasHeight / this.zoom;
	}
}