"use strict";
exports.__esModule = true;
var Vec2_1 = require("./Vec2");
var Obj_1 = require("./Obj");
var Sprites_1 = require("./Sprites");
require("./World");
var inputState = {};
var debugMode = false;
var boxMode = 0;
var spriteSheetMode = false;
var slowMode = false;
var showButtons = true;
window.onkeydown = function (e) {
    var key = e.key.toLowerCase();
    if (['tab', 'f1', 'f2', 'f3', 'f4', 'f10'].indexOf(key) > -1) {
        e.preventDefault();
    }
    if (!inputState[key]) {
        inputState[key] = 1;
    }
    if (inputState.f1 === 1) {
        boxMode = (++boxMode % 3);
    }
    else if (inputState.f2 === 1) {
        spriteSheetMode = !spriteSheetMode;
    }
    else if (inputState.f3 === 1) {
        slowMode = !slowMode;
        clearTimeout(drawThread);
        clearTimeout(gameThread);
        var refresh_1 = slowMode ? 15 : 59.67;
        drawThread = setInterval(draw, 1000 / refresh_1);
        gameThread = setInterval(tick, 1000 / refresh_1);
    }
    else if (inputState.f4) {
        showButtons = !showButtons;
    }
    else if (inputState.f9 === 1) {
        debugMode = !debugMode;
    }
};
window.onkeyup = function (e) {
    inputState[e.key.toLowerCase()] = 0;
};
window.onblur = function (e) {
    inputState = {};
};
function tick() {
    var _a, _b;
    Object.keys(inputState).forEach(function (v) {
        if (inputState[v] > 0) {
            inputState[v] = inputState[v] + 1;
        }
    });
    var move = new Vec2_1.vec2((inputState.arrowright || inputState.d ? 1 : 0) - (inputState.arrowleft || inputState.a ? 1 : 0), (inputState.arrowdown || inputState.s ? 1 : 0) - (inputState.arrowup || inputState.w ? 1 : 0));
    var speed = inputState.shift ? 8 : 3;
    move = move.normalize();
    var plyr = Obj_1.Obj.store['player'];
    var previousAnim = plyr.animState;
    if (move.length() > 0) {
        plyr.animState = plyr.animState.replace(/(.*)_/, inputState.shift ? 'run_' : 'walk_');
    }
    else {
        plyr.animState = plyr.animState.replace(/(.*)_/, 'idle_');
    }
    if (move.x > 0) {
        plyr.animState = plyr.animState.replace(/_.*/, "_right");
    }
    else if (move.x < 0) {
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
    plyr.pos.x += ((_a = move.x) !== null && _a !== void 0 ? _a : 0) * speed;
    plyr.pos.y += ((_b = move.y) !== null && _b !== void 0 ? _b : 0) * speed;
    plyr.pos = new Vec2_1.vec2(Math.max(0, Math.min(plyr.pos.x, window.innerWidth - plyr.size.x)), Math.max(0, Math.min(plyr.pos.y, window.innerHeight - plyr.size.y)));
}
function draw() {
    var canvas = document.getElementById("game_window");
    canvas.setAttribute('width', window.innerWidth + '');
    canvas.setAttribute('height', window.innerHeight + '');
    if (canvas.getContext === undefined) {
        return;
    }
    var ctx = canvas.getContext('2d');
    if (ctx === null) {
        return;
    }
    var plyr = Obj_1.Obj.store['player'];
    if (spriteSheetMode) {
        var frame = plyr.getAnimFrame();
        ctx.fillStyle = "red";
        ctx.fillRect(frame.subImg.topLeft.x, frame.subImg.topLeft.y, frame.subImg.getWidth(), frame.subImg.getHeight());
        ctx.drawImage(Sprites_1.Img.store['spritesheet_link'].element, 0, 0);
    }
    ctx.fillStyle = "black";
    if (boxMode !== 1) {
        ctx.fillRect(Math.floor(plyr.pos.x), Math.floor(plyr.pos.y), Math.ceil(plyr.size.x), Math.ceil(plyr.size.y));
    }
    Object.keys(Obj_1.Obj.store).forEach(function (v) {
        var obj = Obj_1.Obj.store[v];
        var frame = obj.getAnimFrame();
        if (!(obj.id === 'player' && boxMode === 0)) {
            ctx.drawImage(frame.image.element, frame.subImg.topLeft.x, frame.subImg.topLeft.y, frame.subImg.getWidth(), frame.subImg.getHeight(), Math.floor(obj.pos.x), Math.floor(obj.pos.y), frame.subImg.getWidth(), frame.subImg.getHeight());
        }
        if (!debugMode) {
            return;
        }
        ctx.save();
        ctx.font = "18px Courier";
        ctx.fillText(Math.round(obj.pos.x) + ", " + Math.round(obj.pos.y), obj.pos.x, obj.pos.y - 2);
        ctx.fillText(obj.animState + " " + obj.animations[obj.animState].currentFrame.toString(), obj.pos.x, obj.pos.y + obj.size.y + 18);
        ctx.fillText("window ".concat(window.innerHeight, "x").concat(window.innerWidth), 0, 18);
        var count = 0;
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        Object.keys(inputState).forEach(function (v) {
            if (!inputState[v]) {
                return;
            }
            ctx.fillText("".concat(v, " : ").concat(inputState[v]), window.innerWidth, count++ * 18);
        });
        ctx.restore();
    });
    if (showButtons) {
        drawButtons(ctx);
    }
}
function drawButtons(ctx) {
    var modes = [
        {
            key: 'F1',
            "var": boxMode,
            title: 'Player'
        }, {
            key: 'F2',
            "var": spriteSheetMode,
            title: 'Spritesheet'
        }, {
            key: 'F3',
            "var": slowMode,
            title: 'Slow'
        }, {
            key: 'F4',
            "var": showButtons,
            title: "Buttons"
        }, {
            key: 'F9',
            "var": debugMode,
            title: 'Debug'
        }
    ];
    modes.reverse();
    modes.forEach(function (v, i) {
        var buttonWidth = Math.max(70, Math.ceil(window.innerWidth * 0.2));
        var buttonHeight = Math.ceil(buttonWidth * .15);
        var margin = Math.ceil(buttonHeight * .2);
        var buttonX = window.innerWidth - buttonWidth - margin;
        var buttonY = window.innerHeight - (buttonHeight + margin) * (i + 1);
        var colors = [
            "#000000",
            "#ffffff",
            "#888888",
        ];
        ctx.fillStyle = colors[v["var"] ? (v["var"] === 2 ? 2 : 0) : 1] + "88";
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        ctx.fillStyle = colors[v["var"] ? (v["var"] === 2 ? 0 : 1) : 0];
        ctx.textAlign = "left";
        ctx.font = "".concat(Math.ceil(buttonHeight * .75), "px Courier");
        ctx.fillText("".concat(v.key, " ").concat(v.title), buttonX + margin, buttonY + Math.ceil(buttonHeight / 2) + margin, buttonWidth - margin * 2);
    });
}
var refresh = slowMode ? 15 : 59.67;
var drawThread = setInterval(draw, 1000 / refresh);
var gameThread = setInterval(tick, 1000 / refresh);
//# sourceMappingURL=Game.js.map