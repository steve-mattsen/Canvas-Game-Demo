import { Line } from "../Geo";

let lineTestData = [
	[0, 0, 0, 0, 0],
	[0, 0, 1, 0, 1],
	[0, 0, 0, 1, 1],
	[0, 0, 1, 1, 1.4142135623730951],
	[0, 0, -1, -1, 1.4142135623730951],
	[1, 1, 0, 0, 1.4142135623730951],
	[-1, -1, 1, 1, 2.8284271247461903],
	[-4, 5, 9, 3, 13.152946437965905],
];

test.each(lineTestData)(
	'line will have correct dimensions (%p, %p) (%p, %p)',
	(x1, y1, x2, y2) => {
		let line = new Line(x1, y1, x2, y2);
		expect(line.x1).toBe(x1);
		expect(line.y1).toBe(y1);
		expect(line.x2).toBe(x2);
		expect(line.y2).toBe(y2);
	}
);

test.each(lineTestData)(
	'line will calculate length correctly (%p, %p) (%p, %p)',
	(x1, y1, x2, y2, e) => {
		let line = new Line(x1, y1, x2, y2);
		expect(line.length()).toBeCloseTo(e);
	}
)

test.each(lineTestData)(
	'line will normalize properly (%p, %p) (%p, %p)',
	(x1, y1, x2, y2) => {
		let line = new Line(x1, y1, x2, y2);
		let normal = line.normal();
		if (line.length() < 1) {
			expect(normal.length()).toBeLessThan(1);
		} else {
			expect(normal.length()).toBeCloseTo(1);
		}
	}
)