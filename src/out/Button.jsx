"use strict";
exports.__esModule = true;
var Geo_1 = require("./Geo");
var Input_1 = require("./Input");
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
    else if (Vars_1["default"].inputState['+'] > 0) {
        Vars_1["default"].canvasScale += 0.1;
    }
    else if (Vars_1["default"].inputState['-'] > 0) {
        Vars_1["default"].canvasScale -= 0.1;
    }
};
window.onmousedown = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    var point = (0, Geo_1.vec)(e.clientX / Vars_1["default"].canvasScale, e.clientY / Vars_1["default"].canvasScale);
    clickOrTouchStart(point);
};
window.onmousemove = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    if (Vars_1["default"].mouseMove === null) {
        return;
    }
    if (Vars_1["default"].inputState['left_stick'] > 0) {
        var stick = Input_1["default"].getOnscreenControl('left_stick');
        Vars_1["default"].mouseMove = stick.screenToMouseMove(new Geo_1.Vec2(e.clientX, e.clientY));
    }
    else {
        Vars_1["default"].mouseMove = (0, Geo_1.vec)(e.clientX / Vars_1["default"].cameraScale, e.clientY / Vars_1["default"].cameraScale);
    }
};
window.onmouseup = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    clickOrTouchEnd();
    e.preventDefault();
};
window.ontouchstart = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    var point = (0, Geo_1.vec)(e.touches[0].clientX / Vars_1["default"].canvasScale, e.touches[0].clientY / Vars_1["default"].canvasScale);
    clickOrTouchStart(point);
};
window.ontouchmove = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    if (Vars_1["default"].mouseMove === null) {
        return;
    }
    if (Vars_1["default"].inputState['left_stick'] > 0) {
        var stick = Input_1["default"].getOnscreenControl('left_stick');
        Vars_1["default"].mouseMove = stick.screenToMouseMove(new Geo_1.Vec2(e.touches[0].clientX, e.touches[0].clientY));
    }
    else {
        Vars_1["default"].mouseMove = (0, Geo_1.vec)(e.touches[0].clientX / Vars_1["default"].cameraScale, e.touches[0].clientY / Vars_1["default"].cameraScale);
    }
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
    var button = Button.store.F6;
    if (button.dimensions.contains(point)) {
        button.click();
        return;
    }
    var stick = Input_1["default"].getOnscreenControl('left_stick');
    if (stick.box.contains(point)) {
        Vars_1["default"].inputState['left_stick'] = 1;
        Vars_1["default"].mouseMove = stick.screenToMouseMove(point);
    }
    else {
        point.x /= Vars_1["default"].cameraScale;
        point.y /= Vars_1["default"].cameraScale;
        Vars_1["default"].mouseMove = point;
    }
}
function clickOrTouchEnd() {
    Vars_1["default"].inputState['mouseDown'] = 0;
    Vars_1["default"].inputState['left_stick'] = 0;
    Vars_1["default"].mouseMove = null;
}
//# sourceMappingURL=Button.jsx.map