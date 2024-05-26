import { Box, BoxSpec, Vec2, TOrigin } from "./Geo";

export class Camera extends Box {
	pos: Vec2;
	zoom: number;
	constructor(pos: Vec2, viewBox: Box | BoxSpec, origin?: TOrigin, zoom = 1) {
		super(viewBox.x, viewBox.y, viewBox.width, viewBox.height, origin);
		this.pos = pos;
		this.zoom = zoom;
	}
}