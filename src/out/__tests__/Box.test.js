"use strict";
exports.__esModule = true;
var Geo_1 = require("../Geo");
var boxOriginDataSet = [
    {
        data: { x: 0, y: 0, w: 1, h: 1, o: (0, Geo_1.vec)(0, 0) },
        results: [
            [0, 0],
            [0, 0],
        ]
    },
    {
        data: { x: 0, y: 0, w: 1, h: 1, o: (0, Geo_1.vec)(1, 1) },
        results: [
            [1, 1],
            [-1, -1],
        ]
    },
    {
        data: { x: 0, y: 0, w: 4, h: 4, o: { x: 'center', y: 'middle' } },
        results: [
            [2, 2],
            [-2, -2],
        ]
    },
    {
        data: { x: 2, y: 2, w: 4, h: 4, o: (0, Geo_1.vec)(0, 0) },
        results: [
            [0, 0],
            [2, 2],
        ]
    },
    {
        data: { x: 2, y: 2, w: 4, h: 4, o: { x: 'center', y: 'middle' } },
        results: [
            [4, 4],
            [0, 0],
        ]
    },
];
test.each(boxOriginDataSet)("boxes will have correct dimensions", function (dataSet) {
    var data = dataSet.data;
    var b = new Geo_1.Box(data.x, data.y, data.w, data.h);
    expect(b.x).toBe(data.x);
    expect(b.y).toBe(data.y);
    expect(b.width).toBe(data.w);
    expect(b.height).toBe(data.h);
});
test.each(boxOriginDataSet)('boxes translate origins correctly', function (dataSet) {
    var d = dataSet.data;
    var r = dataSet.results[1];
    var b = new Geo_1.Box(d.x, d.y, d.w, d.h, d.o).fromOrigin();
    expect(b.x).toBe(r[0]);
    expect(b.y).toBe(r[1]);
});
//# sourceMappingURL=Box.test.js.map