"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.vec = exports.Line = exports.Box = exports.Vec3 = exports.Vec2 = void 0;
var Vec2 = (function () {
    function Vec2(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.add = function (v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    };
    Vec2.prototype.length = function () {
        var sumProduct = this.x * this.x + this.y * this.y;
        if (sumProduct === 0) {
            return 0;
        }
        return Math.sqrt(sumProduct);
    };
    Vec2.prototype.normalize = function () {
        var length = this.length();
        if (length === 0) {
            return new Vec2(0, 0);
        }
        return new Vec2(this.x / length, this.y / length);
    };
    Vec2.prototype.scale = function (scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    };
    return Vec2;
}());
exports.Vec2 = Vec2;
var Vec3 = (function (_super) {
    __extends(Vec3, _super);
    function Vec3(x, y, z) {
        var _this = _super.call(this, x, y) || this;
        _this.x = 0;
        _this.y = 0;
        _this.z = 0;
        _this.z = z;
        return _this;
    }
    return Vec3;
}(Vec2));
exports.Vec3 = Vec3;
var Box = (function () {
    function Box(x, y, width, height, origin) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        if (origin instanceof Vec2) {
            this.origin = origin;
        }
        else if (origin === undefined || origin === null) {
            this.origin = this.getPoint('left', 'top');
        }
        else {
            this.origin = this.getPoint(origin[0], origin[1]);
        }
    }
    Box.prototype.getPoint = function (horiz, vert) {
        var x, y;
        if (typeof horiz == 'number') {
            x = horiz;
        }
        else {
            switch (horiz) {
                case 'left':
                    x = 0;
                    break;
                case 'center':
                    x = Math.floor(this.width / 2);
                    break;
                case 'right':
                    x = this.width;
                    break;
            }
        }
        if (typeof vert === 'number') {
            y = vert;
        }
        else {
            switch (vert) {
                case 'top':
                    y = 0;
                    break;
                case 'middle':
                    y = Math.floor(this.height / 2);
                    break;
                case 'bottom':
                    y = this.height;
                    break;
            }
        }
        return new Vec2(x, y);
    };
    Box.prototype.p1 = function () {
        return new Vec2(this.x, this.y);
    };
    Box.prototype.p2 = function () {
        return new Vec2(this.x + this.width, this.y + this.height);
    };
    Box.prototype.getCenterMiddle = function () {
        return this.getPoint('center', 'middle');
    };
    Box.prototype.fromPoint = function (point) {
        return new Box(point.x + this.x, point.y + this.y, this.width, this.height, this.origin);
    };
    Box.prototype.fromOrigin = function () {
        return new Box(this.x - this.origin.x, this.y - this.origin.y, this.width, this.height, new Vec2(0, 0));
    };
    Box.prototype.contains = function (point) {
        if (point.x < this.x
            || point.x > this.width
            || point.y < this.y
            || point.y > this.height) {
            return false;
        }
        return true;
    };
    return Box;
}());
exports.Box = Box;
var Line = (function () {
    function Line(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    Line.prototype.length = function () {
        var sumProduct = (Math.pow((this.x2 - this.x1), 2))
            + (Math.pow((this.y2 - this.y1), 2));
        if (sumProduct === 0) {
            return 0;
        }
        return Math.sqrt(sumProduct);
    };
    Line.prototype.normal = function () {
        var length = this.length();
        if (length === 0) {
            return new Line(this.x1, this.y1, this.x2, this.y2);
        }
        return new Line(0, 0, (this.x2 / length) - this.x1, (this.y2 / length) - this.y1);
    };
    Line.prototype.p1 = function () {
        return new Vec2(this.x1, this.y1);
    };
    Line.prototype.p2 = function () {
        return new Vec2(this.x2, this.y2);
    };
    return Line;
}());
exports.Line = Line;
function vec(x, y, z) {
    if (z === void 0) { z = null; }
    if (z == null) {
        return new Vec2(x, y);
    }
    return new Vec3(x, y, z);
}
exports.vec = vec;
//# sourceMappingURL=Geo.js.map