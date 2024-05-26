"use strict";
exports.__esModule = true;
var Vars = (function () {
    function Vars() {
    }
    var _a;
    _a = Vars;
    Vars.inputState = {};
    Vars.debugMode = false;
    Vars.displayMode = 0;
    Vars.spriteSheetMode = false;
    Vars.slowMode = false;
    Vars.showButtons = false;
    Vars.showBackground = false;
    Vars.mouseMove = null;
    Vars.fullscreenMode = false;
    Vars.canvasScale = 2;
    Vars.baseScale = 2;
    Vars.canvasWidth = window.innerWidth / _a.canvasScale;
    Vars.canvasHeight = window.innerHeight / _a.canvasScale;
    Vars.bgColors = [
        "#ffffff",
        "#666666",
        "#444444",
        "#222222",
        "#000000",
        "#000000",
    ];
    Vars.fgColors = [
        "#000000",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
    ];
    return Vars;
}());
exports["default"] = Vars;
//# sourceMappingURL=Vars.js.map