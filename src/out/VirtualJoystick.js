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
var Geo_1 = require("./Geo");
var Input_1 = require("./Input");
var VirtualJoystick = (function (_super) {
    __extends(VirtualJoystick, _super);
    function VirtualJoystick(id) {
        var _this = _super.call(this, id) || this;
        _this.size = 200;
        _this.deadZone = 25;
        _this.box = new Geo_1.Box(0, window.innerHeight - _this.size, _this.size, _this.size);
        _this.value = new Geo_1.Vec2(0, 0);
        return _this;
    }
    VirtualJoystick.prototype.screenToValue = function (point) {
        var middle = this.box.getCenterMiddle();
        var line = new Geo_1.Line(middle.x, middle.y, point.x, point.y);
        var length = line.length();
        if (length < this.deadZone) {
            this.value.x = 0;
            this.value.y = 0;
            return;
        }
        this.value = line.normal();
        if (line.length() < (this.size / 2)) {
            var factor = (line.length() - this.deadZone) / ((this.size / 2) - this.deadZone);
            console.log(factor);
            this.value.x *= factor;
            this.value.y *= factor;
        }
    };
    return VirtualJoystick;
}(Input_1.OnScreenControl));
exports["default"] = VirtualJoystick;
//# sourceMappingURL=VirtualJoystick.js.map