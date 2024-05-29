"use strict";
exports.__esModule = true;
exports.onWindowResize = void 0;
var Sprites_1 = require("./Sprites");
var Obj_1 = require("./Obj");
var Vars_1 = require("./Vars");
var Button_1 = require("./Button");
var Geo_1 = require("./Geo");
var Input_1 = require("./Input");
function onWindowResize() {
    var canvas = document.getElementById("game_window");
    Vars_1["default"].canvasWidth = window.innerWidth / Vars_1["default"].canvasScale;
    Vars_1["default"].canvasHeight = window.innerHeight / Vars_1["default"].canvasScale;
    Vars_1["default"].cameraWidth = Vars_1["default"].canvasWidth / Vars_1["default"].cameraScale;
    Vars_1["default"].cameraHeight = Vars_1["default"].canvasHeight / Vars_1["default"].cameraScale;
    canvas.setAttribute('width', Vars_1["default"].canvasWidth + '');
    canvas.setAttribute('height', Vars_1["default"].canvasHeight + '');
}
exports.onWindowResize = onWindowResize;
window.onresize = onWindowResize;
function draw() {
    var canvas = document.getElementById("game_window");
    if (canvas.getContext === undefined) {
        return;
    }
    var ctx = canvas.getContext('2d');
    if (ctx === null) {
        return;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
    Vars_1["default"].debugMode && drawDebugInfo(ctx);
    ctx.scale(1 / Vars_1["default"].cameraScale, 1 / Vars_1["default"].cameraScale);
    ctx.imageSmoothingEnabled = true;
    drawControls(ctx);
    drawButtons(ctx);
}
exports["default"] = draw;
function drawObjects(ctx) {
    var entries = Object.values(Obj_1.Obj.store).sort(function (a, b) { return a.pos.y - b.pos.y; });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var v = entries_1[_i];
        ctx.save();
        var obj = v;
        var fontSize = 4;
        ctx.font = "".concat(fontSize, "px Courier");
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
            ctx.drawImage(sprite.image.element, Math.round(sprite.drawBox.x), Math.round(sprite.drawBox.y), sprite.drawBox.width, sprite.drawBox.height, Math.round(obj.pos.x - sprite.drawBox.origin.x), Math.round(obj.pos.y - sprite.drawBox.origin.y - obj.z), drawBox.width, drawBox.height);
        }
        if (Vars_1["default"].displayMode < 4 && obj.hitBox !== null) {
            var hb = obj.calcHitBox();
            drawMarker(ctx, hb.x, hb.y);
            var p2 = hb.p2();
            drawMarker(ctx, p2.x, p2.y);
        }
        if (Vars_1["default"].displayMode !== 0 && Vars_1["default"].displayMode < 4 && obj.hitBox !== null) {
            var hb = obj.calcHitBox();
            drawBoxOutline(ctx, hb);
        }
    }
    ;
}
function drawButtons(ctx) {
    ctx.save();
    var button = Button_1["default"].store.F6;
    var width = 50;
    var margin = 5;
    button.dimensions = new Geo_1.Box(Vars_1["default"].canvasWidth - width - margin, margin, width, width, new Geo_1.Vec2(0, 0));
    var colorKey = Number(Reflect.get(Vars_1["default"], button.varKey));
    ctx.fillStyle = Vars_1["default"].bgColors[colorKey] + "88";
    ctx.fillRect(button.dimensions.x, button.dimensions.y, button.dimensions.width, button.dimensions.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(button.dimensions.x, button.dimensions.y, button.dimensions.width, button.dimensions.height);
    ctx.fillStyle = Vars_1["default"].fgColors[colorKey];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold ".concat(Math.ceil(button.dimensions.height), "px Courier");
    ctx.fillText("\u2921", button.dimensions.x + width / 2 - margin / 2, margin * 2 + button.dimensions.height / 2, width);
    ctx.restore();
}
function drawBackground(ctx) {
    var _a, _b;
    var img = Sprites_1.Img.store['grass'];
    if (!((_a = img === null || img === void 0 ? void 0 : img.size) === null || _a === void 0 ? void 0 : _a.x) || !((_b = img === null || img === void 0 ? void 0 : img.size) === null || _b === void 0 ? void 0 : _b.y)) {
        return;
    }
    ctx.save();
    for (var yi = 0; yi * img.size.y < Vars_1["default"].cameraHeight; yi++) {
        for (var xi = 0; xi * img.size.x < Vars_1["default"].cameraWidth; xi++) {
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
function drawDebugInfo(ctx) {
    var entries = Object.values(Obj_1.Obj.store).sort(function (a, b) { return a.pos.y - b.pos.y; });
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
    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
        var _a = inputs_1[_i], k = _a[0], v = _a[1];
        ctx.textAlign = "right";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = Vars_1["default"].fgColors[0];
        ctx.fillText("".concat(k, " : ").concat(v), Vars_1["default"].cameraWidth, count++ * fontSize);
    }
    ctx.textAlign = "left";
    ctx.fillStyle = Vars_1["default"].bgColors[0] + '88';
    var boxHeight = entries.length * fontSize;
    ctx.fillRect(0, Vars_1["default"].cameraHeight - boxHeight, 50, boxHeight);
    count = 0;
    var plyr = Obj_1.Obj.store['player'];
    for (var _b = 0, entries_2 = entries; _b < entries_2.length; _b++) {
        var obj = entries_2[_b];
        if (obj.hitBox !== null) {
            var hb = obj.calcHitBox();
            ctx.fillStyle = Vars_1["default"].bgColors[0];
            if (obj.id !== 'player' && obj.calcHitBox().collidesWith(plyr.calcHitBox())) {
                ctx.fillStyle = "red";
            }
            ctx.fillRect(hb.x, hb.y, hb.width, hb.height);
            drawBoxOutline(ctx, hb);
            ctx.fillStyle = Vars_1["default"].fgColors[0];
            ctx.textBaseline = "top";
            ctx.fillText("x:".concat(Math.round(obj.pos.x)), hb.x, hb.y, hb.width);
            ctx.fillText("y:".concat(Math.round(obj.pos.y)), hb.x, hb.y + fontSize, hb.width);
        }
        var text = "".concat(obj.id, ": ");
        if (obj.animations === null) {
            text += "".concat(obj.sprite.image.id);
        }
        else {
            text += "".concat(obj.animState, " ").concat(obj.animations[obj.animState].currentSprite);
        }
        ctx.fillText(text, 0, Vars_1["default"].cameraHeight - ((1 + count++) * fontSize));
        drawMarker(ctx, obj.pos.x, obj.pos.y);
        ctx.restore();
    }
}
function drawControls(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = "luminosity";
    var stick = Input_1["default"].getOnscreenControl('left_stick');
    var box = stick.box;
    var middle = box.getCenterMiddle();
    ctx.beginPath();
    ctx.ellipse(middle.x, middle.y, stick.size / 2, stick.size / 2, 0, 0, 10);
    ctx.strokeStyle = Vars_1["default"].fgColors[0] + '55';
    ctx.stroke();
    var gradient = ctx.createRadialGradient(middle.x, middle.y, 0, middle.x, middle.y, stick.size / 2);
    gradient.addColorStop(0, Vars_1["default"].bgColors[1] + '88');
    gradient.addColorStop(0.99, Vars_1["default"].bgColors[0] + '88');
    gradient.addColorStop(1.0, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(middle.x - stick.size / 2, middle.y - stick.size / 2, stick.size, stick.size);
    var innerStickSize = stick.size / 2;
    var innerStickPos = new Geo_1.Vec2(middle.x + stick.value.x * innerStickSize / 2, middle.y + stick.value.y * innerStickSize / 2);
    ctx.beginPath();
    ctx.ellipse(innerStickPos.x, innerStickPos.y, innerStickSize / 2, innerStickSize / 2, 0, 0, 10);
    ctx.fillStyle = Vars_1["default"].bgColors[0] + '88';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
//# sourceMappingURL=Draw.js.map