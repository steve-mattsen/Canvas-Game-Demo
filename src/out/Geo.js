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
exports.vec = exports.Box = exports.boxLocation = exports.Vec3 = exports.Vec2 = void 0;
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
var boxLocation;
(function (boxLocation) {
    boxLocation[boxLocation["top_left"] = 0] = "top_left";
    boxLocation[boxLocation["top_center"] = 1] = "top_center";
    boxLocation[boxLocation["top_right"] = 2] = "top_right";
    boxLocation[boxLocation["middle_left"] = 3] = "middle_left";
    boxLocation[boxLocation["middle_center"] = 4] = "middle_center";
    boxLocation[boxLocation["middle_right"] = 5] = "middle_right";
    boxLocation[boxLocation["bottom_left"] = 6] = "bottom_left";
    boxLocation[boxLocation["bottom_center"] = 7] = "bottom_center";
    boxLocation[boxLocation["bottom_right"] = 8] = "bottom_right";
})(boxLocation = exports.boxLocation || (exports.boxLocation = {}));
var Box = (function () {
    function Box(x, y, width, height, origin) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        if (origin === undefined) {
            origin = boxLocation.bottom_center;
        }
        if (origin instanceof Vec2) {
            this.origin = origin;
        }
        var originPoint = this.getRelativePoint(origin);
    }
    Box.prototype.getRelativePoint = function (point) {
        var x, y;
        switch (point) {
            case boxLocation.top_left:
            case boxLocation.top_center:
            case boxLocation.top_right:
                y = 0;
                break;
            case boxLocation.middle_left:
            case boxLocation.middle_center:
            case boxLocation.middle_right:
                y = Math.floor(this.height / 2);
                break;
            case boxLocation.bottom_left:
            case boxLocation.bottom_center:
            case boxLocation.bottom_right:
                y = this.height;
                break;
        }
        switch (point) {
            case boxLocation.top_left:
            case boxLocation.middle_left:
            case boxLocation.bottom_left:
                x = 0;
                break;
            case boxLocation.top_center:
            case boxLocation.middle_center:
            case boxLocation.bottom_center:
                x = Math.floor(this.width / 2);
                break;
            case boxLocation.top_right:
            case boxLocation.middle_right:
            case boxLocation.bottom_right:
                x = this.width;
                break;
        }
        return vec(x, y);
    };
    Box.prototype.getPoint = function (point) {
        var relative = this.getRelativePoint(point);
        relative.x -= this.origin.x;
        relative.y -= this.origin.y;
        return relative;
    };
    Box.prototype.p1 = function () {
        return this.getPoint(boxLocation.top_left);
    };
    Box.prototype.p2 = function () {
        return this.getPoint(boxLocation.bottom_right);
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