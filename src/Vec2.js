export class vec2 {
	constructor(x, y) {
		this.x = x ?? 0;
		this.y = y ?? 0;
	}
	add(vec) {
		return new vec2(this.x + vec.x, this.y + vec.y);
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	normalize() {
		let length = this.length();
		if (length == 0) {
			return new vec2(0, 0);
		}
		return new vec2(this.x / length, this.y / length);
	}
}