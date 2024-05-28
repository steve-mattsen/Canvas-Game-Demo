"use strict";
exports.__esModule = true;
var Geo_1 = require("./Geo");
var Obj_1 = require("./Obj");
var Vars_1 = require("./Vars");
var Draw_1 = require("./Draw");
var Button_1 = require("./Button");
require("./World");
var VirtualJoystick_1 = require("./VirtualJoystick");
Button_1["default"].store['F3'].click = function () {
    Vars_1["default"].slowMode = !Vars_1["default"].slowMode;
    clearTimeout(drawThread);
    clearTimeout(gameThread);
    var refresh = Vars_1["default"].slowMode ? 15 : 59.67;
    drawThread = setInterval(Draw_1["default"], 1000 / refresh);
    gameThread = setInterval(tick, 1000 / refresh);
};
new VirtualJoystick_1["default"]('left_stick');
function tick() {
    var plyr = Obj_1.Obj.store['player'];
    var gp = navigator.getGamepads()[0];
    Object.keys(Vars_1["default"].inputState).forEach(function (v) {
        if (Vars_1["default"].inputState[v] > 0) {
            Vars_1["default"].inputState[v] = Vars_1["default"].inputState[v] + 1;
        }
    });
    var walkSpeed = 1;
    var runSpeed = 2;
    var move;
    var speed = 0;
    if ((gp === null || gp === void 0 ? void 0 : gp.axes[0]) || (gp === null || gp === void 0 ? void 0 : gp.axes[1])) {
        move = (0, Geo_1.vec)(Number(gp === null || gp === void 0 ? void 0 : gp.axes[0]), Number(gp === null || gp === void 0 ? void 0 : gp.axes[1]));
        speed = move.length() * runSpeed;
    }
    else if (Vars_1["default"].mouseMove !== null) {
        var line = new Geo_1.Line(plyr.pos.x, plyr.pos.y, Vars_1["default"].mouseMove.x, Vars_1["default"].mouseMove.y);
        if (line.length() > runSpeed) {
            speed = runSpeed;
        }
        else {
            speed = line.length();
        }
        move = line.normal().p2();
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
    Vars_1["default"].move = move;
    if (Vars_1["default"].inputState[" "] === 2 && plyr.z === 0) {
        plyr.zVelocity = 3.5;
    }
    plyr.z += plyr.zVelocity;
    plyr.zVelocity -= 0.25;
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
        plyr.animations[plyr.animState].currentSprite = 0;
    }
    plyr.tickAnimFrame();
    var preMoveHitBox = plyr.calcHitBox();
    var postMoveHitBox = plyr.calcHitBox();
    postMoveHitBox.x += move.x * speed;
    postMoveHitBox.y += move.y * speed;
    for (var _i = 0, _a = Object.entries(Obj_1.Obj.store); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], obj = _b[1];
        if (key === 'player') {
            continue;
        }
        var ohb = obj.calcHitBox();
        if (postMoveHitBox.collidesWith(ohb)) {
            move = preMoveHitBox.adjustForCollision(ohb, move, speed);
            speed = 1;
        }
    }
    plyr.pos.x += move.x * speed;
    plyr.pos.y += move.y * speed;
    var hb = plyr.calcHitBox();
    var p2 = hb.p2();
    var cameraLimit = new Geo_1.Vec2((Vars_1["default"].canvasWidth / Vars_1["default"].cameraScale), (Vars_1["default"].canvasHeight / Vars_1["default"].cameraScale));
    if (hb.x < 0) {
        plyr.pos.x = plyr.hitBox.origin.x;
    }
    else if (p2.x > cameraLimit.x) {
        plyr.pos.x = cameraLimit.x - plyr.hitBox.origin.x;
    }
    if (hb.y < 0) {
        plyr.pos.y = plyr.hitBox.origin.y;
    }
    else if (p2.y > cameraLimit.y) {
        plyr.pos.y = cameraLimit.y;
    }
}
var refresh = Vars_1["default"].slowMode ? 15 : 59.67;
var drawThread = setInterval(Draw_1["default"], 1000 / refresh);
var gameThread = setInterval(tick, 1000 / refresh);
//# sourceMappingURL=Game.jsx.map