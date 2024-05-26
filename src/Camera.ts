import { Box, BoxSpec, Vec2, boxLocation } from "./Geo";

export class Camera extends Box {
	pos: Vec2;
	zoom: number;
	constructor(pos: Vec2, viewBox: Box | BoxSpec, origin?: Vec2 | boxLocation, zoom = 1) {
		super(viewBox.x, viewBox.y, viewBox.width, viewBox.height, origin);
		this.pos = pos;
		this.zoom = zoom;
	}
}