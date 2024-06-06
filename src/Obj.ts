import Game from "./Game";
import { vec, Vec2, Box } from "./Geo";
import { Sprite, Animation, sprt } from "./Sprites";
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
	currentMoveLength = 0;
	currentMove = new Vec2(0, 0);
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
		this.hitBox = hitBox ?? null;
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
	calcHitBox() {
		return this.hitBox.fromPoint(this.pos).fromOrigin();
	}
	act() {
		if (!this.id.match(/(lion|tiger|crow|lobster)/)) {
			return;
		}

		this.tickAnimFrame();
		if (this.currentMoveLength > 0) {
			this.pos.x += this.currentMove.x;
			this.pos.y += this.currentMove.y;
			this.currentMoveLength--;
			if (this.currentMoveLength <= 0) {
				this.animState = this.animState.replace('run', 'idle');
			}
			return;
		}
		if (Math.random() > 0.005) {
			return;
		}
		let move = new Vec2(
			(Math.random() * 2) - 1,
			(Math.random() * 2) - 1);
		if (Math.abs(move.x) >= Math.abs(move.y)) {
			if (this.animState.match(/(up|down)/gi) && this.hitBox !== null) {
				this.hitBox.turn();
			}
			if (move.x > 0) {
				this.animState = "run_right";
			} else {
				this.animState = "run_left";
			}
		} else {
			if (this.animState.match(/(right|left)/gi) && this.hitBox !== null) {
				this.hitBox.turn();
			}
			if (move.y > 0) {
				this.animState = "run_down";
			} else {
				this.animState = "run_up";
			}
		}
		this.currentMove = move;
		this.currentMoveLength = Math.random() * 120;
		return;
	}
	static store: { [id: string]: Obj } = {};
	static addObj(obj: Obj) {
		Obj.store[obj.id] = obj;
	}
}