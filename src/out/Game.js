"use strict";
exports.__esModule = true;
var Vec2_1 = require("./Vec2");
var Obj_1 = require("./Obj");
var Sprites_1 = require("./Sprites");
var inputState = {};
window.onkeydown = function (e) { return inputState[e.key] = true; };
window.onkeyup = function (e) { return inputState[e.key] = false; };
var spritesheet_link = new Sprites_1.Img('spritesheet_link', "/spritesheet_link.png");
Sprites_1.Img.addImg(spritesheet_link);
var xSize = 102.4;
var ySize = 110.875;
var frameTime = 4;
var anims = {
    'idle': new Sprites_1.Animation([
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 0, 0), new Vec2_1.vec2(xSize * 1, ySize)), frameTime * 32),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 1, 0), new Vec2_1.vec2(xSize * 2, ySize)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 2, 0), new Vec2_1.vec2(xSize * 3, ySize)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 1, 0), new Vec2_1.vec2(xSize * 2, ySize)), frameTime),
    ]),
    'walk': new Sprites_1.Animation([
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 0, ySize * 7), new Vec2_1.vec2(xSize * 1, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 1, ySize * 7), new Vec2_1.vec2(xSize * 2, ySize * 8)), frameTime * 1.75),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 3, ySize * 7), new Vec2_1.vec2(xSize * 4, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 4, ySize * 7), new Vec2_1.vec2(xSize * 5, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 5, ySize * 7), new Vec2_1.vec2(xSize * 6, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 6, ySize * 7), new Vec2_1.vec2(xSize * 7, ySize * 8)), frameTime * 1.75),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 8, ySize * 7), new Vec2_1.vec2(xSize * 9, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 9, ySize * 7), new Vec2_1.vec2(xSize * 10, ySize * 8)), frameTime),
    ]),
    'run': new Sprites_1.Animation([
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 0, ySize * 7), new Vec2_1.vec2(xSize * 1, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 1, ySize * 7), new Vec2_1.vec2(xSize * 2, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 2, ySize * 7), new Vec2_1.vec2(xSize * 3, ySize * 8)), frameTime * 1.75),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 3, ySize * 7), new Vec2_1.vec2(xSize * 4, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 4, ySize * 7), new Vec2_1.vec2(xSize * 5, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 5, ySize * 7), new Vec2_1.vec2(xSize * 6, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 6, ySize * 7), new Vec2_1.vec2(xSize * 7, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 7, ySize * 7), new Vec2_1.vec2(xSize * 8, ySize * 8)), frameTime * 1.75),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 8, ySize * 7), new Vec2_1.vec2(xSize * 9, ySize * 8)), frameTime),
        new Sprites_1.Frame(spritesheet_link, new Vec2_1.bbox(new Vec2_1.vec2(xSize * 9, ySize * 7), new Vec2_1.vec2(xSize * 10, ySize * 8)), frameTime),
    ])
};
var player = new Obj_1.Obj('player', Sprites_1.Img.store['spritesheet_link'], new Vec2_1.vec2(xSize, ySize), new Vec2_1.vec2(10, 10), anims);
Obj_1.Obj.addObj(player);
function tick() {
    var _a, _b;
    var move = new Vec2_1.vec2((inputState.ArrowRight ? 1 : 0) - (inputState.ArrowLeft ? 1 : 0), (inputState.ArrowDown ? 1 : 0) - (inputState.ArrowUp ? 1 : 0));
    var speed = inputState.Shift ? 8 : 2;
    move = move.normalize();
    var plyr = Obj_1.Obj.store['player'];
    plyr.animState = move.length() > 0 ? (inputState.Shift ? 'run' : 'walk') : 'idle';
    plyr.tickAnimFrame();
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
        var obj = Obj_1.Obj.store[v];
        var frame = obj.getAnimFrame();
        ctx.drawImage(frame.image.element, frame.subImg.topLeft.x, frame.subImg.topLeft.y, frame.subImg.getWidth(), frame.subImg.getHeight(), obj.pos.x, obj.pos.y, frame.subImg.getWidth(), frame.subImg.getHeight());
        ctx.fillStyle = "black";
        ctx.strokeRect(Math.round(obj.pos.x), Math.round(obj.pos.y), Math.round(obj.size.x), Math.round(obj.size.y));
        ctx.fillText(obj.animations[obj.animState].currentFrame.toString(), obj.pos.x, obj.pos.y);
    });
}
function getCenter() {
    return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
}
var refresh = 60;
var drawThread = setInterval(draw, 1000 / refresh);
var gameThread = setInterval(tick, 1000 / refresh);
//# sourceMappingURL=Game.js.map