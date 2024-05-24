export class vec2 {
	x = 0;
	y = 0;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	add(vec: vec2) {
		return new vec2(this.x + vec.x, this.y + vec.y);
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
			return new vec2(0, 0);
		}
		return new vec2(this.x / length, this.y / length);
	}
	scale(scalar: number) {
		return new vec2(
			this.x * scalar,
			this.y * scalar,
		);
	}
}

export class vec3 extends vec2 {
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

export class bbox {
	topLeft: vec2 = new vec2(0, 0);
	bottomRight: vec2 = new vec2(0, 0);
	origin: vec2;
	constructor(topLeft: vec2, bottomRight: vec2, origin?: vec2 | boxLocation) {
		this.topLeft = topLeft ?? this.topLeft;
		this.bottomRight = bottomRight ?? this.bottomRight;

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
				originPoint.y = this.getHeight() / 2;
				break;
			case boxLocation.bottom_left:
			case boxLocation.bottom_left:
			case boxLocation.bottom_left:
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
				originPoint.x = this.getWidth() / 2;
				break;
			case boxLocation.top_right:
			case boxLocation.middle_right:
			case boxLocation.bottom_right:
				originPoint.x = this.getWidth();
				break;
		}
	}
	getCenter() {
		return new vec2(
			(this.topLeft.x + this.bottomRight.x) / 2,
			(this.topLeft.y + this.bottomRight.y) / 2,
		)
	}
	getWidth() {
		return this.bottomRight.x - this.topLeft.x;
	}
	getHeight() {
		return this.bottomRight.y - this.topLeft.y;
	}
	normalize(): vec2 {
		let length = this.length();
		if (length === 0) {
			return new vec2(0, 0);
		}
		return new vec2(
			(this.bottomRight.x - this.topLeft.x) / length,
			(this.bottomRight.y - this.topLeft.y) / length
		);
	}
	length() {
		let sumProduct = ((this.bottomRight.x - this.topLeft.x) ** 2)
			+ ((this.bottomRight.y - this.topLeft.y) ** 2);
		if (sumProduct === 0) {
			return 0;
		}
		return Math.sqrt(sumProduct);
	}
	contains(point: vec2) {
		if (point.x < this.topLeft.x
			|| point.x > this.bottomRight.x
			|| point.y < this.topLeft.y
			|| point.y > this.bottomRight.y
		) {
			return false;
		}
		return true;
	}
}

export function vec(x: number, y: number, z: number = null) {
	if (z == null) {
		return new vec2(x, y);
	}
	return new vec3(x, y, z);
}