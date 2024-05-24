"use strict";
exports.__esModule = true;
exports.vec = exports.bbox = exports.vec3 = exports.vec2 = void 0;
var vec2 = (function () {
    function vec2(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    vec2.prototype.add = function (vec) {
        return new vec2(this.x + vec.x, this.y + vec.y);
    };
    vec2.prototype.length = function () {
        var sumProduct = this.x * this.x + this.y * this.y;
        if (sumProduct === 0) {
            return 0;
        }
        return Math.sqrt(sumProduct);
    };
    vec2.prototype.normalize = function () {
        var length = this.length();
        if (length === 0) {
            return new vec2(0, 0);
        }
        return new vec2(this.x / length, this.y / length);
    };
    vec2.prototype.scale = function (scalar) {
        return new vec2(this.x * scalar, this.y * scalar);
    };
    return vec2;
}());
exports.vec2 = vec2;
var vec3 = (function () {
    function vec3(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return vec3;
}());
exports.vec3 = vec3;
var bbox = (function () {
    function bbox(topLeft, bottomRight) {
        this.topLeft = new vec2(0, 0);
        this.bottomRight = new vec2(0, 0);
        this.topLeft = topLeft !== null && topLeft !== void 0 ? topLeft : this.topLeft;
        this.bottomRight = bottomRight !== null && bottomRight !== void 0 ? bottomRight : this.bottomRight;
    }
    bbox.prototype.getCenter = function () {
        return new vec2((this.topLeft.x + this.bottomRight.x) / 2, (this.topLeft.y + this.bottomRight.y) / 2);
    };
    bbox.prototype.getWidth = function () {
        return this.bottomRight.x - this.topLeft.x;
    };
    bbox.prototype.getHeight = function () {
        return this.bottomRight.y - this.topLeft.y;
    };
    bbox.prototype.normalize = function () {
        var length = this.length();
        if (length === 0) {
            return new vec2(0, 0);
        }
        return new vec2((this.bottomRight.x - this.topLeft.x) / length, (this.bottomRight.y - this.topLeft.y) / length);
    };
    bbox.prototype.length = function () {
        var sumProduct = (Math.pow((this.bottomRight.x - this.topLeft.x), 2))
            + (Math.pow((this.bottomRight.y - this.topLeft.y), 2));
        if (sumProduct === 0) {
            return 0;
        }
        return Math.sqrt(sumProduct);
    };
    bbox.prototype.contains = function (point) {
        if (point.x < this.topLeft.x
            || point.x > this.bottomRight.x
            || point.y < this.topLeft.y
            || point.y > this.bottomRight.y) {
            return false;
        }
        return true;
    };
    return bbox;
}());
exports.bbox = bbox;
function vec(x, y, z) {
    if (z === void 0) { z = null; }
    if (z == null) {
        return new vec2(x, y);
    }
    return new vec3(x, y, z);
}
exports.vec = vec;
//# sourceMappingURL=Vec2.js.map