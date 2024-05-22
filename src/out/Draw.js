"use strict";
exports.__esModule = true;
var Sprites_1 = require("./Sprites");
var Obj_1 = require("./Obj");
var Vars_1 = require("./Vars");
function draw(boxMode, spriteSheetMode, showBackground) {
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
    if (showBackground) {
        drawBackground(ctx);
    }
    var plyr = Obj_1.Obj.store['player'];
    if (spriteSheetMode) {
        var frame = plyr.getAnimFrame();
        ctx.fillStyle = "red";
        ctx.fillRect(frame.subImg.topLeft.x, frame.subImg.topLeft.y, frame.subImg.getWidth(), frame.subImg.getHeight());
        ctx.drawImage(Sprites_1.Img.store['spritesheet_link'].element, 0, 0);
    }
    drawObjects(ctx);
    if (Vars_1["default"].showButtons) {
        drawButtons(ctx);
    }
}
exports["default"] = draw;
function drawObjects(ctx) {
    Object.keys(Obj_1.Obj.store).forEach(function (v) {
        var obj = Obj_1.Obj.store[v];
        if (Vars_1["default"].boxMode < 3) {
            ctx.fillStyle = 'black';
            var pointSize = 6;
            ctx.fillRect(Math.floor(obj.pos.x), Math.floor(obj.pos.y), pointSize, pointSize);
            ctx.fillRect(Math.floor(obj.pos.x + obj.size.x - pointSize), Math.floor(obj.pos.y + obj.size.y - pointSize), pointSize, pointSize);
        }
        if (Vars_1["default"].boxMode === 1 || Vars_1["default"].boxMode === 2) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            var offset = ctx.lineWidth / 2;
            ctx.strokeRect(Math.floor(obj.pos.x + offset), Math.floor(obj.pos.y) + offset, Math.floor(obj.size.x - offset), Math.floor(obj.size.y - offset));
        }
        if (Vars_1["default"].boxMode > 1) {
            var frame = obj.getAnimFrame();
            if (Vars_1["default"].boxMode < 4) {
                frame = obj.animations[Object.keys(obj.animations)[0]].frames[0];
            }
            ctx.drawImage(frame.image.element, frame.subImg.topLeft.x, frame.subImg.topLeft.y, frame.subImg.getWidth(), frame.subImg.getHeight(), Math.floor(obj.pos.x), Math.floor(obj.pos.y), frame.subImg.getWidth(), frame.subImg.getHeight());
        }
        if (!Vars_1["default"].debugMode) {
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
        Object.keys(Vars_1["default"].inputState).forEach(function (v) {
            if (!Vars_1["default"].inputState[v]) {
                return;
            }
            ctx.fillText("".concat(v, " : ").concat(Vars_1["default"].inputState[v]), window.innerWidth, count++ * 18);
        });
        ctx.restore();
    });
}
function drawButtons(ctx) {
    var modes = [
        {
            key: 'F1',
            "var": Vars_1["default"].boxMode,
            title: 'Player'
        }, {
            key: 'F2',
            "var": Vars_1["default"].spriteSheetMode,
            title: 'Spritesheet'
        }, {
            key: 'F3',
            "var": Vars_1["default"].slowMode,
            title: 'Slow'
        }, {
            key: 'F4',
            "var": Vars_1["default"].showBackground,
            title: "Background"
        }, {
            key: 'F5',
            "var": Vars_1["default"].showButtons,
            title: "Buttons"
        }, {
            key: 'F9',
            "var": Vars_1["default"].debugMode,
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
function drawBackground(ctx) {
    var _a, _b;
    var img = Sprites_1.Img.store['grass'];
    if (!((_a = img === null || img === void 0 ? void 0 : img.size) === null || _a === void 0 ? void 0 : _a.x) || !((_b = img === null || img === void 0 ? void 0 : img.size) === null || _b === void 0 ? void 0 : _b.y)) {
        return;
    }
    for (var yi = 0; yi * img.size.y < window.innerHeight; yi++) {
        for (var xi = 0; xi * img.size.x < window.innerWidth; xi++) {
            ctx.drawImage(img.element, xi * img.size.x, yi * img.size.y);
        }
    }
}
//# sourceMappingURL=Draw.js.map