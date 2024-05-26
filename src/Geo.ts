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


export interface BoxSpec {
	x: number;
	y: number;
	width: number;
	height: number;
	origin?: Vec2 | boxLocation;
}

export class Box {
	x: number;
	y: number;
	width: number;
	height: number;
	origin: Vec2;
	constructor(x: number, y: number, width: number, height: number, origin?: Vec2 | boxLocation) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		if (origin instanceof Vec2) {
			this.origin = origin;
		} else {
			this.origin = this.getRelPoint(origin ?? boxLocation.bottom_center);
		}
	}
	getRelPoint(point: Vec2 | boxLocation) {
		let x, y;
		switch (point) {
			case boxLocation.top_left:
			case boxLocation.top_center:
			case boxLocation.top_right:
				y = 0;
				break;
			case boxLocation.middle_left:
			case boxLocation.middle_center:
			case boxLocation.middle_right:
				y = Math.floor(this.height / 2);
				break;
			case boxLocation.bottom_left:
			case boxLocation.bottom_center:
			case boxLocation.bottom_right:
				y = this.height;
				break;
		}
		switch (point) {
			case boxLocation.top_left:
			case boxLocation.middle_left:
			case boxLocation.bottom_left:
				x = 0;
				break;
			case boxLocation.top_center:
			case boxLocation.middle_center:
			case boxLocation.bottom_center:
				x = Math.floor(this.width / 2);
				break;
			case boxLocation.top_right:
			case boxLocation.middle_right:
			case boxLocation.bottom_right:
				x = this.width;
				break;
		}
		return vec(x, y);
	}
	getPoint(point: Vec2 | boxLocation) {
		let relative = this.getRelPoint(point);
		relative.x += this.x - this.origin.x;
		relative.y -= this.y - this.origin.y;
		return relative;
	}
	p1() {
		return this.getPoint(boxLocation.top_left);
	}
	p2() {
		return this.getPoint(boxLocation.bottom_right);
	}
	getCenter() {
		return new Vec2(
			(this.x + this.width) / 2,
			(this.y + this.height) / 2,
		)
	}
	normalize(): Vec2 {
		let length = this.length();
		if (length === 0) {
			return new Vec2(0, 0);
		}
		return new Vec2(
			(this.width - this.x) / length,
			(this.height - this.y) / length
		);
	}
	length() {
		let sumProduct = ((this.width - this.x) ** 2)
			+ ((this.height - this.y) ** 2);
		if (sumProduct === 0) {
			return 0;
		}
		return Math.sqrt(sumProduct);
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

export function vec(x: number, y: number, z: number = null) {
	if (z == null) {
		return new Vec2(x, y);
	}
	return new Vec3(x, y, z);
}