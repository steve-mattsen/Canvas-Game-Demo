import { vec2 } from "./Vec2";
import { Img } from "./Sprites";
export class Obj {
	id = "blah";
	image: Img;
	size = new vec2(50, 50);
	pos = new vec2(10, 10);
	velocity = new vec2(0, 0);
	constructor(id: string, image: Img, size: vec2, pos: vec2) {
		this.id = id ?? this.id;
		this.image = image ?? this.image;
		this.size = size ?? this.size;
		this.pos = pos ?? this.pos;
	}
	static store: { [id: string]: Obj } = {};
	static addObj(obj: Obj) {
		Obj.store[obj.id] = obj;
	}
}