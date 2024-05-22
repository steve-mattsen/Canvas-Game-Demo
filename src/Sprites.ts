import { vec2, bbox } from "./Vec2";

export class Img {
	id: string = '';
	uri: string = '';
	element: HTMLImageElement;
	size: vec2;
	constructor(id: string = '', uri: string = '') {
		this.id = id ?? this.id;
		this.uri = uri ?? this.uri;
		this.element = new Image();
		this.element.src = this.uri;
		this.size = new vec2(this.element.width, this.element.height);
	}
	public static store: { [id: string]: Img } = {};
	public static addImg(image: Img) {
		Img.store[image.id] = image;
	}
}

export class Frame {
	image: Img;
	subImg: bbox = new bbox(new vec2(0, 0), new vec2(0, 0));
	duration: number = 4;
	constructor(image: Img, subImgX: number, subImgY: number, subImgWidth: number, subImgHeight: number, duration: number) {
		this.image = image ?? this.image;
		this.subImg = new bbox(
			new vec2(
				subImgX,
				subImgY
			), new vec2(
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
	rowDims: number[] = [];
	colDims: number[] = [];
	constructor(image: Img, rowDims: number[], colDims: number[]) {
		this.image = image;
		this.rowDims = rowDims;
		this.colDims = colDims;
	}
	getAnim(rows: number[], cols: number[], duration: number = 4) {
		let frames: Frame[] = [];
		rows.forEach(r => {
			cols.forEach(c => {
				let thisRowDim = this.rowDims[r];
				let thisColDim = this.colDims[c];
				let nextRowDim = this.rowDims[r + 1] ?? this.image.size.y;
				let nextColumnDim = this.colDims[c + 1] ?? this.image.size.x;
				frames.push(new Frame(
					this.image,
					thisColDim,
					Math.round(thisRowDim),
					nextColumnDim - thisColDim,
					Math.round(nextRowDim - thisRowDim),
					duration ?? 4)
				);
			})
		})
		return new Animation(frames);
	}
}