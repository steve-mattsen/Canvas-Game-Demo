export class vec2 {
	x = 0;
	y = 0;
	constructor(x: number, y: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
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
}