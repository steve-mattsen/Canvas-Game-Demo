import { Box, TOrigin, Vec2, vec } from "../Geo";

let boxOriginDataSet: {
	data: { x: number; y: number; w: number; h: number; o: TOrigin; };
	results: number[][];
}[] = [
		{ data: { x: 0, y: 0, w: 1, h: 1, o: vec(0, 0) }, results: [[0, 0]] },
		{ data: { x: 0, y: 0, w: 1, h: 1, o: vec(1, 1) }, results: [[-1, -1]] },
		// { data: { x: 0, y: 0, w: 2, h: 2, o: ['] }, results: [[0, 0]] },
	]

test.each(boxOriginDataSet)(
	`boxes will have correct dimensions`,
	(dataSet) => {
		let data = dataSet.data;
		let b = new Box(data.x, data.y, data.w, data.h);
		expect(b.x).toBe(data.x);
		expect(b.y).toBe(data.y);
		expect(b.width).toBe(data.w);
		expect(b.height).toBe(data.h);
	});

test.each(boxOriginDataSet)(
	'box origins will be set correctly',
	(dataSet) => {
		let data = dataSet.data;
		let b = new Box(data.x, data.y, data.w, data.h, data.o);
		expect(b.origin.x).toBe(data.o.x);
		expect(b.origin.y).toBe(data.o.y);
	});

test.each(boxOriginDataSet)(
	'boxes translate origins correctly',
	(dataSet) => {
		let d = dataSet.data;
		let r = dataSet.results[0];
		let b = new Box(d.x, d.y, d.w, d.h, d.o).fromOrigin();
		expect(b.x).toBe(r[0]);
		expect(b.y).toBe(r[0]);
	});
