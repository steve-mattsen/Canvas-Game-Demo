"use strict";
exports.__esModule = true;
exports.onWindowResize = void 0;
var Sprites_1 = require("./Sprites");
var Obj_1 = require("./Obj");
var Vars_1 = require("./Vars");
var Button_1 = require("./Button");
var Geo_1 = require("./Geo");
var Input_1 = require("./Input");
var Colors_1 = require("./Colors");
var Game_1 = require("./Game");
function onWindowResize() {
    Game_1["default"].screen.width = window.innerWidth;
    Game_1["default"].screen.height = window.innerHeight;
    Vars_1["default"].canvasWidth = Game_1["default"].screen.width / Vars_1["default"].canvasScale;
    Vars_1["default"].canvasHeight = Game_1["default"].screen.height / Vars_1["default"].canvasScale;
    Game_1["default"].camera.updateDims();
    var canvases = ['game_window', 'background_canvas', 'shadow_canvas', 'ui_canvas'];
    for (var _i = 0, canvases_1 = canvases; _i < canvases_1.length; _i++) {
        var canvasID = canvases_1[_i];
        var canvas = document.getElementById(canvasID);
        canvas.setAttribute('width', Vars_1["default"].canvasWidth + '');
        canvas.setAttribute('height', Vars_1["default"].canvasHeight + '');
    }
    for (var _a = 0, _b = Object.values(Input_1["default"].onscreenControls); _a < _b.length; _a++) {
        var input = _b[_a];
        input.attach();
    }
    Vars_1["default"].showBackground = true;
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
    ctx.scale(Game_1["default"].camera.zoom, Game_1["default"].camera.zoom);
    if (Vars_1["default"].showBackground) {
        drawBackground();
    }
    var plyr = Obj_1.Obj.store['player'];
    drawObjects(ctx);
    if (Vars_1["default"].spriteSheetMode) {
        var sprite = plyr.getAnimFrame();
        ctx.fillStyle = "red";
        ctx.fillRect(sprite.drawBox.x, sprite.drawBox.y, sprite.drawBox.width, sprite.drawBox.height);
        ctx.drawImage(Sprites_1.Img.store['spritesheet_link'].element, 0, 0);
    }
    Vars_1["default"].debugMode && drawDebugInfo(ctx);
    ctx.scale(1 / Game_1["default"].camera.zoom, 1 / Game_1["default"].camera.zoom);
    ctx.imageSmoothingEnabled = true;
    var uiCanvas = document.getElementById('ui_canvas');
    var uiCtx = uiCanvas.getContext("2d");
    uiCtx.clearRect(0, 0, Vars_1["default"].canvasWidth, Vars_1["default"].canvasHeight);
    drawControls(uiCtx);
    drawButtons(uiCtx);
}
exports["default"] = draw;
function drawObjects(ctx) {
    var entries = Object.values(Obj_1.Obj.store).sort(function (a, b) { return a.pos.y - b.pos.y; });
    var cambox = Game_1["default"].camera.fromOrigin();
    var fontSize = 4;
    ctx.font = "".concat(fontSize, "px Courier");
    if (Vars_1["default"].displayMode > 1) {
        drawShadows(entries);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var obj = entries_1[_i];
            var sprite = void 0;
            if (Vars_1["default"].displayMode < 3 || obj.animations == null) {
                sprite = obj.sprite;
            }
            else {
                if (Vars_1["default"].displayMode < 3 || obj.animations == null) {
                    sprite = obj.sprite;
                }
                else {
                    sprite = obj.getAnimFrame();
                }
            }
            var offset = sprite.drawBox.getOrigin();
            ctx.drawImage(sprite.offScreenCanvas, obj.pos.x - offset.x - cambox.x, obj.pos.y - offset.y - cambox.y - obj.z);
        }
    }
    if (Vars_1["default"].displayMode < 4) {
        for (var _a = 0, entries_2 = entries; _a < entries_2.length; _a++) {
            var obj = entries_2[_a];
            if (obj.hitBox === null) {
                continue;
            }
            var hb = obj.calcHitBox();
            hb.x -= cambox.x;
            hb.y -= cambox.y;
            drawMarker(ctx, hb.x, hb.y);
            var p2 = hb.p2();
            drawMarker(ctx, p2.x, p2.y);
        }
    }
    if (Vars_1["default"].displayMode !== 0 && Vars_1["default"].displayMode < 4) {
        for (var _b = 0, entries_3 = entries; _b < entries_3.length; _b++) {
            var obj = entries_3[_b];
            if (obj.hitBox === null) {
                continue;
            }
            var hb = obj.calcHitBox();
            hb.x -= cambox.x;
            hb.y -= cambox.y;
            drawBoxOutline(ctx, hb);
        }
    }
}
;
function drawButtons(ctx) {
    var button = Button_1["default"].store.F6;
    var width = 50;
    var margin = 5;
    button.dimensions = new Geo_1.Box(Vars_1["default"].canvasWidth - width - margin, margin, width, width, new Geo_1.Vec2(0, 0));
    var colorKey = Number(Reflect.get(Vars_1["default"], button.varKey));
    ctx.fillStyle = Colors_1["default"].bg[colorKey] + "88";
    ctx.fillRect(button.dimensions.x, button.dimensions.y, button.dimensions.width, button.dimensions.height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(button.dimensions.x, button.dimensions.y, button.dimensions.width, button.dimensions.height);
    ctx.fillStyle = Colors_1["default"].fg[colorKey];
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold ".concat(Math.ceil(button.dimensions.height), "px Courier");
    ctx.fillText("\u2921", button.dimensions.x + width / 2 - margin / 2, margin * 2 + button.dimensions.height / 2, width);
}
function drawBackground() {
    var _a, _b;
    var canvas = document.getElementById('background_canvas');
    if (canvas.getContext === undefined) {
        return;
    }
    var ctx = canvas.getContext('2d');
    if (ctx === null) {
        return;
    }
    var img = Sprites_1.Img.store['grass'];
    if (!((_a = img === null || img === void 0 ? void 0 : img.size) === null || _a === void 0 ? void 0 : _a.x) || !((_b = img === null || img === void 0 ? void 0 : img.size) === null || _b === void 0 ? void 0 : _b.y)) {
        return;
    }
    var cambox = Game_1["default"].camera.fromOrigin();
    var imgSize = new Geo_1.Vec2(img.size.x * Game_1["default"].camera.zoom, img.size.y * Game_1["default"].camera.zoom);
    var xoffset = (cambox.x * Game_1["default"].camera.zoom) % imgSize.x;
    var yoffset = (cambox.y * Game_1["default"].camera.zoom) % imgSize.y;
    var backgroundRows = Math.ceil(cambox.width / img.size.x);
    var backgroundCols = Math.ceil(cambox.height / img.size.y);
    ctx.imageSmoothingEnabled = false;
    for (var i = -1; i <= backgroundRows; i++) {
        for (var j = -1; j <= backgroundCols; j++) {
            ctx.drawImage(img.element, i * imgSize.x - xoffset, j * imgSize.y - yoffset, imgSize.x, imgSize.y);
        }
    }
}
function drawMarker(ctx, x, y, diagonal) {
    if (diagonal === void 0) { diagonal = true; }
    ctx.fillStyle = Colors_1["default"].fg[0];
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
    var cambox = Game_1["default"].camera.fromOrigin();
    ctx.save();
    var fontSize = 4;
    ctx.textAlign = "left";
    ctx.font = "".concat(fontSize, "px Courier");
    ctx.fillStyle = Colors_1["default"].bg[0] + '88';
    ctx.fillRect(0, 0, 50, fontSize * 4);
    ctx.fillStyle = Colors_1["default"].fg[0];
    ctx.fillText("window ".concat(window.innerWidth, "x").concat(window.innerHeight), 0, fontSize);
    ctx.fillText("canvas ".concat(Vars_1["default"].canvasWidth, "x").concat(Vars_1["default"].canvasHeight), 0, fontSize * 2);
    ctx.fillText("camera ".concat(Game_1["default"].camera.width.toFixed(1), "x").concat(Game_1["default"].camera.height.toFixed(1)), 0, fontSize * 3);
    var inputs = Object.entries(Vars_1["default"].inputState).filter(function (k, v) { return Vars_1["default"].inputState[k[0]]; });
    ctx.fillStyle = Colors_1["default"].bg[0] + '88';
    ctx.fillRect(Game_1["default"].camera.width - 50, 0, 50, fontSize * inputs.length * 1 + fontSize * .25);
    var count = 0;
    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
        var _a = inputs_1[_i], k = _a[0], v = _a[1];
        ctx.textAlign = "right";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = Colors_1["default"].fg[0];
        ctx.fillText("".concat(k, " : ").concat(v), Game_1["default"].camera.width, count++ * fontSize);
    }
    ctx.textAlign = "left";
    count = 0;
    var plyr = Obj_1.Obj.store['player'];
    for (var _b = 0, entries_4 = entries; _b < entries_4.length; _b++) {
        var obj = entries_4[_b];
        if (obj.hitBox !== null) {
            var hb = obj.calcHitBox();
            hb.x -= cambox.x;
            hb.y -= cambox.y;
            ctx.fillStyle = Colors_1["default"].bg[0];
            if (obj.id !== 'player' && obj.calcHitBox().collidesWith(plyr.calcHitBox())) {
                ctx.fillStyle = "red";
            }
            ctx.fillRect(hb.x, hb.y, hb.width, hb.height);
            drawBoxOutline(ctx, hb);
            ctx.fillStyle = Colors_1["default"].fg[0];
            ctx.textBaseline = "top";
            ctx.fillText("x:".concat(Math.round(obj.pos.x)), hb.x, hb.y, hb.width);
            ctx.fillText("y:".concat(Math.round(obj.pos.y)), hb.x, hb.y + fontSize, hb.width);
        }
        drawMarker(ctx, obj.pos.x - cambox.x, obj.pos.y - cambox.y);
        ctx.restore();
    }
}
function drawControls(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = "luminosity";
    var sticks = ['left_stick', 'right_stick'];
    ctx.fillStyle = Colors_1["default"].bg[4] + '22';
    ctx.beginPath();
    for (var _i = 0, sticks_1 = sticks; _i < sticks_1.length; _i++) {
        var name_1 = sticks_1[_i];
        var stick = Input_1["default"].getOnscreenControl(name_1);
        var box = stick.box;
        var middle = box.getCenterMiddle();
        var radius = stick.size.x / 2;
        ctx.ellipse(middle.x, middle.y, radius, radius, 0, 0, 100);
    }
    ctx.fill();
    ctx.fillStyle = Colors_1["default"].bg[0] + '88';
    ctx.strokeStyle = Colors_1["default"].fg[0] + '55';
    ctx.beginPath();
    for (var _a = 0, sticks_2 = sticks; _a < sticks_2.length; _a++) {
        var name_2 = sticks_2[_a];
        var stick = Input_1["default"].getOnscreenControl(name_2);
        var box = stick.box;
        var middle = box.getCenterMiddle();
        var innerStickSize = stick.size.x / 1.5;
        var innerStickPos = new Geo_1.Vec2(middle.x + stick.value.x * innerStickSize / 4, middle.y + stick.value.y * innerStickSize / 4);
        var innerStickRadius = innerStickSize / 2;
        ctx.moveTo(innerStickPos.x + innerStickRadius, innerStickPos.y);
        ctx.ellipse(innerStickPos.x, innerStickPos.y, innerStickRadius, innerStickRadius, 0, 0, 10);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
function drawShadows(entries) {
    var cambox = Game_1["default"].camera.fromOrigin();
    var shadow = (0, Sprites_1.sprt)('shadow');
    var canvas = document.getElementById("shadow_canvas");
    if (canvas.getContext === undefined) {
        return;
    }
    var ctx = canvas.getContext('2d');
    if (ctx === null) {
        return;
    }
    ctx.imageSmoothingEnabled = false;
    ;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var _i = 0, entries_5 = entries; _i < entries_5.length; _i++) {
        var obj = entries_5[_i];
        var sprite = void 0;
        if (Vars_1["default"].displayMode < 3 || obj.animations == null) {
            sprite = obj.sprite;
        }
        else {
            sprite = obj.getAnimFrame();
        }
        shadow.scale = sprite.drawBox.width / shadow.drawBox.width;
        var x = obj.pos.x - (shadow.drawBox.width * shadow.scale * 0.5) - 1 - cambox.x;
        var y = obj.pos.y - (shadow.drawBox.height * shadow.scale * 0.5) - 1 - cambox.y;
        ctx.drawImage(shadow.image.element, x * Game_1["default"].camera.zoom, y * Game_1["default"].camera.zoom, sprite.drawBox.width * Game_1["default"].camera.zoom, sprite.drawBox.height * 0.5 * Game_1["default"].camera.zoom);
    }
}
//# sourceMappingURL=Draw.js.map