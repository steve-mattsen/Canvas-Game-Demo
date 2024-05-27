export class Vec2 {
	x = 0;
	y = 0;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	add(v: Vec2) {
		return new Vec2(this.x + v.x, this.y + v.y);
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
			this.origin = this.getPoint('left', 'top');
		} else {
			this.origin = this.getPoint(origin[0], origin[1]);
		}
	}
	getPoint(horiz: number | horizontalLocation, vert: number | verticalLocation) {
		let x, y;
		if (typeof horiz == 'number') {
			x = this.x + horiz;
		} else {
			switch (horiz) {
				case 'left':
					x = this.x;
					break;
				case 'center':
					x = this.x + (this.width / 2);
					break;
				case 'right':
					x = this.x + this.width;
					break;
			}
		}
		if (typeof vert === 'number') {
			y = this.y + vert;
		} else {
			switch (vert) {
				case 'top':
					y = this.y;
					break;
				case 'middle':
					y = this.y + (this.height / 2);
					break;
				case 'bottom':
					y = this.y + this.height;
					break;
			}
		}
		return new Vec2(x, y);
	}
	getPointLocal(horiz: number | horizontalLocation, vert: number | verticalLocation) {
		let x, y;
		if (typeof horiz == 'number') {
			x = this.x + horiz;
		} else {
			switch (horiz) {
				case 'left':
					x = 0;
					break;
				case 'center':
					x = this.width / 2;
					break;
				case 'right':
					x = this.width;
					break;
			}
		}
		if (typeof vert === 'number') {
			y = this.y + vert;
		} else {
			switch (vert) {
				case 'top':
					y = 0;
					break;
				case 'middle':
					y = this.height / 2;
					break;
				case 'bottom':
					y = this.height;
					break;
			}
		}
		return new Vec2(x, y);
	}
	p1() {
		return new Vec2(
			this.x,
			this.y,
		);
	}
	p2() {
		return new Vec2(
			this.x + this.width,
			this.y + this.height,
		);
	}
	getCenterMiddle() {
		return this.getPoint('center', 'middle');
	}
	fromPoint(point: Vec2) {
		return new Box(
			point.x + this.x,
			point.y + this.y,
			this.width,
			this.height,
			this.origin,
		);
	}
	fromOrigin(origin?: TOrigin) {
		if (origin === null || origin === undefined) {
			origin = this.origin;
		} else if (origin instanceof Vec2) {
			origin = this.getPointLocal(origin.x, origin.y);
		} else {
			origin = this.getPointLocal(origin[0], origin[1]);
		}
		return new Box(
			this.x - origin.x,
			this.y - origin.y,
			this.width,
			this.height,
			new Vec2(0, 0),
		)
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
	collidesWith(box: Box) {
		let b1p2 = this.p2();
		let b2p1 = box.p1();
		let b2p2 = box.p2();
		if (this.x > b2p2.x || b1p2.x < b2p1.x) {
			//We know the x's don't overlap
			return false;
		}
		if (this.y > b2p2.y || b1p2.y < b2p1.y) {
			return false;
		}
		return true;
	}
	adjustSpeedForCollision(other: Box, move: Vec2, speed: number) {
		let speedX = move.x * speed;
		let speedY = move.y * speed;
		if (this.x + this.width + speedX > other.x &&
			this.x + speedX < other.x + other.width &&
			this.y + this.height > other.y &&
			this.y < other.y + other.height) {
			speedX = 0;
		}
		if (this.x + this.width > other.x &&
			this.x < other.x + other.width &&
			this.y + this.height + speedY > other.y &&
			this.y + speedY < other.y + other.height) {
			speedY = 0;
		}
		return new Vec2(
			speedX,
			speedY,
		);
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