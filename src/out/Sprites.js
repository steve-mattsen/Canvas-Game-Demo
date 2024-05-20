"use strict";
exports.__esModule = true;
exports.Animation = exports.Frame = exports.Img = void 0;
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
    }
    Img.addImg = function (image) {
        Img.store[image.id] = image;
    };
    Img.store = {};
    return Img;
}());
exports.Img = Img;
var Frame = (function () {
    function Frame(image, subImg, duration) {
        this.subImg = new Vec2_1.bbox(new Vec2_1.vec2(0, 0), new Vec2_1.vec2(0, 0));
        this.image = image !== null && image !== void 0 ? image : this.image;
        this.subImg = subImg !== null && subImg !== void 0 ? subImg : this.subImg;
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
    return Animation;
}());
exports.Animation = Animation;
//# sourceMappingURL=Sprites.js.map