"use strict";
exports.__esModule = true;
var Geo_1 = require("./Geo");
var Vars = (function () {
    function Vars() {
    }
    var _a;
    _a = Vars;
    Vars.inputState = {};
    Vars.debugMode = false;
    Vars.displayMode = 4;
    Vars.spriteSheetMode = false;
    Vars.slowMode = false;
    Vars.showButtons = false;
    Vars.showBackground = true;
    Vars.mouseMove = null;
    Vars.fullscreenMode = false;
    Vars.canvasScale = 1;
    Vars.canvasWidth = window.innerWidth / _a.canvasScale;
    Vars.canvasHeight = window.innerHeight / _a.canvasScale;
    Vars.move = new Geo_1.Vec2(0, 0);
    Vars.oneScreenMode = false;
    return Vars;
}());
exports["default"] = Vars;
//# sourceMappingURL=Vars.js.map