import { Box, vec, Vec2 } from "./Geo";
import { expect, jest, test, it } from '@jest/globals';

let vec2DataSet = [
	[0, 0],
	[0, 1],
	[1, 0],
	[-1, 0],
	[-1, Number.MAX_SAFE_INTEGER],
	[Number.MAX_SAFE_INTEGER, -1],
	[0, 1],
];

let lengthDataSet = [
	[0, 0, 0],
	[0, 1, 1],
	[0, 5, 5],
	[0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	[Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 12738103345051544],
	[-1 * Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 12738103345051544],
];

test.each(vec2DataSet)('a vector will have correct dimensions: (%p, %p)', (x: number, y: number) => {
	let v = new Vec2(x, y);
	expect(v.x).toBe(x);
	expect(v.y).toBe(y);
});
test.each(vec2DataSet)('vec() returns Vec2: (%p, %p)', (x, y) => {
	let v = vec(x, y);
	expect(v).toBeInstanceOf(Vec2);
});

test.each(lengthDataSet)('vector lengths are calculated properly: (%p, %p)', (x, y, r) => {
	let v = vec(x, y);
	expect(v.length()).toBe(r);
});
test.each(vec2DataSet)('Vec2.normalize() will have correct length: (%p, %p)', (x, y) => {
	let v = vec(x, y);
	let normal = v.normalize();
	if (v.length() > 1) {
		expect(normal.length()).toBeCloseTo(1);
	} else {
		expect(normal.length()).toBe(v.length());
	}
});

let boxOriginDataSet = [
	[0, 0, 1, 1, 0, 0, 0, 0],
	[0, 0, 2, 2, 1, 1, 1, 1],
	// [0, 0, 2, 2, boxLocation.middle_center, 0, 1, 1],
]
test.each(boxOriginDataSet)(
	'boxes will have correct dimensions: (%p, %p, %p, %p',
	(x, y, width, height) => {
		let b = new Box(x, y, width, height);
		expect(b.x).toBe(x);
		expect(b.y).toBe(y);
		expect(b.width).toBe(width);
		expect(b.height).toBe(height);
	});
test.each(boxOriginDataSet)(
	'origins will be set correctly: (%p, %p, %p, %p, %p, %p)',
	(x, y, width, height, ox, oy, ex, ey) => {
		let b = new Box(x, y, width, height, vec(ox, oy));
		expect(b.origin.x).toBe(ox);
		expect(b.origin.y).toBe(oy);
	});
// test.each(boxOriginDataSet)(
// 	'boxes translate origins correctly: (%p, %p, %p, %p, %p, %p)',
// 	(x, y, width, height, ox, oy, ex, ey) => {
// 		let b = new Box(x, y, width, height, vec(ox, oy));
// 		let p1 = b.p1();
// 		let p2 = b.p2();
// 		expect(p1.x).toBe(ex);
// 		expect(p1.y).toBe(ey);
// 	});