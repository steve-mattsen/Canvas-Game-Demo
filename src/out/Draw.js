"use strict";
exports.__esModule = true;
var Sprites_1 = require("./Sprites");
var Obj_1 = require("./Obj");
var Vars_1 = require("./Vars");
var Button_1 = require("./Button");
var Geo_1 = require("./Geo");
function draw() {
    var canvas = document.getElementById("game_window");
    Vars_1["default"].canvasWidth = window.innerWidth / Vars_1["default"].canvasScale;
    Vars_1["default"].canvasHeight = window.innerHeight / Vars_1["default"].canvasScale;
    canvas.setAttribute('width', Vars_1["default"].canvasWidth + '');
    canvas.setAttribute('height', Vars_1["default"].canvasHeight + '');
    if (canvas.getContext === undefined) {
        return;
    }
    var ctx = canvas.getContext('2d');
    if (ctx === null) {
        return;
    }
    ctx.lineWidth = 1;
    if (Vars_1["default"].showBackground) {
        drawBackground(ctx);
    }
    var plyr = Obj_1.Obj.store['player'];
    if (Vars_1["default"].spriteSheetMode) {
        var sprite = plyr.getAnimFrame();
        ctx.fillStyle = "red";
        ctx.fillRect(sprite.drawBox.topLeft.x, sprite.drawBox.topLeft.y, sprite.drawBox.getWidth(), sprite.drawBox.getHeight());
        ctx.drawImage(Sprites_1.Img.store['spritesheet_link'].element, 0, 0);
    }
    drawObjects(ctx);
    drawButtons(ctx);
}
exports["default"] = draw;
function drawObjects(ctx) {
    Object.keys(Obj_1.Obj.store).forEach(function (v) {
        var obj = Obj_1.Obj.store[v];
        var hb = obj.getAbsoluteHitbox();
        if (Vars_1["default"].displayMode < 4) {
            ctx.fillStyle = 'black';
            var pointSize = 4;
            var topLeft = new Path2D();
            var x_1 = Math.floor(hb.topLeft.x);
            var y_1 = Math.floor(hb.topLeft.y);
            topLeft.moveTo(x_1, y_1);
            topLeft.lineTo(x_1 + pointSize, y_1);
            topLeft.lineTo(x_1, y_1 + pointSize);
            topLeft.lineTo(x_1, y_1);
            var botRight = new Path2D();
            x_1 = Math.floor(hb.bottomRight.x);
            y_1 = Math.floor(hb.bottomRight.y);
            botRight.moveTo(x_1, y_1);
            botRight.lineTo(x_1 - pointSize, y_1);
            botRight.lineTo(x_1, y_1 - pointSize);
            botRight.lineTo(x_1, y_1);
            ctx.fill(topLeft);
            ctx.fill(botRight);
        }
        if (Vars_1["default"].displayMode !== 0 && Vars_1["default"].displayMode < 4) {
            ctx.strokeStyle = "black";
            var offset_1 = ctx.lineWidth * 0.5;
            ctx.strokeRect(Math.floor(hb.topLeft.x) + offset_1, Math.floor(hb.topLeft.y) + offset_1, hb.getWidth() - offset_1 * 2, hb.getHeight() - offset_1 * 2);
        }
        if (Vars_1["default"].displayMode > 1) {
            var sprite = void 0;
            if (Vars_1["default"].displayMode < 3 || obj.animations == null) {
                sprite = obj.sprite;
            }
            else {
                sprite = obj.getAnimFrame();
            }
            var shadow = (0, Sprites_1.sprt)('shadow');
            shadow.scale = sprite.drawBox.getWidth() / shadow.drawBox.getWidth();
            ctx.drawImage(shadow.image.element, Math.floor(obj.pos.x - (shadow.drawBox.getWidth() * shadow.scale * 0.5) - 1), Math.floor(obj.pos.y - (shadow.drawBox.getHeight() * shadow.scale * 0.5) - 1), sprite.drawBox.getWidth(), sprite.drawBox.getHeight() * 0.5);
            ctx.drawImage(sprite.image.element, sprite.drawBox.topLeft.x, sprite.drawBox.topLeft.y, sprite.drawBox.getWidth(), sprite.drawBox.getHeight(), Math.floor(obj.pos.x - sprite.drawBox.origin.x), Math.floor(obj.pos.y - sprite.drawBox.origin.y - obj.z), sprite.drawBox.getWidth(), sprite.drawBox.getHeight());
        }
        if (!Vars_1["default"].debugMode) {
            return;
        }
        var path = new Path2D();
        var crosshairSize = 2;
        var offset = 0;
        var x = Math.floor(obj.pos.x) + offset;
        var y = Math.floor(obj.pos.y) + offset;
        path.moveTo(x - crosshairSize, y);
        path.lineTo(x + crosshairSize, y);
        path.moveTo(x, y - crosshairSize);
        path.lineTo(x, y + crosshairSize);
        ctx.stroke(path);
        ctx.save();
        ctx.font = "bold 7px Courier";
        ctx.fillStyle = "black";
        ctx.fillText(Math.round(obj.pos.x) + ", " + Math.round(obj.pos.y), obj.pos.x, obj.pos.y - 2);
        if (obj.animations !== null) {
            ctx.fillText(obj.animState + " " + obj.animations[obj.animState].currentSprite.toString(), obj.pos.x, obj.pos.y + obj.hitBox.bottomRight.y + 18);
        }
        ctx.fillText("window ".concat(Vars_1["default"].canvasHeight, "x").concat(Vars_1["default"].canvasWidth), 0, 18);
        var count = 0;
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        Object.keys(Vars_1["default"].inputState).forEach(function (v) {
            if (!Vars_1["default"].inputState[v]) {
                return;
            }
            ctx.fillText("".concat(v, " : ").concat(Vars_1["default"].inputState[v]), Vars_1["default"].canvasWidth, count++ * 18);
        });
        ctx.restore();
    });
}
function drawButtons(ctx) {
    ctx.save();
    var i = 0;
    for (var _i = 0, _a = Object.entries(Button_1["default"].store).reverse(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], button = _b[1];
        if (!Vars_1["default"].showButtons && button.varKey !== 'showButtons') {
            continue;
        }
        var aspectRatio = Vars_1["default"].canvasWidth / Vars_1["default"].canvasHeight;
        var buttonWidth = void 0;
        var buttonHeight = void 0;
        var margin = void 0;
        var buttonAspect = 1 / 8;
        if (aspectRatio > 1) {
            buttonWidth = Math.max(70, Math.ceil(Vars_1["default"].canvasWidth * 0.2), Math.ceil(Vars_1["default"].canvasHeight * 0.05 / buttonAspect));
        }
        else if (aspectRatio > 0.5) {
            buttonWidth = Math.max(70, Math.ceil(Vars_1["default"].canvasWidth * .5));
        }
        else {
            buttonWidth = Math.ceil(Vars_1["default"].canvasWidth);
        }
        buttonHeight = Math.ceil(buttonWidth * buttonAspect);
        margin = Math.ceil(buttonHeight * .2);
        var buttonX = Vars_1["default"].canvasWidth - buttonWidth - margin;
        var buttonY = Vars_1["default"].canvasHeight - (buttonHeight + margin) * (i + 1);
        Button_1["default"].store[key].dimensions = new Geo_1.Box(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
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
    ctx.restore();
}
function drawBackground(ctx) {
    var _a, _b;
    var img = Sprites_1.Img.store['grass'];
    if (!((_a = img === null || img === void 0 ? void 0 : img.size) === null || _a === void 0 ? void 0 : _a.x) || !((_b = img === null || img === void 0 ? void 0 : img.size) === null || _b === void 0 ? void 0 : _b.y)) {
        return;
    }
    ctx.save();
    for (var yi = 0; yi * img.size.y < Vars_1["default"].canvasHeight; yi++) {
        for (var xi = 0; xi * img.size.x < Vars_1["default"].canvasWidth; xi++) {
            ctx.drawImage(img.element, xi * img.size.x, yi * img.size.y);
        }
    }
    ctx.restore();
}
//# sourceMappingURL=Draw.js.map