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
exports.Camera = void 0;
var Geo_1 = require("./Geo");
var Vars_1 = require("./Vars");
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera(x, y, w, h, origin, zoom) {
        if (zoom === void 0) { zoom = 1; }
        var _this = _super.call(this, x, y, w, h, origin) || this;
        _this.zoom = zoom;
        _this.updateDims();
        return _this;
    }
    Camera.prototype.updateDims = function () {
        this.width = Vars_1["default"].canvasWidth / this.zoom;
        this.height = Vars_1["default"].canvasHeight / this.zoom;
    };
    return Camera;
}(Geo_1.Box));
exports.Camera = Camera;
//# sourceMappingURL=Camera.js.map