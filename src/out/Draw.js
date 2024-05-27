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
    Vars_1["default"].cameraWidth = Vars_1["default"].canvasWidth / Vars_1["default"].cameraScale;
    Vars_1["default"].cameraHeight = Vars_1["default"].canvasHeight / Vars_1["default"].cameraScale;
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
    ctx.imageSmoothingEnabled = false;
    ctx.scale(Vars_1["default"].cameraScale, Vars_1["default"].cameraScale);
    if (Vars_1["default"].showBackground) {
        drawBackground(ctx);
    }
    var plyr = Obj_1.Obj.store['player'];
    if (Vars_1["default"].spriteSheetMode) {
        var sprite = plyr.getAnimFrame();
        ctx.fillStyle = "red";
        ctx.fillRect(sprite.drawBox.x, sprite.drawBox.y, sprite.drawBox.width, sprite.drawBox.height);
        ctx.drawImage(Sprites_1.Img.store['spritesheet_link'].element, 0, 0);
    }
    drawObjects(ctx);
    ctx.scale(1 / Vars_1["default"].cameraScale, 1 / Vars_1["default"].cameraScale);
    ctx.imageSmoothingEnabled = true;
    drawButtons(ctx);
}
exports["default"] = draw;
function drawObjects(ctx) {
    var entries = Object.values(Obj_1.Obj.store).sort(function (a, b) { return a.pos.y - b.pos.y; });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var v = entries_1[_i];
        var obj = v;
        var hb = obj.calcHitBox();
        if (Vars_1["default"].displayMode > 1) {
            var sprite = void 0;
            if (Vars_1["default"].displayMode < 3 || obj.animations == null) {
                sprite = obj.sprite;
            }
            else {
                sprite = obj.getAnimFrame();
            }
            var shadow = (0, Sprites_1.sprt)('shadow');
            shadow.scale = sprite.drawBox.width / shadow.drawBox.width;
            ctx.drawImage(shadow.image.element, Math.round(obj.pos.x - (shadow.drawBox.width * shadow.scale * 0.5) - 1), Math.round(obj.pos.y - (shadow.drawBox.height * shadow.scale * 0.5) - 1), sprite.drawBox.width, sprite.drawBox.height * 0.5);
            var drawBox = sprite.drawBox.fromPoint(obj.pos).fromOrigin(['center', 'bottom']);
            ctx.drawImage(sprite.image.element, sprite.drawBox.x, sprite.drawBox.y, sprite.drawBox.width, sprite.drawBox.height, Math.round(obj.pos.x - sprite.drawBox.origin.x), Math.round(obj.pos.y - sprite.drawBox.origin.y - obj.z), drawBox.width, drawBox.height);
        }
        if (Vars_1["default"].displayMode < 4) {
            drawMarker(ctx, hb.x, hb.y);
            var p2 = hb.p2();
            drawMarker(ctx, p2.x, p2.y);
        }
        if (Vars_1["default"].debugMode || (Vars_1["default"].displayMode !== 0 && Vars_1["default"].displayMode < 4)) {
            drawBoxOutline(ctx, hb);
        }
        if (!Vars_1["default"].debugMode) {
            continue;
        }
        ctx.save();
        var fontSize = 4;
        ctx.font = "".concat(fontSize, "px Courier");
        ctx.fillStyle = Vars_1["default"].bgColors[0] + '88';
        ctx.fillRect(0, 0, 50, fontSize * 4);
        ctx.fillStyle = Vars_1["default"].fgColors[0];
        ctx.fillText("window ".concat(window.innerWidth, "x").concat(window.innerHeight), 0, fontSize);
        ctx.fillText("canvas ".concat(Vars_1["default"].canvasWidth, "x").concat(Vars_1["default"].canvasHeight), 0, fontSize * 2);
        ctx.fillText("camera ".concat(Vars_1["default"].cameraWidth, "x").concat(Vars_1["default"].cameraHeight), 0, fontSize * 3);
        var inputs = Object.entries(Vars_1["default"].inputState).filter(function (k, v) { return Vars_1["default"].inputState[k[0]]; });
        ctx.fillStyle = Vars_1["default"].bgColors[0] + '88';
        ctx.fillRect(Vars_1["default"].cameraWidth - 50, 0, 50, fontSize * inputs.length * 1 + fontSize * .25);
        var count = 0;
        for (var _a = 0, inputs_1 = inputs; _a < inputs_1.length; _a++) {
            var _b = inputs_1[_a], k = _b[0], v_1 = _b[1];
            ctx.textAlign = "right";
            ctx.textBaseline = "hanging";
            ctx.fillStyle = Vars_1["default"].fgColors[0];
            ctx.fillText("".concat(k, " : ").concat(v_1), Vars_1["default"].cameraWidth, count++ * fontSize);
        }
        ctx.textAlign = "left";
        ctx.fillStyle = Vars_1["default"].bgColors[0] + '88';
        ctx.fillRect(hb.x, hb.y, hb.width, hb.height);
        ctx.fillStyle = Vars_1["default"].fgColors[0];
        ctx.textBaseline = "top";
        ctx.fillText("x:".concat(Math.round(obj.pos.x)), hb.x, hb.y, hb.width);
        ctx.fillText("y:".concat(Math.round(obj.pos.y)), hb.x, hb.y + fontSize, hb.width);
        if (obj.animations !== null) {
            ctx.fillText(obj.animState + " " + obj.animations[obj.animState].currentSprite.toString(), obj.pos.x, obj.pos.y + obj.hitBox.p2().y + fontSize);
        }
        drawMarker(ctx, obj.pos.x, obj.pos.y);
        ctx.restore();
    }
    ;
}
function drawButtons(ctx) {
    ctx.save();
    var i = 0;
    for (var _i = 0, _a = Object.entries(Button_1["default"].store).reverse(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], button = _b[1];
        if (!Vars_1["default"].showButtons && button.varKey !== 'showButtons') {
            continue;
        }
        var aspectRatio = Vars_1["default"].cameraWidth;
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
function drawMarker(ctx, x, y, diagonal) {
    if (diagonal === void 0) { diagonal = true; }
    ctx.save();
    ctx.fillStyle = Vars_1["default"].fgColors[0];
    ctx.lineWidth = 0.5;
    var path = new Path2D();
    var crosshairSize = 2;
    var offset = 0;
    x = x + offset;
    y = y + offset;
    if (diagonal) {
        path.moveTo(x - crosshairSize, y - crosshairSize);
        path.lineTo(x + crosshairSize, y + crosshairSize);
        path.moveTo(x - crosshairSize, y + crosshairSize);
        path.lineTo(x + crosshairSize, y - crosshairSize);
    }
    else {
        path.moveTo(x - crosshairSize, y);
        path.lineTo(x + crosshairSize, y);
        path.moveTo(x, y - crosshairSize);
        path.lineTo(x, y + crosshairSize);
    }
    ctx.stroke(path);
    ctx.restore();
}
function drawBoxOutline(ctx, box) {
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    ctx.restore();
}
//# sourceMappingURL=Draw.js.map