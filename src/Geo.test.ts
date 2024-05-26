import { Box, vec, Vec2 } from "./Geo";
import { expect, jest, test, it } from '@jest/globals';

let dataSet = [
	[0, 1],
	[1, 0],
	[-1, 0],
	[-1, Number.MAX_SAFE_INTEGER],
	[Number.MAX_SAFE_INTEGER, -1],
	[0, 1],
];

let lengthDataSet = [
	[0, 1, 1],
	[0, 5, 5],
];

test.each(dataSet)('a vector will have correct dimensions: (%p, %p)', (x, y) => {
	let v = new Vec2(x, y);
	expect(v.x).toBe(x);
	expect(v.y).toBe(y);
});
test.each(dataSet)('vec() returns Vec2: (%p, %p)', (x, y) => {
	let v = vec(x, y);
	expect(v).toBeInstanceOf(Vec2);
});

test.each(lengthDataSet)('vector lengths are calculated properly: (%p, %p)', (x, y, r) => {
	let v = vec(x, y);
	expect(v.length()).toBe(r);
});
test.each(dataSet)('vector normalize() will have length 1: (%p, %p)', (x, y) => {
	let v = vec(x, y);
	v = v.normalize();
	expect(v.length()).toBeCloseTo(1);
});