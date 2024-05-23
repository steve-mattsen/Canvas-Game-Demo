"use strict";
exports.__esModule = true;
var Sprites_1 = require("./Sprites");
var Obj_1 = require("./Obj");
var Vars_1 = require("./Vars");
var Button_1 = require("./Button");
var Vec2_1 = require("./Vec2");
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
    ctx.lineWidth = 2;
    if (Vars_1["default"].showBackground) {
        drawBackground(ctx);
    }
    var plyr = Obj_1.Obj.store['player'];
    if (Vars_1["default"].spriteSheetMode) {
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
        if (Vars_1["default"].displayMode < 3) {
            ctx.fillStyle = 'black';
            var pointSize = 16;
            var topLeft = new Path2D();
            var x = Math.floor(obj.pos.x);
            var y = Math.floor(obj.pos.y);
            topLeft.moveTo(x, y);
            topLeft.lineTo(x + pointSize, y);
            topLeft.lineTo(x, y + pointSize);
            topLeft.lineTo(x, y);
            var botRight = new Path2D();
            x = Math.floor(obj.pos.x + obj.size.x);
            y = Math.floor(obj.pos.y + obj.size.y);
            botRight.moveTo(x, y);
            botRight.lineTo(x - pointSize, y);
            botRight.lineTo(x, y - pointSize);
            botRight.lineTo(x, y);
            ctx.fill(topLeft);
            ctx.fill(botRight);
        }
        if (Vars_1["default"].displayMode === 1 || Vars_1["default"].displayMode === 2) {
            ctx.strokeStyle = "black";
            var offset = ctx.lineWidth / 2;
            ctx.strokeRect(Math.floor(obj.pos.x + offset), Math.floor(obj.pos.y) + offset, Math.floor(obj.size.x - offset), Math.floor(obj.size.y - offset));
        }
        if (Vars_1["default"].displayMode > 1) {
            var frame = obj.getAnimFrame();
            if (Vars_1["default"].displayMode < 4) {
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
    var i = 0;
    for (var _i = 0, _a = Object.entries(Button_1["default"].store).reverse(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], button = _b[1];
        var aspectRatio = window.innerWidth / window.innerHeight;
        var buttonWidth = void 0;
        var buttonHeight = void 0;
        var margin = void 0;
        var buttonAspect = 1 / 8;
        if (aspectRatio > 1) {
            buttonWidth = Math.max(70, Math.ceil(window.innerWidth * 0.2), Math.ceil(window.innerHeight * 0.05 / buttonAspect));
        }
        else if (aspectRatio > 0.5) {
            buttonWidth = Math.max(70, Math.ceil(window.innerWidth * .5));
        }
        else {
            buttonWidth = Math.ceil(window.innerWidth);
        }
        buttonHeight = Math.ceil(buttonWidth * buttonAspect);
        margin = Math.ceil(buttonHeight * .2);
        var buttonX = window.innerWidth - buttonWidth - margin;
        var buttonY = window.innerHeight - (buttonHeight + margin) * (i + 1);
        Button_1["default"].store[key].dimensions = new Vec2_1.bbox(new Vec2_1.vec2(buttonX, buttonY), new Vec2_1.vec2(buttonX + buttonWidth, buttonY + buttonHeight));
        var colorKey = Number(Reflect.get(Vars_1["default"], button.varKey));
        ctx.fillStyle = Vars_1["default"].bgColors[colorKey] + "88";
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
        ctx.fillStyle = Vars_1["default"].fgColors[colorKey];
        ctx.textAlign = "left";
        ctx.font = "".concat(Math.ceil(buttonHeight * .75), "px Courier");
        ctx.fillText("".concat(key, " ").concat(button.title), buttonX + margin, buttonY + Math.ceil(buttonHeight / 2) + margin, buttonWidth - margin * 2);
        i++;
    }
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