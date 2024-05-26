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
exports.sprt = exports.Sprite = exports.SpriteSheet = exports.Animation = exports.Img = void 0;
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
var Animation = (function () {
    function Animation(sprites) {
        this.sprites = [];
        this.tick = 0;
        this.currentSprite = 0;
        this.sprites = sprites;
    }
    Animation.prototype.tickSprite = function () {
        var duration = this.sprites[this.currentSprite].duration;
        this.tick++;
        if (this.tick > duration) {
            this.currentSprite++;
            this.currentSprite %= this.sprites.length;
            this.tick = 0;
        }
    };
    Animation.prototype.getCurrentFrame = function () {
        return this.sprites[this.currentSprite];
    };
    Animation.prototype.copy = function () {
        return new Animation(__spreadArray([], this.sprites, true));
    };
    return Animation;
}());
exports.Animation = Animation;
var SpriteSheet = (function () {
    function SpriteSheet(image, rows, cols, duration) {
        if (duration === void 0) { duration = 1; }
        if (typeof image === 'string') {
            this.image = Img.store[image];
        }
        else {
            this.image = image;
        }
        this.rows = rows;
        this.cols = cols;
        this.colSize = Math.floor(this.image.size.x / cols);
        this.rowSize = Math.floor(this.image.size.y / rows);
        this.drawBox = new Geo_1.Box(0, 0, this.colSize, this.rowSize);
        this.duration = duration;
    }
    SpriteSheet.prototype.getAnim = function (rows, cols) {
        var _this = this;
        var frames = [];
        rows.forEach(function (r) {
            cols.forEach(function (c) {
                frames.push(new Sprite(_this.image, new Geo_1.Box(c * _this.colSize, r * _this.rowSize, _this.colSize, _this.rowSize), 1, _this.duration));
            });
        });
        return new Animation(frames);
    };
    return SpriteSheet;
}());
exports.SpriteSheet = SpriteSheet;
var Sprite = (function () {
    function Sprite(image, drawBox, scale, duration) {
        if (scale === void 0) { scale = 1; }
        if (duration === void 0) { duration = 4; }
        this.image = image;
        this.scale = scale;
        this.drawBox = drawBox;
        if (drawBox === undefined) {
            this.drawBox = new Geo_1.Box(0, 0, image.size.x, image.size.y);
        }
        this.duration = duration;
    }
    ;
    return Sprite;
}());
exports.Sprite = Sprite;
function sprt(imgId) {
    return new Sprite(Img.store[imgId]);
}
exports.sprt = sprt;
//# sourceMappingURL=Sprites.js.map