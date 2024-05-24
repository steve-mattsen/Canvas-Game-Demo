import { vec, vec2, box } from "./Geo";

export class Img {
	id: string = '';
	uri: string = '';
	element: HTMLImageElement;
	size: vec2;
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
	drawBox: box;
	duration: number
	constructor(image: Img, rows: number, cols: number, duration = 1) {
		this.image = image;
		this.rows = rows;
		this.cols = cols;
		this.colSize = Math.floor(this.image.size.x / cols);
		this.rowSize = Math.floor(this.image.size.y / rows);
		this.drawBox = new box(vec(0, 0), vec(this.colSize, this.rowSize));
		this.duration = duration;
	}
	getAnim(rows: number[], cols: number[]) {
		let frames: Sprite[] = [];
		rows.forEach(r => {
			cols.forEach(c => {
				frames.push(new Sprite(
					this.image,
					new box(
						vec(
							c * this.colSize,
							r * this.rowSize,
						),
						vec(
							(c + 1) * this.colSize,
							(r + 1) * this.rowSize,
						)
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
	drawBox: box;
	scale: number;
	duration: number;
	constructor(image: Img, drawBox?: box, scale = 1, duration = 4) {
		this.image = image;
		this.scale = scale;
		this.drawBox = drawBox;
		if (drawBox === undefined) {
			this.drawBox = new box(vec(0, 0), vec(image.size.x, image.size.y));
		}
		this.duration = duration
	};
	draw(ctx: CanvasRenderingContext2D, pos: vec2) {
		ctx.drawImage(
			this.image.element,
			this.drawBox.topLeft.x, this.drawBox.topLeft.y,
			this.drawBox.bottomRight.x, this.drawBox.bottomRight.y,
			Math.floor(pos.x), Math.floor(pos.y),
			Math.floor(this.drawBox.getWidth() * this.scale),
			Math.floor(this.drawBox.getHeight() * this.scale),
		)
	};
}

export function sprt(imgId: string): Sprite {
	return new Sprite(Img.store[imgId]);
}