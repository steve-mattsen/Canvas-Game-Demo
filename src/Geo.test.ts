import { Box, vec, Vec2 } from "./Geo";
import { expect, jest, test, it } from '@jest/globals';

let dataSet = [
	[0, 1],
	[1, 0],
	[-1, 0],
	[-1, Number.MAX_VALUE],
	[Number.MAX_VALUE, -1],
	[0, 1],
];

let lengthDataSet = [
	[0, 1, 1],
	[0, 5, 5],
];

test.each(dataSet)('a vector will have correct dimensions: (%p, %p)', (d) => {
	let v = new Vec2(d[0], d[1]);
	expect(v.x).toBe(d[0]);
	expect(v.y).toBe(d[1]);
});
test.each(dataSet)('vec() returns Vec2: (%p, %p)', (d) => {
	let v = vec(d[0], d[1]);
	expect(v).toBeInstanceOf(Vec2);
});

// test.each(lengthDataSet)('dicks', (d) => {
// 	expect(d[0]).not.toBe(d[1]);
// })
// test.each(lengthDataSet)('vector lengths are calculated properly: (%p, %p)', (d) => {
// 	let v = vec(d[0], d[1]);
// 	expect(v.length()).toBe(d[2]);
// });
// test.each(dataSet)('vector normalize() will have length 1: (%p, %p)', (d) => {
// 	let v = vec(d[0], d[1])
// 	v = v.normalize();
// 	expect(v.length()).toBeCloseTo(1);
// });