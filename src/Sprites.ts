import { vec, Vec2, Box } from "./Geo";
import Vars from "./Vars";

export class Img {
	id: string = '';
	uri: string = '';
	element: HTMLImageElement;
	size: Vec2;
	loaded = false;
	constructor(id: string = '', uri: string = '') {
		this.id = id ?? this.id;
		this.uri = uri ?? this.uri;
		this.element = new Image();
		this.element.src = this.uri;
		this.element.onload = () => {
			this.size = vec(this.element.width, this.element.height);
		};
	}
	public static store: { [id: string]: Img } = {};
	public static addImg(image: Img) {
		Img.store[image.id] = image;
	}
	public static checkImagesArePreloaded() {
		for (const [key, image] of Object.entries(Img.store)) {
			if (!image.element.complete) {
				return false;
			}
		}
		return true;
	}
}

export class Animation {
	sprites: Sprite[] = [];
	id: string;
	tick: number = 0;
	currentSprite: number = 0;
	constructor(sprites: Sprite[]) {
		this.sprites = sprites;
	}
	tickSprite() {
		let duration = this.sprites[this.currentSprite].duration;
		this.tick++;
		if (this.tick > duration) {
			// Move to next frame.
			this.currentSprite++;
			this.currentSprite %= this.sprites.length;
			this.tick = 0;
		}
	}
	getCurrentFrame() {
		return this.sprites[this.currentSprite];
	}
	copy() {
		return new Animation([...this.sprites]);
	}
}

export class SpriteSheet {
	image: Img;
	rows: number;
	cols: number;
	rowSize: number;
	colSize: number;
	drawBox: Box;
	duration: number
	constructor(image: Img | string, rows: number, cols: number, duration = 1) {
		if (typeof image === 'string') {
			this.image = Img.store[image];
		} else {
			this.image = image;
		}
		this.rows = rows;
		this.cols = cols;
		this.colSize = Math.floor(this.image.size.x / cols);
		this.rowSize = Math.floor(this.image.size.y / rows);
		this.drawBox = new Box(0, 0, this.colSize, this.rowSize, ['center', 'bottom']);
		this.duration = duration;
	}
	getAnim(rows: number[], cols: number[]) {
		let frames: Sprite[] = [];
		rows.forEach(r => {
			cols.forEach(c => {
				frames.push(new Sprite(
					this.image,
					new Box(
						c * this.colSize,
						r * this.rowSize,
						this.colSize,
						this.rowSize,
						this.drawBox.origin,
					),
					1,
					this.duration
				))
			})
		})
		return new Animation(frames);
	}
}

export class Sprite {
	image: Img;
	drawBox: Box;
	scale: number;
	duration: number;
	constructor(image: Img, drawBox?: Box, scale = 1, duration = 4) {
		this.image = image;
		this.scale = scale;
		this.drawBox = drawBox;
		if (drawBox === undefined) {
			this.drawBox = new Box(0, 0, image.size.x, image.size.y, ['center', 'bottom']);
		}
		this.duration = duration
	};
}

export function sprt(imgId: string): Sprite {
	return new Sprite(Img.store[imgId]);
}