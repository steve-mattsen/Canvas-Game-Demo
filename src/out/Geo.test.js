"use strict";
exports.__esModule = true;
var Geo_1 = require("./Geo");
var globals_1 = require("@jest/globals");
var vec2DataSet = [
    [0, 0],
    [0, 1],
    [1, 0],
    [-1, 0],
    [-1, Number.MAX_SAFE_INTEGER],
    [Number.MAX_SAFE_INTEGER, -1],
    [0, 1],
];
var lengthDataSet = [
    [0, 0, 0],
    [0, 1, 1],
    [0, 5, 5],
    [0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 12738103345051544],
    [-1 * Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 12738103345051544],
];
globals_1.test.each(vec2DataSet)('a vector will have correct dimensions: (%p, %p)', function (x, y) {
    var v = new Geo_1.Vec2(x, y);
    (0, globals_1.expect)(v.x).toBe(x);
    (0, globals_1.expect)(v.y).toBe(y);
});
globals_1.test.each(vec2DataSet)('vec() returns Vec2: (%p, %p)', function (x, y) {
    var v = (0, Geo_1.vec)(x, y);
    (0, globals_1.expect)(v).toBeInstanceOf(Geo_1.Vec2);
});
globals_1.test.each(lengthDataSet)('vector lengths are calculated properly: (%p, %p)', function (x, y, r) {
    var v = (0, Geo_1.vec)(x, y);
    (0, globals_1.expect)(v.length()).toBe(r);
});
globals_1.test.each(vec2DataSet)('Vec2.normalize() will have correct length: (%p, %p)', function (x, y) {
    var v = (0, Geo_1.vec)(x, y);
    var normal = v.normalize();
    if (v.length() > 1) {
        (0, globals_1.expect)(normal.length()).toBeCloseTo(1);
    }
    else {
        (0, globals_1.expect)(normal.length()).toBe(v.length());
    }
});
var boxOriginDataSet = [
    [0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 2, 2, 1, 1, 1, 1],
];
globals_1.test.each(boxOriginDataSet)('boxes will have correct dimensions: (%p, %p, %p, %p', function (x, y, width, height) {
    var b = new Geo_1.Box(x, y, width, height);
    (0, globals_1.expect)(b.x).toBe(x);
    (0, globals_1.expect)(b.y).toBe(y);
    (0, globals_1.expect)(b.width).toBe(width);
    (0, globals_1.expect)(b.height).toBe(height);
});
globals_1.test.each(boxOriginDataSet)('origins will be set correctly: (%p, %p, %p, %p, %p, %p)', function (x, y, width, height, ox, oy, ex, ey) {
    var b = new Geo_1.Box(x, y, width, height, (0, Geo_1.vec)(ox, oy));
    (0, globals_1.expect)(b.origin.x).toBe(ox);
    (0, globals_1.expect)(b.origin.y).toBe(oy);
});
//# sourceMappingURL=Geo.test.js.map