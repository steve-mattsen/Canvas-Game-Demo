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
var Vars_1 = require("./Vars");
var VirtualJoystick = (function (_super) {
    __extends(VirtualJoystick, _super);
    function VirtualJoystick(id) {
        var _this = _super.call(this, id) || this;
        _this.size = 200;
        _this.box = new Geo_1.Box(0, window.innerHeight - _this.size, _this.size, _this.size);
        _this.value = new Geo_1.Vec2(0, 0);
        return _this;
    }
    VirtualJoystick.prototype.screenToMouseMove = function (point) {
        var middle = this.box.getCenterMiddle();
        var relativeMove = new Geo_1.Line(middle.x, middle.y, point.x, point.y).normal();
        return new Geo_1.Vec2(Vars_1["default"].cameraWidth * relativeMove.x, Vars_1["default"].cameraHeight * relativeMove.y);
    };
    return VirtualJoystick;
}(Input_1.OnScreenControl));
exports["default"] = VirtualJoystick;
//# sourceMappingURL=VirtualJoystick.js.map