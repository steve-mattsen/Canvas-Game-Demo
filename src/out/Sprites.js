"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.SpriteSheet = exports.Animation = exports.Frame = exports.Img = void 0;
var Vec2_1 = require("./Vec2");
var Img = (function () {
    function Img(id, uri) {
        if (id === void 0) { id = ''; }
        if (uri === void 0) { uri = ''; }
        this.id = '';
        this.uri = '';
        this.id = id !== null && id !== void 0 ? id : this.id;
        this.uri = uri !== null && uri !== void 0 ? uri : this.uri;
        this.element = new Image();
        this.element.src = this.uri;
        this.size = new Vec2_1.vec2(this.element.width, this.element.height);
    }
    Img.addImg = function (image) {
        Img.store[image.id] = image;
    };
    Img.store = {};
    return Img;
}());
exports.Img = Img;
var Frame = (function () {
    function Frame(image, subImgX, subImgY, subImgWidth, subImgHeight, duration) {
        this.subImg = new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0));
        this.duration = 4;
        this.image = image !== null && image !== void 0 ? image : this.image;
        this.subImg = new Vec2_1.bbox(new Vec2_1.vec2(subImgX, subImgY), new Vec2_1.vec2(subImgX + subImgWidth, subImgY + subImgHeight));
        this.duration = duration !== null && duration !== void 0 ? duration : this.duration;
    }
    return Frame;
}());
exports.Frame = Frame;
var Animation = (function () {
    function Animation(frames) {
        this.frames = [];
        this.tick = 0;
        this.currentFrame = 0;
        this.frames = frames !== null && frames !== void 0 ? frames : this.frames;
    }
    Animation.prototype.tickFrame = function () {
        this.tick++;
        if (this.tick > this.frames[this.currentFrame].duration) {
            this.currentFrame++;
            this.currentFrame %= this.frames.length;
            this.tick = 0;
        }
    };
    Animation.prototype.getCurrentFrame = function () {
        return this.frames[this.currentFrame];
    };
    Animation.prototype.copy = function () {
        return new Animation(__spreadArray([], this.frames, true));
    };
    return Animation;
}());
exports.Animation = Animation;
var SpriteSheet = (function () {
    function SpriteSheet(image, rowDims, colDims) {
        this.rowDims = [];
        this.colDims = [];
        this.image = image;
        this.rowDims = rowDims;
        this.colDims = colDims;
    }
    SpriteSheet.prototype.getAnim = function (rows, cols, duration) {
        var _this = this;
        if (duration === void 0) { duration = 4; }
        var frames = [];
        rows.forEach(function (r) {
            cols.forEach(function (c) {
                var _a, _b;
                var thisRowDim = _this.rowDims[r];
                var thisColDim = _this.colDims[c];
                var nextRowDim = (_a = _this.rowDims[r + 1]) !== null && _a !== void 0 ? _a : _this.image.size.y;
                var nextColumnDim = (_b = _this.colDims[c + 1]) !== null && _b !== void 0 ? _b : _this.image.size.x;
                frames.push(new Frame(_this.image, thisColDim, Math.round(thisRowDim), nextColumnDim - thisColDim, Math.round(nextRowDim - thisRowDim), duration !== null && duration !== void 0 ? duration : 4));
            });
        });
        return new Animation(frames);
    };
    return SpriteSheet;
}());
exports.SpriteSheet = SpriteSheet;
//# sourceMappingURL=Sprites.js.map