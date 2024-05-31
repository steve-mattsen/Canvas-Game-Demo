"use strict";
exports.__esModule = true;
var Geo_1 = require("../Geo");
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
//# sourceMappingURL=Vec2.test.js.map