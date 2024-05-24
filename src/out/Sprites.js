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
exports.sprite = exports.Sprite = exports.boxLocation = exports.SpriteSheet = exports.Animation = exports.Frame = exports.Img = void 0;
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
    function SpriteSheet(image, rows, cols) {
        this.image = image;
        this.rows = rows;
        this.cols = cols;
        this.colSize = Math.floor(this.image.size.x / cols);
        this.rowSize = Math.floor(this.image.size.y / rows);
        this.box = new Geo_1.bbox((0, Geo_1.vec)(0, 0), (0, Geo_1.vec)(this.colSize, this.rowSize));
    }
    SpriteSheet.prototype.getAnim = function (rows, cols, duration) {
        var _this = this;
        if (duration === void 0) { duration = 4; }
        var frames = [];
        rows.forEach(function (r) {
            cols.forEach(function (c) {
                frames.push(new Frame(_this.image, c * _this.colSize, r * _this.rowSize, _this.colSize, _this.rowSize, duration));
            });
        });
        return new Animation(frames);
    };
    return SpriteSheet;
}());
exports.SpriteSheet = SpriteSheet;
var boxLocation;
(function (boxLocation) {
    boxLocation[boxLocation["top_left"] = 0] = "top_left";
    boxLocation[boxLocation["top_center"] = 1] = "top_center";
    boxLocation[boxLocation["top_right"] = 2] = "top_right";
    boxLocation[boxLocation["middle_left"] = 3] = "middle_left";
    boxLocation[boxLocation["middle_center"] = 4] = "middle_center";
    boxLocation[boxLocation["middle_right"] = 5] = "middle_right";
    boxLocation[boxLocation["bottom_left"] = 6] = "bottom_left";
    boxLocation[boxLocation["bottom_center"] = 7] = "bottom_center";
    boxLocation[boxLocation["bottom_right"] = 8] = "bottom_right";
})(boxLocation = exports.boxLocation || (exports.boxLocation = {}));
var Sprite = (function () {
    function Sprite(image, box, origin, scale) {
        if (scale === void 0) { scale = 1; }
        this.image = image;
        this.scale = scale;
        this.box = box;
        if (box === undefined) {
            this.box = new Geo_1.bbox((0, Geo_1.vec)(0, 0), (0, Geo_1.vec)(image.size.x, image.size.y));
        }
        if (origin === undefined) {
            origin = boxLocation.bottom_center;
        }
        if (origin instanceof Geo_1.vec2) {
            this.origin = origin;
        }
        var originPoint = (0, Geo_1.vec)(0, 0);
        switch (origin) {
            case boxLocation.top_left:
            case boxLocation.top_center:
            case boxLocation.top_right:
                originPoint.y = 0;
                break;
            case boxLocation.middle_left:
            case boxLocation.middle_center:
            case boxLocation.middle_right:
                originPoint.y = this.box.getHeight() / 2;
                break;
            case boxLocation.bottom_left:
            case boxLocation.bottom_left:
            case boxLocation.bottom_left:
                originPoint.y = this.box.getHeight();
                break;
        }
        switch (origin) {
            case boxLocation.top_left:
            case boxLocation.middle_left:
            case boxLocation.bottom_left:
                originPoint.x = 0;
                break;
            case boxLocation.top_center:
            case boxLocation.middle_center:
            case boxLocation.bottom_center:
                originPoint.x = this.box.getWidth() / 2;
                break;
            case boxLocation.top_right:
            case boxLocation.middle_right:
            case boxLocation.bottom_right:
                originPoint.x = this.box.getWidth();
                break;
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