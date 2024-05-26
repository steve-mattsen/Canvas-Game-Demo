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
	bottomRight: Vec2 = new Vec2(0, 0);
	origin: Vec2;
	constructor(x: number, y: number, width: number, height: number, origin?: Vec2 | boxLocation) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.bottomRight = vec(x + width, y + height);

		if (origin === undefined) {
			origin = boxLocation.bottom_center;
		}
		if (origin instanceof Vec2) {
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
				originPoint.y = Math.floor(this.getHeight() / 2);
				break;
			case boxLocation.bottom_left:
			case boxLocation.bottom_center:
			case boxLocation.bottom_right:
				originPoint.y = this.getHeight();
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
				originPoint.x = Math.floor(this.getWidth() / 2);
				break;
			case boxLocation.top_right:
			case boxLocation.middle_right:
			case boxLocation.bottom_right:
				originPoint.x = this.getWidth();
				break;
		}
		this.origin = originPoint;
	}
	getCenter() {
		return new Vec2(
			(this.x + this.width) / 2,
			(this.y + this.height) / 2,
		)
	}
	getX() {
		return this.x;
	}
	getY() {
		return this.y;
	}
	getWidth() {
		return this.bottomRight.x - this.x;
	}
	getHeight() {
		return this.bottomRight.y - this.y;
	}
	normalize(): Vec2 {
		let length = this.length();
		if (length === 0) {
			return new Vec2(0, 0);
		}
		return new Vec2(
			(this.bottomRight.x - this.x) / length,
			(this.bottomRight.y - this.y) / length
		);
	}
	length() {
		let sumProduct = ((this.bottomRight.x - this.x) ** 2)
			+ ((this.bottomRight.y - this.y) ** 2);
		if (sumProduct === 0) {
			return 0;
		}
		return Math.sqrt(sumProduct);
	}
	contains(point: Vec2) {
		if (point.x < this.x
			|| point.x > this.bottomRight.x
			|| point.y < this.y
			|| point.y > this.bottomRight.y
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