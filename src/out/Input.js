"use strict";
exports.__esModule = true;
exports.OnScreenControl = void 0;
var Button_1 = require("./Button");
var Game_1 = require("./Game");
var Geo_1 = require("./Geo");
var Vars_1 = require("./Vars");
var Input = (function () {
    function Input() {
    }
    Input.getOnscreenControl = function (id) {
        var result = Input.onscreenControls[id];
        switch (result.constructor.name) {
            case "VirtualJoystick":
                return result;
                break;
        }
        return result;
    };
    Input.moveCamera = function () {
        if (Vars_1["default"].inputState['i'] > 0) {
            Game_1["default"].camera.y -= 1;
        }
        else if (Vars_1["default"].inputState['k'] > 0) {
            Game_1["default"].camera.y += 1;
        }
        if (Vars_1["default"].inputState['j'] > 0) {
            Game_1["default"].camera.x -= 1;
        }
        else if (Vars_1["default"].inputState['l'] > 0) {
            Game_1["default"].camera.x += 1;
        }
    };
    Input.onscreenControls = {};
    return Input;
}());
exports["default"] = Input;
var OnScreenControl = (function () {
    function OnScreenControl(id, attachment, size) {
        if (size === void 0) { size = new Geo_1.Vec2(200, 200); }
        this.id = id;
        this.attachment = attachment;
        this.box = new Geo_1.Box(0, 0, size.x, size.y, attachment);
        this.size = size;
        this.attach();
        Input.onscreenControls[id] = this;
    }
    OnScreenControl.prototype.attach = function () {
        var attach = Game_1["default"].screen.getPoint(this.attachment.x, this.attachment.y);
        this.box = this.box.fromPoint(attach).fromOrigin();
    };
    return OnScreenControl;
}());
exports.OnScreenControl = OnScreenControl;
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
        Button_1["default"].store['F3'].click();
    }
    else if (Vars_1["default"].inputState.f4) {
        Vars_1["default"].showBackground = !Vars_1["default"].showBackground;
    }
    else if (Vars_1["default"].inputState.f5) {
        Vars_1["default"].showButtons = !Vars_1["default"].showButtons;
    }
    else if (Vars_1["default"].inputState.f6) {
        Button_1["default"].store['F6'].click();
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
    if (Vars_1["default"].inputState['left_stick'] > 0) {
        var stick = Input.getOnscreenControl('left_stick');
        stick.screenToValue(new Geo_1.Vec2(e.clientX, e.clientY));
    }
    else if (Vars_1["default"].mouseMove != null) {
        Vars_1["default"].mouseMove.x = e.clientX;
        Vars_1["default"].mouseMove.y = e.clientY;
    }
};
window.onmouseup = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    var stick = Input.getOnscreenControl('left_stick');
    stick.value = new Geo_1.Vec2(0, 0);
    clickOrTouchEnd();
    e.preventDefault();
};
window.ontouchstart = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    var point = (0, Geo_1.vec)(e.touches[0].clientX, e.touches[0].clientY);
    clickOrTouchStart(point);
};
window.ontouchmove = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    if (Vars_1["default"].inputState.left_stick > 0) {
        var stick = Input.getOnscreenControl('left_stick');
        stick.screenToValue(new Geo_1.Vec2(e.touches[0].clientX, e.touches[0].clientY));
    }
    else if (Vars_1["default"].mouseMove !== null) {
        Vars_1["default"].mouseMove = (0, Geo_1.vec)(e.touches[0].clientX, e.touches[0].clientY);
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
    var button = Button_1["default"].store.F6;
    if (button.dimensions.contains(point)) {
        button.click();
        return;
    }
    var stick = Input.getOnscreenControl('left_stick');
    if (stick.box.contains(point)) {
        Vars_1["default"].inputState['left_stick'] = 1;
        stick.screenToValue(point);
    }
    else {
        Vars_1["default"].inputState['mouseDown'] = 1;
        Vars_1["default"].mouseMove = point;
    }
}
function clickOrTouchEnd() {
    Vars_1["default"].inputState['mouseDown'] = 0;
    if (Vars_1["default"].inputState.left_stick > 0) {
        Vars_1["default"].inputState['left_stick'] = 0;
        var stick = Input.getOnscreenControl('left_stick');
        stick.value.x = 0;
        stick.value.y = 0;
    }
    Vars_1["default"].mouseMove = null;
}
//# sourceMappingURL=Input.js.map