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

export class bbox {
	topLeft: vec2 = new vec2(0, 0);
	bottomRight: vec2 = new vec2(0, 0);
	constructor(topLeft: vec2, bottomRight: vec2) {
		this.topLeft = topLeft ?? this.topLeft;
		this.bottomRight = bottomRight ?? this.bottomRight;
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