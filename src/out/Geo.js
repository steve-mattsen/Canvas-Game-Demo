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
exports.vec = exports.Box = exports.Vec3 = exports.Vec2 = void 0;
var Vec2 = (function () {
    function Vec2(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.add = function (vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
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
            this.origin = this.getRelPoint('left', 'top');
        }
    }
    Box.prototype.getRelPoint = function (horiz, vert) {
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
        return vec(x, y);
    };
    Box.prototype.getPoint = function (x, y) {
        var relative = this.getRelPoint(x, y);
        relative.x += this.x - this.origin.x;
        relative.y -= this.y - this.origin.y;
        return relative;
    };
    Box.prototype.p1 = function () {
        return this.getPoint('left', 'top');
    };
    Box.prototype.p2 = function () {
        return this.getPoint('right', 'bottom');
    };
    Box.prototype.fromOrigin = function () {
        return new Box(this.x - this.origin.x, this.y - this.origin.y, this.width, this.height, vec(0, 0));
    };
    Box.prototype.getCenter = function () {
        return new Vec2((this.x + this.width) / 2, (this.y + this.height) / 2);
    };
    Box.prototype.normalize = function () {
        var length = this.length();
        if (length === 0) {
            return new Vec2(0, 0);
        }
        return new Vec2((this.width - this.x) / length, (this.height - this.y) / length);
    };
    Box.prototype.length = function () {
        var sumProduct = (Math.pow((this.width - this.x), 2))
            + (Math.pow((this.height - this.y), 2));
        if (sumProduct === 0) {
            return 0;
        }
        return Math.sqrt(sumProduct);
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
function vec(x, y, z) {
    if (z === void 0) { z = null; }
    if (z == null) {
        return new Vec2(x, y);
    }
    return new Vec3(x, y, z);
}
exports.vec = vec;
//# sourceMappingURL=Geo.js.map