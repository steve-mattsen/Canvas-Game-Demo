"use strict";
exports.__esModule = true;
exports.Camera = void 0;
var Geo_1 = require("./Geo");
var Vars_1 = require("./Vars");
var Camera = (function () {
    function Camera(pos, zoom) {
        if (zoom === void 0) { zoom = 4; }
        this.box = new Geo_1.Box(0, 0, 0, 0, ['center', 'middle']);
        this.pos = pos;
        this.zoom = zoom;
        this.updateDims();
    }
    Camera.prototype.updateDims = function () {
        this.box.width = Vars_1["default"].canvasWidth / this.zoom;
        this.box.height = Vars_1["default"].canvasHeight / this.zoom;
    };
    return Camera;
}());
exports.Camera = Camera;
//# sourceMappingURL=Camera.js.map