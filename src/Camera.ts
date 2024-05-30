import { Box, BoxSpec, Vec2, TOrigin } from "./Geo";

export class Camera {
	pos: Vec2;
	zoom: number;
	constructor(pos: Vec2, zoom = 4) {
		this.pos = pos;
		this.zoom = zoom;
	}
}