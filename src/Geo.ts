export class Vec2 {
	x = 0;
	y = 0;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	add(vec: Vec2) {
		return new Vec2(this.x + vec.x, this.y + vec.y);
	}
	length() {
		let sumProduct = this.x * this.x + this.y * this.y;
		// console.log(sumProduct);
		if (sumProduct === 0) {
			return 0;
		}
		return Math.sqrt(sumProduct);
	}
	normalize() {
		let length = this.length();
		if (length === 0) {
			return new Vec2(0, 0);
		}
		return new Vec2(this.x / length, this.y / length);
	}
	scale(scalar: number) {
		return new Vec2(
			this.x * scalar,
			this.y * scalar,
		);
	}
}

export class Vec3 extends Vec2 {
	x = 0;
	y = 0;
	z = 0;
	constructor(x: number, y: number, z: number) {
		super(x, y);
		this.z = z;
	}
}

type verticalLocation = 'top' | 'middle' | 'bottom';
type horizontalLocation = 'left' | 'center' | 'right';


export interface BoxSpec {
	x: number;
	y: number;
	width: number;
	height: number;
	origin?: TOrigin;
}

export type TOrigin = Vec2 | [horizontalLocation, verticalLocation];

export class Box {
	x: number;
	y: number;
	width: number;
	height: number;
	origin: Vec2;
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		origin?: TOrigin,
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		if (origin instanceof Vec2) {
			this.origin = origin;
		} else if (origin === undefined || origin === null) {
			this.origin = this.getRelPoint('left', 'top');
		} else {
			this.origin = this.getRelPoint(origin[0], origin[1]);
		}
	}
	getRelPoint(horiz: number | horizontalLocation, vert: number | verticalLocation) {
		let x, y;
		if (typeof horiz == 'number') {
			x = horiz;
		} else {
			switch (horiz) {
				case 'left':
					x = 0;
					break;
				case 'center':
					x = Math.floor(this.width / 2);
					break;
				case 'right':
					x = this.width;
					break;
			}
		}
		if (typeof vert === 'number') {
			y = vert;
		} else {
			switch (vert) {
				case 'top':
					y = 0;
					break;
				case 'middle':
					y = Math.floor(this.height / 2);
					break;
				case 'bottom':
					y = this.height;
					break;
			}
		}
		return vec(x, y);
	}
	getAbsPoint(x: number | horizontalLocation, y: number | verticalLocation) {
		let relative = this.getRelPoint(x, y);
		relative.x += this.x - this.origin.x;
		relative.y += this.y - this.origin.y;
		return relative;
	}
	p1() {
		return this.getAbsPoint('left', 'top');
	}
	p2() {
		return this.getAbsPoint('right', 'bottom');
	}
	fromOrigin() {
		return new Box(
			this.x - this.origin.x,
			this.y - this.origin.y,
			this.width,
			this.height,
			vec(0, 0),
		)
	}
	getAbsCenter() {
		return this.getAbsPoint('center', 'middle');
	}
	contains(point: Vec2) {
		if (point.x < this.x
			|| point.x > this.width
			|| point.y < this.y
			|| point.y > this.height
		) {
			return false;
		}
		return true;
	}
}

export class Line {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	constructor(x1: number, y1: number, x2: number, y2: number) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
	length() {
		let sumProduct = ((this.x2 - this.x1) ** 2)
			+ ((this.y2 - this.y1) ** 2);
		if (sumProduct === 0) {
			return 0;
		}
		return Math.sqrt(sumProduct);
	}
	normal() {
		let length = this.length();
		if (length === 0) {
			return new Line(this.x1, this.y1, this.x2, this.y2);
		}
		return new Line(
			0,
			0,
			(this.x2 / length) - this.x1,
			(this.y2 / length) - this.y1,
		);
	}
	p1() {
		return new Vec2(this.x1, this.y1);
	}
	p2() {
		return new Vec2(this.x2, this.y2);
	}
}

export function vec(x: number, y: number, z: number = null) {
	if (z == null) {
		return new Vec2(x, y);
	}
	return new Vec3(x, y, z);
}