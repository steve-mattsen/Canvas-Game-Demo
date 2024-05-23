"use strict";
exports.__esModule = true;
var Vec2_1 = require("./Vec2");
var Obj_1 = require("./Obj");
var Vars_1 = require("./Vars");
var Draw_1 = require("./Draw");
var Button_1 = require("./Button");
require("./World");
Button_1["default"].store['F3'].click = function () {
    Vars_1["default"].slowMode = !Vars_1["default"].slowMode;
    clearTimeout(drawThread);
    clearTimeout(gameThread);
    var refresh = Vars_1["default"].slowMode ? 15 : 59.67;
    drawThread = setInterval(Draw_1["default"], 1000 / refresh);
    gameThread = setInterval(tick, 1000 / refresh);
};
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
};
window.onmousedown = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    var point = new Vec2_1.vec2(e.clientX, e.clientY);
    clickOrTouchStart(point);
};
window.onmousemove = function (e) {
    if (Vars_1["default"].mouseMove === null) {
        return;
    }
    Vars_1["default"].mouseMove = new Vec2_1.vec2(e.clientX, e.clientY);
};
window.onmouseup = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    clickOrTouchEnd();
    e.preventDefault();
};
window.ontouchstart = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    var point = new Vec2_1.vec2(e.touches[0].clientX, e.touches[0].clientY);
    clickOrTouchStart(point);
};
window.ontouchmove = function (e) {
    Vars_1["default"].debugMode && console.log(e.type, e);
    if (Vars_1["default"].mouseMove === null) {
        return;
    }
    Vars_1["default"].mouseMove = new Vec2_1.vec2(e.touches[0].clientX, e.touches[0].clientY);
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
    for (var _i = 0, _a = Object.entries(Button_1["default"].store); _i < _a.length; _i++) {
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
function tick() {
    var plyr = Obj_1.Obj.store['player'];
    var gp = navigator.getGamepads()[0];
    Object.keys(Vars_1["default"].inputState).forEach(function (v) {
        if (Vars_1["default"].inputState[v] > 0) {
            Vars_1["default"].inputState[v] = Vars_1["default"].inputState[v] + 1;
        }
    });
    var walkSpeed = 4;
    var runSpeed = 8;
    var move;
    var speed = 0;
    if ((gp === null || gp === void 0 ? void 0 : gp.axes[0]) || (gp === null || gp === void 0 ? void 0 : gp.axes[1])) {
        move = new Vec2_1.vec2(Number(gp === null || gp === void 0 ? void 0 : gp.axes[0]), Number(gp === null || gp === void 0 ? void 0 : gp.axes[1]));
        speed = move.length() * runSpeed;
    }
    else if (Vars_1["default"].mouseMove !== null) {
        var line = new Vec2_1.bbox(plyr.pos, Vars_1["default"].mouseMove);
        if (line.length() > runSpeed) {
            speed = runSpeed;
        }
        else {
            speed = line.length();
        }
        move = line.normalize();
    }
    else {
        var moveX = (Vars_1["default"].inputState.arrowright || Vars_1["default"].inputState.d ? 1 : 0)
            - (Vars_1["default"].inputState.arrowleft || Vars_1["default"].inputState.a ? 1 : 0);
        var moveY = (Vars_1["default"].inputState.arrowdown || Vars_1["default"].inputState.s ? 1 : 0)
            - (Vars_1["default"].inputState.arrowup || Vars_1["default"].inputState.w ? 1 : 0);
        move = new Vec2_1.vec2(moveX, moveY);
        speed = runSpeed;
    }
    move = move.normalize();
    if (Vars_1["default"].inputState[" "] == 2 && plyr.z == 0) {
        plyr.zVelocity = 10;
    }
    plyr.z += plyr.zVelocity-- * 0.5;
    if (plyr.z < 0) {
        plyr.z = 0;
        plyr.zVelocity = 0;
    }
    var previousAnim = plyr.animState;
    if (move.length() === 0) {
        plyr.animState = plyr.animState.replace(/(.*)_/, 'idle_');
    }
    else if (speed > walkSpeed) {
        plyr.animState = plyr.animState.replace(/(.*)_/, 'run_');
    }
    else {
        plyr.animState = plyr.animState.replace(/(.*)_/, 'walk_');
    }
    if (move.x >= 0.5) {
        plyr.animState = plyr.animState.replace(/_.*/, "_right");
    }
    else if (move.x <= -0.5) {
        plyr.animState = plyr.animState.replace(/_.*/, "_left");
    }
    else if (move.y > 0) {
        plyr.animState = plyr.animState.replace(/_.*/, "_down");
    }
    else if (move.y < 0) {
        plyr.animState = plyr.animState.replace(/_.*/, "_up");
    }
    if (previousAnim !== plyr.animState) {
        plyr.animations[plyr.animState].currentFrame = 0;
    }
    plyr.tickAnimFrame();
    plyr.pos.x += move.x * speed;
    plyr.pos.y += move.y * speed;
    plyr.pos = new Vec2_1.vec2(Math.max(0, Math.min(plyr.pos.x, window.innerWidth - plyr.size.x)), Math.max(0, Math.min(plyr.pos.y, window.innerHeight - plyr.size.y)));
}
var refresh = Vars_1["default"].slowMode ? 15 : 59.67;
var drawThread = setInterval(Draw_1["default"], 1000 / refresh);
var gameThread = setInterval(tick, 1000 / refresh);
//# sourceMappingURL=Game.jsx.map