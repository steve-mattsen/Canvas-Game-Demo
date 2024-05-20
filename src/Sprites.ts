import { vec2, bbox } from "./Vec2";
// import * as spr_link from "img/spritesheet_link.png"

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
}

let link: Img = new Img('spritesheet_link', "/spritesheet_link.png");
Img.addImg(link);