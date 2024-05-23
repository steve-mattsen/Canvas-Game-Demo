"use strict";
exports.__esModule = true;
var Vec2_1 = require("./Vec2");
var Vars = (function () {
    function Vars() {
    }
    Vars.inputState = {};
    Vars.debugMode = false;
    Vars.displayMode = 0;
    Vars.spriteSheetMode = false;
    Vars.slowMode = false;
    Vars.showButtons = true;
    Vars.showBackground = false;
    Vars.mouseMove = null;
    Vars.buttons = [
        {
            key: 'F1',
            varKey: 'displayMode',
            title: 'Display',
            dimensions: new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0))
        }, {
            key: 'F2',
            varKey: 'spriteSheetMode',
            title: 'Spritesheet',
            dimensions: new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0))
        }, {
            key: 'F3',
            varKey: 'slowMode',
            title: 'Slow',
            dimensions: new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0))
        }, {
            key: 'F4',
            varKey: 'showBackground',
            title: "Background",
            dimensions: new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0))
        }, {
            key: 'F5',
            varKey: 'showButtons',
            title: "Buttons",
            dimensions: new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0))
        }, {
            key: 'F9',
            varKey: 'debugMode',
            title: 'Debug',
            dimensions: new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0))
        }
    ];
    Vars.bgColors = [
        "#ffffff",
        "#666666",
        "#444444",
        "#222222",
        "#000000",
    ];
    Vars.fgColors = [
        "#000000",
        "#000000",
        "#ffffff",
        "#ffffff",
        "#ffffff",
    ];
    return Vars;
}());
exports["default"] = Vars;
//# sourceMappingURL=Vars.js.map