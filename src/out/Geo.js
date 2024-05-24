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
exports.vec = exports.box = exports.boxLocation = exports.vec3 = exports.vec2 = void 0;
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
var vec3 = (function (_super) {
    __extends(vec3, _super);
    function vec3(x, y, z) {
        var _this = _super.call(this, x, y) || this;
        _this.x = 0;
        _this.y = 0;
        _this.z = 0;
        _this.z = z;
        return _this;
    }
    return vec3;
}(vec2));
exports.vec3 = vec3;
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
var box = (function () {
    function box(x, y, width, height, origin) {
        this.topLeft = new vec2(0, 0);
        this.bottomRight = new vec2(0, 0);
        this.topLeft = vec(x, y);
        this.bottomRight = vec(x + width, y + height);
        if (origin === undefined) {
            origin = boxLocation.bottom_center;
        }
        if (origin instanceof vec2) {
            this.origin = origin;
        }
        var originPoint = vec(0, 0);
        switch (origin) {
            case boxLocation.top_left:
            case boxLocation.top_center:
            case boxLocation.top_right:
                originPoint.y = 0;
                break;
            case boxLocation.middle_left:
            case boxLocation.middle_center:
            case boxLocation.middle_right:
                originPoint.y = this.getHeight() / 2;
                break;
            case boxLocation.bottom_left:
            case boxLocation.bottom_left:
            case boxLocation.bottom_left:
                originPoint.y = this.getHeight();
                break;
        }
        switch (origin) {
            case boxLocation.top_left:
            case boxLocation.middle_left:
            case boxLocation.bottom_left:
                originPoint.x = 0;
                break;
            case boxLocation.top_center:
            case boxLocation.middle_center:
            case boxLocation.bottom_center:
                originPoint.x = this.getWidth() / 2;
                break;
            case boxLocation.top_right:
            case boxLocation.middle_right:
            case boxLocation.bottom_right:
                originPoint.x = this.getWidth();
                break;
        }
    }
    box.prototype.getCenter = function () {
        return new vec2((this.topLeft.x + this.bottomRight.x) / 2, (this.topLeft.y + this.bottomRight.y) / 2);
    };
    box.prototype.getWidth = function () {
        return this.bottomRight.x - this.topLeft.x;
    };
    box.prototype.getHeight = function () {
        return this.bottomRight.y - this.topLeft.y;
    };
    box.prototype.normalize = function () {
        var length = this.length();
        if (length === 0) {
            return new vec2(0, 0);
        }
        return new vec2((this.bottomRight.x - this.topLeft.x) / length, (this.bottomRight.y - this.topLeft.y) / length);
    };
    box.prototype.length = function () {
        var sumProduct = (Math.pow((this.bottomRight.x - this.topLeft.x), 2))
            + (Math.pow((this.bottomRight.y - this.topLeft.y), 2));
        if (sumProduct === 0) {
            return 0;
        }
        return Math.sqrt(sumProduct);
    };
    box.prototype.contains = function (point) {
        if (point.x < this.topLeft.x
            || point.x > this.bottomRight.x
            || point.y < this.topLeft.y
            || point.y > this.bottomRight.y) {
            return false;
        }
        return true;
    };
    return box;
}());
exports.box = box;
function vec(x, y, z) {
    if (z === void 0) { z = null; }
    if (z == null) {
        return new vec2(x, y);
    }
    return new vec3(x, y, z);
}
exports.vec = vec;
//# sourceMappingURL=Geo.js.map