import { vec2, bbox } from "./Vec2";

export class Img {
	id: string = '';
	uri: string = '';
	element: HTMLImageElement;
	constructor(id: string = '', uri: string = '') {
		this.id = id ?? this.id;
		this.uri = uri ?? this.uri;
		this.element = new Image();
		this.element.src = this.uri;
	}
	public static store: { [id: string]: Img } = {};
	public static addImg(image: Img) {
		Img.store[image.id] = image;
	}
}

export class Frame {
	image: Img;
	subImg: bbox = new bbox(new vec2(0, 0), new vec2(0, 0));
	duration: number;
	constructor(image: Img, subImg: bbox, duration: number) {
		this.image = image ?? this.image;
		this.subImg = subImg ?? this.subImg;
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
}
