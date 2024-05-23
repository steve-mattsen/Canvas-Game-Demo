"use strict";
exports.__esModule = true;
var Vec2_1 = require("./Vec2");
var Button = (function () {
    function Button(key, varKey, title, dimensions) {
        if (dimensions === void 0) { dimensions = new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0)); }
        this.key = key !== null && key !== void 0 ? key : this.key;
        this.title = title !== null && title !== void 0 ? title : this.title;
        this.varKey = varKey !== null && varKey !== void 0 ? varKey : this.varKey;
        this.dimensions = dimensions !== null && dimensions !== void 0 ? dimensions : this.dimensions;
    }
    Button.store = [
        new Button('F1', 'displayMode', 'Display'),
        new Button('F2', 'spriteSheetMode', 'Spritesheet'),
        new Button('F3', 'slowMode', 'Slow'),
        new Button('F4', 'showBackground', "Background"),
        new Button('F5', 'showButtons', "Buttons"),
        new Button('F9', 'debugMode', 'Debug')
    ];
    return Button;
}());
exports["default"] = Button;
//# sourceMappingURL=Button.js.map