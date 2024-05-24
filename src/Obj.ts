import { vec, vec2 } from "./Geo";
import { Img, Sprite, Animation, sprite } from "./Sprites";
export class Obj {
	id = "blah";
	sprite: Sprite;
	size = vec(128, 50);
	pos = vec(10, 10);
	velocity = vec(0, 0);
	animations: { [id: string]: Animation } = {};
	animState: string = 'idle_down';
	z = 0;
	zVelocity = 0;
	constructor(id: string, size: vec2 | null, pos: vec2, spr: Sprite | string, animations?: { [id: string]: Animation }) {
		this.id = id ?? this.id;
		if (typeof spr === 'string') {
			let imgId = spr as string;
			this.sprite = sprite(imgId);
		} else {
			this.sprite = spr;
		}
		this.size = size;
		if (size == null) {
			this.size = this.sprite.box.bottomRight;
		}
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