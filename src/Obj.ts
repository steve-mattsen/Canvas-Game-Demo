import { vec, Vec2, Box } from "./Geo";
import { Img, Sprite, Animation, sprt } from "./Sprites";
export class Obj {
	id = "blah";
	sprite: Sprite;
	hitBox: Box;
	pos: Vec2;
	velocity = vec(0, 0);
	animations: { [id: string]: Animation } | null;
	animState: string = 'idle_down';
	z = 0;
	zVelocity = 0;
	constructor(
		id: string,
		pos: Vec2,
		spr?: Sprite | string,
		hitBox?: Box | null,
		animations?: { [id: string]: Animation }
	) {
		this.id = id ?? this.id;
		if (typeof spr === 'string') {
			let imgId = spr as string;
			this.sprite = sprt(imgId);
		} else {
			this.sprite = spr;
		}
		this.hitBox = hitBox;
		if (hitBox === null || hitBox == undefined) {
			this.hitBox = this.sprite.drawBox;
		}
		this.pos = pos ?? this.pos;
		this.animations = animations;
		if (animations === undefined) {
			this.animations = null;
		} else {
			this.animState = Object.keys(this.animations)[0];
		}
	}
	getAnimFrame() {
		return this.animations[this.animState].getCurrentFrame();
	}
	tickAnimFrame() {
		this.animations[this.animState].tickSprite();
	}
	getAbsoluteHitbox() {
		return new Box(
			this.pos.x - this.hitBox.origin.x,
			this.pos.y - this.hitBox.origin.y,
			this.hitBox.getWidth(),
			this.hitBox.getHeight(),
		);
	}
	static store: { [id: string]: Obj } = {};
	static addObj(obj: Obj) {
		Obj.store[obj.id] = obj;
	}
}