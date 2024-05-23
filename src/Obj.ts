import { vec2 } from "./Vec2";
import { Img, Animation } from "./Sprites";
export class Obj {
	id = "blah";
	image: Img;
	size = new vec2(128, 50);
	pos = new vec2(10, 10);
	velocity = new vec2(0, 0);
	animations: { [id: string]: Animation } = {};
	animState: string = 'idle_down';
	z = 0;
	zVelocity = 0;
	constructor(id: string, image: Img, size: vec2, pos: vec2, animations: { [id: string]: Animation } = {}) {
		this.id = id ?? this.id;
		this.image = image ?? this.image;
		this.size = size ?? this.size;
		this.pos = pos ?? this.pos;
		this.animations = animations ?? this.animations;
	}
	getAnimFrame() {
		return this.animations[this.animState].getCurrentFrame();
	}
	tickAnimFrame() {
		this.animations[this.animState].tickFrame();
	}
	static store: { [id: string]: Obj } = {};
	static addObj(obj: Obj) {
		Obj.store[obj.id] = obj;
	}
}