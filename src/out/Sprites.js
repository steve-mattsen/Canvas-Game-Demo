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
exports.sprite = exports.Sprite = exports.SpriteSheet = exports.Animation = exports.Frame = exports.Img = void 0;
var Geo_1 = require("./Geo");
var Img = (function () {
    function Img(id, uri) {
        if (id === void 0) { id = ''; }
        if (uri === void 0) { uri = ''; }
        var _this = this;
        this.id = '';
        this.uri = '';
        this.loaded = false;
        this.id = id !== null && id !== void 0 ? id : this.id;
        this.uri = uri !== null && uri !== void 0 ? uri : this.uri;
        this.element = new Image();
        this.element.src = this.uri;
        this.element.onload = function () {
            _this.size = (0, Geo_1.vec)(_this.element.width, _this.element.height);
        };
    }
    Img.addImg = function (image) {
        Img.store[image.id] = image;
    };
    Img.checkImagesArePreloaded = function () {
        for (var _i = 0, _a = Object.entries(Img.store); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], image = _b[1];
            if (!image.element.complete) {
                return false;
            }
        }
        return true;
    };
    Img.store = {};
    return Img;
}());
exports.Img = Img;
var Frame = (function () {
    function Frame(image, subImgX, subImgY, subImgWidth, subImgHeight, duration) {
        this.subImg = new Geo_1.bbox((0, Geo_1.vec)(0, 0), (0, Geo_1.vec)(0, 0));
        this.duration = 4;
        this.image = image !== null && image !== void 0 ? image : this.image;
        this.subImg = new Geo_1.bbox((0, Geo_1.vec)(subImgX, subImgY), (0, Geo_1.vec)(subImgX + subImgWidth, subImgY + subImgHeight));
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
var Sprite = (function () {
    function Sprite(image, box, scale) {
        if (scale === void 0) { scale = 1; }
        this.image = image;
        this.scale = scale;
        this.box = box;
        if (box === undefined) {
            this.box = new Geo_1.bbox((0, Geo_1.vec)(0, 0), (0, Geo_1.vec)(image.size.x, image.size.y));
        }
    }
    ;
    Sprite.prototype.draw = function (ctx, pos) {
        ctx.drawImage(this.image.element, this.box.topLeft.x, this.box.topLeft.y, this.box.bottomRight.x, this.box.bottomRight.y, Math.floor(pos.x), Math.floor(pos.y), Math.floor(this.box.getWidth() * this.scale), Math.floor(this.box.getHeight() * this.scale));
    };
    ;
    return Sprite;
}());
exports.Sprite = Sprite;
function sprite(imgId) {
    return new Sprite(Img.store[imgId]);
}
exports.sprite = sprite;
//# sourceMappingURL=Sprites.js.map