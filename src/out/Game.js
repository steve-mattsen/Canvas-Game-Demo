"use strict";
exports.__esModule = true;
var Vec2_1 = require("./Vec2");
var Obj_1 = require("./Obj");
var Sprites_1 = require("./Sprites");
var inputState = {};
window.onkeydown = function (e) { return inputState[e.key] = true; };
window.onkeyup = function (e) { return inputState[e.key] = false; };
var player = new Obj_1.Obj('player', Sprites_1.Img.store['spritesheet_link'], new Vec2_1.vec2(50, 50), new Vec2_1.vec2(10, 10));
Obj_1.Obj.addObj(player);
function tick() {
    var _a, _b;
    var move = new Vec2_1.vec2((inputState.ArrowRight ? 1 : 0) - (inputState.ArrowLeft ? 1 : 0), (inputState.ArrowDown ? 1 : 0) - (inputState.ArrowUp ? 1 : 0));
    var speed = inputState.Shift ? 8 : 2;
    move = move.normalize();
    var plyr = Obj_1.Obj.store['player'];
    plyr.pos.x += ((_a = move.x) !== null && _a !== void 0 ? _a : 0) * speed;
    plyr.pos.y += ((_b = move.y) !== null && _b !== void 0 ? _b : 0) * speed;
    plyr.pos = new Vec2_1.vec2(plyr.pos.x < 0 ? (window.innerWidth + plyr.pos.x) : plyr.pos.x %= window.innerWidth, plyr.pos.y < 0 ? (window.innerHeight + plyr.pos.y) : plyr.pos.y %= window.innerHeight);
}
function draw() {
    var canvas = document.getElementById("game_window");
    canvas.setAttribute('width', window.innerWidth + '');
    canvas.setAttribute('height', window.innerHeight + '');
    if (canvas.getContext == undefined) {
        return;
    }
    var ctx = canvas.getContext('2d');
    if (ctx === null) {
        return;
    }
    Object.keys(Obj_1.Obj.store).forEach(function (v) {
        var _a;
        var obj = Obj_1.Obj.store[v];
        ctx.drawImage(obj.image.element, obj.pos.x, obj.pos.y);
        (_a = document.getElementById("root")) === null || _a === void 0 ? void 0 : _a.append(obj.image.element);
        ctx.fillStyle = "black";
        ctx.strokeRect(Math.round(obj.pos.x), Math.round(obj.pos.y), Math.round(obj.size.x), Math.round(obj.size.y));
    });
}
function getCenter() {
    return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
}
var refresh = 120;
var drawThread = setInterval(draw, 1000 / refresh);
var gameThread = setInterval(tick, 1000 / refresh);
//# sourceMappingURL=Game.js.map