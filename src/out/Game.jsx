"use strict";
exports.__esModule = true;
var Geo_1 = require("./Geo");
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
function tick() {
    var plyr = Obj_1.Obj.store['player'];
    var gp = navigator.getGamepads()[0];
    Object.keys(Vars_1["default"].inputState).forEach(function (v) {
        if (Vars_1["default"].inputState[v] > 0) {
            Vars_1["default"].inputState[v] = Vars_1["default"].inputState[v] + 1;
        }
    });
    var walkSpeed = 1;
    var runSpeed = 3;
    var move;
    var speed = 0;
    if ((gp === null || gp === void 0 ? void 0 : gp.axes[0]) || (gp === null || gp === void 0 ? void 0 : gp.axes[1])) {
        move = (0, Geo_1.vec)(Number(gp === null || gp === void 0 ? void 0 : gp.axes[0]), Number(gp === null || gp === void 0 ? void 0 : gp.axes[1]));
        speed = move.length() * runSpeed;
    }
    else if (Vars_1["default"].mouseMove !== null) {
        var line = new Geo_1.bbox(plyr.pos, Vars_1["default"].mouseMove);
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
        move = (0, Geo_1.vec)(moveX, moveY);
        speed = runSpeed;
    }
    move = move.normalize();
    if (Vars_1["default"].inputState[" "] == 2 && plyr.z == 0) {
        plyr.zVelocity = 15;
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
    plyr.pos = (0, Geo_1.vec)(Math.max(0, Math.min(plyr.pos.x, Vars_1["default"].canvasWidth - plyr.size.x)), Math.max(0, Math.min(plyr.pos.y, Vars_1["default"].canvasHeight - plyr.size.y)));
}
var refresh = Vars_1["default"].slowMode ? 15 : 59.67;
var drawThread = setInterval(Draw_1["default"], 1000 / refresh);
var gameThread = setInterval(tick, 1000 / refresh);
//# sourceMappingURL=Game.jsx.map