import { vec, vec2, bbox } from "./Geo";

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

export class Frame {
	image: Img;
	subImg: bbox = new bbox(vec(0, 0), vec(0, 0));
	duration: number = 4;
	constructor(image: Img, subImgX: number, subImgY: number, subImgWidth: number, subImgHeight: number, duration: number) {
		this.image = image ?? this.image;
		this.subImg = new bbox(
			vec(
				subImgX,
				subImgY
			), vec(
				subImgX + subImgWidth,
				subImgY + subImgHeight
			)
		);
		this.duration = duration ?? this.duration;
	}
}

export class Animation {
	frames: Frame[] = [];
	id: string;
	tick: number = 0;
	currentFrame: number = 0;
	constructor(frames: Frame[]) {
		this.frames = frames ?? this.frames;
	}
	tickFrame() {
		this.tick++;
		if (this.tick > this.frames[this.currentFrame].duration) {
			// Move to next frame.
			this.currentFrame++;
			this.currentFrame %= this.frames.length;
			this.tick = 0;
		}
	}
	getCurrentFrame() {
		return this.frames[this.currentFrame];
	}
	copy() {
		return new Animation([...this.frames]);
	}
}

export class SpriteSheet {
	image: Img;
	rows: number;
	cols: number;
	rowSize: number;
	colSize: number;
	box: bbox;
	constructor(image: Img, rows: number, cols: number) {
		this.image = image;
		this.rows = rows;
		this.cols = cols;
		this.colSize = Math.floor(this.image.size.x / cols);
		this.rowSize = Math.floor(this.image.size.y / rows);
		this.box = new bbox(vec(0, 0), vec(this.colSize, this.rowSize));
	}
	getAnim(rows: number[], cols: number[], duration: number = 4) {
		let frames: Frame[] = [];
		rows.forEach(r => {
			cols.forEach(c => {
				frames.push(new Frame(
					this.image,
					c * this.colSize,
					r * this.rowSize,
					this.colSize,
					this.rowSize,
					duration,
				))
			})
		})
		return new Animation(frames);
	}
}

export enum boxLocation {
	top_left,
	top_center,
	top_right,
	middle_left,
	middle_center,
	middle_right,
	bottom_left,
	bottom_center,
	bottom_right,
}

export class Sprite {
	image: Img;
	box: bbox;
	scale: number;
	origin: vec2;
	constructor(image: Img, box?: bbox, origin?: vec2 | boxLocation, scale = 1) {
		this.image = image;
		this.scale = scale;
		this.box = box;
		if (box === undefined) {
			this.box = new bbox(vec(0, 0), vec(image.size.x, image.size.y));
		}
		if (origin === undefined) {
			origin = boxLocation.bottom_center;
		}
		if (origin instanceof vec2) {
			this.origin = origin;
		}
		let originPoint = vec(0, 0);
		switch (origin) {
			case boxLocation.top_left:
			case boxLocation.top_center:
			case boxLocation.top_right:
				originPoint.y = 0;
				break;
			case boxLocation.middle_left:
			case boxLocation.middle_center:
			case boxLocation.middle_right:
				originPoint.y = this.box.getHeight() / 2;
				break;
			case boxLocation.bottom_left:
			case boxLocation.bottom_left:
			case boxLocation.bottom_left:
				originPoint.y = this.box.getHeight();
				break;
		}
		switch (origin) {
			case boxLocation.top_left:
			case boxLocation.middle_left:
			case boxLocation.bottom_left:
				originPoint.x = 0;
				break;
			case boxLocation.top_center:
			case boxLocation.middle_center:
			case boxLocation.bottom_center:
				originPoint.x = this.box.getWidth() / 2;
				break;
			case boxLocation.top_right:
			case boxLocation.middle_right:
			case boxLocation.bottom_right:
				originPoint.x = this.box.getWidth();
				break;
		}
	};
	draw(ctx: CanvasRenderingContext2D, pos: vec2) {
		ctx.drawImage(
			this.image.element,
			this.box.topLeft.x, this.box.topLeft.y,
			this.box.bottomRight.x, this.box.bottomRight.y,
			Math.floor(pos.x), Math.floor(pos.y),
			Math.floor(this.box.getWidth() * this.scale),
			Math.floor(this.box.getHeight() * this.scale),
		)
	};
}

export function sprite(imgId: string): Sprite {
	return new Sprite(Img.store[imgId]);
}