"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.tick = void 0;
var Geo_1 = require("./Geo");
var Obj_1 = require("./Obj");
var Vars_1 = require("./Vars");
var Draw_1 = require("./Draw");
require("./World");
var VirtualJoystick_1 = require("./VirtualJoystick");
var Input_1 = require("./Input");
new VirtualJoystick_1["default"]('left_stick');
function tick() {
    return __awaiter(this, void 0, void 0, function () {
        var plyr, gp, walkSpeed, runSpeed, move, speed, stick, line, moveX, moveY, previousAnim, preMoveHitBox, postMoveHitBox, _i, _a, _b, key, obj, ohb, hb, p2, cameraLimit;
        return __generator(this, function (_c) {
            plyr = Obj_1.Obj.store['player'];
            gp = navigator.getGamepads()[0];
            Object.keys(Vars_1["default"].inputState).forEach(function (v) {
                if (Vars_1["default"].inputState[v] > 0) {
                    Vars_1["default"].inputState[v] = Vars_1["default"].inputState[v] + 1;
                }
            });
            walkSpeed = 1;
            runSpeed = 2;
            speed = 0;
            stick = Input_1["default"].getOnscreenControl('left_stick');
            if ((gp === null || gp === void 0 ? void 0 : gp.axes[0]) || (gp === null || gp === void 0 ? void 0 : gp.axes[1])) {
                move = (0, Geo_1.vec)(Number(gp === null || gp === void 0 ? void 0 : gp.axes[0]), Number(gp === null || gp === void 0 ? void 0 : gp.axes[1]));
                speed = move.length() * runSpeed;
            }
            else if (Vars_1["default"].mouseMove !== null) {
                line = new Geo_1.Line(plyr.pos.x, plyr.pos.y, Vars_1["default"].mouseMove.x, Vars_1["default"].mouseMove.y);
                if (line.length() > runSpeed) {
                    speed = runSpeed;
                }
                else {
                    speed = line.length();
                }
                move = line.normal();
            }
            else if (stick.value.x !== 0 || stick.value.y !== 0) {
                move = stick.value;
                speed = runSpeed;
            }
            else {
                moveX = (Vars_1["default"].inputState.arrowright || Vars_1["default"].inputState.d ? 1 : 0)
                    - (Vars_1["default"].inputState.arrowleft || Vars_1["default"].inputState.a ? 1 : 0);
                moveY = (Vars_1["default"].inputState.arrowdown || Vars_1["default"].inputState.s ? 1 : 0)
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
            previousAnim = plyr.animState;
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
            preMoveHitBox = plyr.calcHitBox();
            postMoveHitBox = plyr.calcHitBox();
            postMoveHitBox.x += move.x * speed;
            postMoveHitBox.y += move.y * speed;
            for (_i = 0, _a = Object.entries(Obj_1.Obj.store); _i < _a.length; _i++) {
                _b = _a[_i], key = _b[0], obj = _b[1];
                if (key === 'player') {
                    continue;
                }
                if (obj.hitBox === null) {
                    continue;
                }
                ohb = obj.calcHitBox();
                if (postMoveHitBox.collidesWith(ohb)) {
                    move = preMoveHitBox.adjustForCollision(ohb, move, speed);
                    speed = 1;
                }
            }
            plyr.pos.x += move.x * speed;
            plyr.pos.y += move.y * speed;
            hb = plyr.calcHitBox();
            p2 = hb.p2();
            cameraLimit = new Geo_1.Vec2((Vars_1["default"].canvasWidth / Vars_1["default"].cameraScale), (Vars_1["default"].canvasHeight / Vars_1["default"].cameraScale));
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
            requestAnimationFrame(Draw_1["default"]);
            return [2];
        });
    });
}
exports.tick = tick;
(0, Draw_1.onWindowResize)();
tick();
//# sourceMappingURL=Game.jsx.map