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
        if (dimensions === void 0) { dimensions = new Vec2_1.bbox((0, Vec2_1.vec)(0, 0), (0, Vec2_1.vec)(0, 0)); }
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
        Vars_1["default"].fullscreenMode = true;
    }
    else {
        if (document.fullscreenElement !== null) {
            document.exitFullscreen();
        }
        Vars_1["default"].fullscreenMode = false;
    }
});
new Button('F9', 'debugMode', 'Debug');
window.onkeydown = function (e) {
    Vars_1["default"].debugMode && console.log(e);
    var key = e.key.toLowerCase();
    if (['tab', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10'].indexOf(key) > -1) {
        e.preventDefault();
    }
    if (!Vars_1["default"].inputState[key]) {
        Vars_1["default"].inputState[key] = 1;
    }
    if (Vars_1["default"].inputState.f1 === 1) {
        Vars_1["default"].displayMode = (++Vars_1["default"].displayMode % 5);
    }
    else if (Vars_1["default"].inputState.f2 === 1) {
        Vars_1["default"].spriteSheetMode = !Vars_1["default"].spriteSheetMode;
    }
    else if (Vars_1["default"].inputState.f3 === 1) {
        Button.store['F3'].click();
    }
    else if (Vars_1["default"].inputState.f4) {
        Vars_1["default"].showBackground = !Vars_1["default"].showBackground;
    }
    else if (Vars_1["default"].inputState.f5) {
        Vars_1["default"].showButtons = !Vars_1["default"].showButtons;
    }
    else if (Vars_1["default"].inputState.f6) {
        Button.store['F6'].click();
    }
    else if (Vars_1["default"].inputState.f9 === 1) {
        Vars_1["default"].debugMode = !Vars_1["default"].debugMode;
    }
};
window.onmousedown = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    var point = (0, Vec2_1.vec)(e.clientX, e.clientY);
    clickOrTouchStart(point);
};
window.onmousemove = function (e) {
    if (Vars_1["default"].mouseMove === null) {
        return;
    }
    Vars_1["default"].mouseMove = (0, Vec2_1.vec)(e.clientX, e.clientY);
};
window.onmouseup = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    clickOrTouchEnd();
    e.preventDefault();
};
window.ontouchstart = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    var point = (0, Vec2_1.vec)(e.touches[0].clientX, e.touches[0].clientY);
    clickOrTouchStart(point);
};
window.ontouchmove = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    if (Vars_1["default"].mouseMove === null) {
        return;
    }
    Vars_1["default"].mouseMove = (0, Vec2_1.vec)(e.touches[0].clientX, e.touches[0].clientY);
};
window.ontouchend = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    clickOrTouchEnd();
    e.preventDefault();
};
window.onkeyup = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    Vars_1["default"].inputState[e.key.toLowerCase()] = 0;
    e.preventDefault();
};
window.onblur = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    Vars_1["default"].inputState = {};
};
function clickOrTouchStart(point) {
    if (Vars_1["default"].inputState['mouseDown'] > 0) {
        return;
    }
    Vars_1["default"].inputState['mouseDown'] = 1;
    for (var _i = 0, _a = Object.entries(Button.store); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], button = _b[1];
        if (!Vars_1["default"].showButtons && button.varKey != "showButtons") {
            continue;
        }
        if (button.dimensions.contains(point)) {
            button.click();
            return;
        }
    }
    Vars_1["default"].mouseMove = point;
}
function clickOrTouchEnd() {
    Vars_1["default"].inputState['mouseDown'] = 0;
    Vars_1["default"].mouseMove = null;
}
//# sourceMappingURL=Button.jsx.map