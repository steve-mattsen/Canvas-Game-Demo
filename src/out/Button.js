"use strict";
exports.__esModule = true;
var Vec2_1 = require("./Vec2");
var Vars_1 = require("./Vars");
var Button = (function () {
    function Button(key, varKey, title, click, dimensions) {
        if (click === void 0) { click = function () {
            var value = Reflect.get(Vars_1["default"], _this.varKey);
            Reflect.set(Vars_1["default"], _this.varKey, !value);
        }; }
        if (dimensions === void 0) { dimensions = new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0)); }
        var _this = this;
        this.key = key !== null && key !== void 0 ? key : this.key;
        this.title = title !== null && title !== void 0 ? title : this.title;
        this.varKey = varKey !== null && varKey !== void 0 ? varKey : this.varKey;
        this.click = click !== null && click !== void 0 ? click : this.click;
        this.dimensions = dimensions !== null && dimensions !== void 0 ? dimensions : this.dimensions;
    }
    Button.store = [
        new Button('F1', 'displayMode', 'Display', function () {
            Vars_1["default"].displayMode = (++Vars_1["default"].displayMode % 5);
        }),
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