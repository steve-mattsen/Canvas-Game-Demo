import { vec, vec2 } from "./Geo";
import { Img, Sprite, Animation, sprt } from "./Sprites";
export class Obj {
	id = "blah";
	sprite: Sprite;
	size: vec2;
	pos: vec2;
	velocity = vec(0, 0);
	animations: { [id: string]: Animation } | null;
	animState: string = 'idle_down';
	z = 0;
	zVelocity = 0;
	constructor(id: string, size: vec2 | null, pos: vec2, spr: Sprite | string, animations?: { [id: string]: Animation }) {
		this.id = id ?? this.id;
		if (typeof spr === 'string') {
			let imgId = spr as string;
			this.sprite = sprt(imgId);
		} else {
			this.sprite = spr;
		}
		this.size = size;
		if (size == null) {
			this.size = this.sprite.box.bottomRight;
		}
		this.pos = pos ?? this.pos;
		this.animations = animations;
		if (animations === undefined) {
			this.animations = null;
		}
	}
	getAnimFrame() {
		return this.animations[this.animState].getCurrentFrame();
	}
	tickAnimFrame() {
		this.animations[this.animState].tickSprite();
	}
	static store: { [id: string]: Obj } = {};
	static addObj(obj: Obj) {
		Obj.store[obj.id] = obj;
	}
}