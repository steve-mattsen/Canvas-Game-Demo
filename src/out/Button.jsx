"use strict";
exports.__esModule = true;
var Draw_1 = require("./Draw");
var Geo_1 = require("./Geo");
var Vars_1 = require("./Vars");
var Button = (function () {
    function Button(key, varKey, title, click, dimensions) {
        if (click === void 0) { click = function () {
            var value = Reflect.get(Vars_1["default"], _this.varKey);
            Reflect.set(Vars_1["default"], _this.varKey, !value);
        }; }
        if (dimensions === void 0) { dimensions = new Geo_1.Box(0, 0, 0, 0); }
        var _this = this;
        this.key = key !== null && key !== void 0 ? key : this.key;
        this.title = title !== null && title !== void 0 ? title : this.title;
        this.varKey = varKey !== null && varKey !== void 0 ? varKey : this.varKey;
        this.click = click !== null && click !== void 0 ? click : this.click;
        this.dimensions = dimensions !== null && dimensions !== void 0 ? dimensions : this.dimensions;
        Button.store[this.key] = this;
    }
    Button.store = {};
    return Button;
}());
exports["default"] = Button;
new Button('F1', 'displayMode', 'Display', function () {
    Vars_1["default"].displayMode = (++Vars_1["default"].displayMode % 5);
});
new Button('F2', 'spriteSheetMode', 'Spritesheet');
new Button('F3', 'slowMode', 'Slow');
new Button('F4', 'showBackground', "Background");
new Button('F5', 'showButtons', "Buttons");
new Button('F6', 'fullscreenMode', 'Fullscreen', function () {
    if (!Vars_1["default"].fullscreenMode) {
        document.getElementsByTagName('html')[0].requestFullscreen({ 'navigationUI': 'hide' });
        (0, Draw_1.onWindowResize)();
        Vars_1["default"].fullscreenMode = true;
    }
    else {
        if (document.fullscreenElement !== null) {
            document.exitFullscreen();
            (0, Draw_1.onWindowResize)();
        }
        Vars_1["default"].fullscreenMode = false;
    }
});
new Button('F9', 'debugMode', 'Debug');
//# sourceMappingURL=Button.jsx.map