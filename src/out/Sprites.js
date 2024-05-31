"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        this.id = '';
        this.uri = '';
        this.loaded = false;
        this.id = id !== null && id !== void 0 ? id : this.id;
        this.uri = uri !== null && uri !== void 0 ? uri : this.uri;
        this.element = new Image();
        this.element.src = this.uri;
    }
    Img.addImg = function (image) {
        Img.store[image.id] = image;
    };
    Img.checkImagesArePreloaded = function () {
        for (var _i = 0, _a = Object.entries(Img.store); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], image = _b[1];
            if (!image.element.complete || (image.element.width + image.element.height) == 0) {
                return false;
            }
        }
        return true;
    };
    Img.preloadImages = function (images) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, images_1, uri, key, _a, _b, _c, _d, _e, key, obj;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _i = 0, images_1 = images;
                        _f.label = 1;
                    case 1:
                        if (!(_i < images_1.length)) return [3, 4];
                        uri = images_1[_i];
                        key = uri.replace(RegExp(/(.*)\/(.*)\.(.*)/gim), "$2");
                        _b = (_a = Img).addImg;
                        return [4, new Img(key, uri)];
                    case 2:
                        _b.apply(_a, [_f.sent()]);
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4:
                        if (!(Img.checkImagesArePreloaded() === false)) return [3, 6];
                        return [4, new Promise(function (r) { return setTimeout(r, 100); })];
                    case 5:
                        _f.sent();
                        return [3, 4];
                    case 6:
                        for (_c = 0, _d = Object.entries(Img.store); _c < _d.length; _c++) {
                            _e = _d[_c], key = _e[0], obj = _e[1];
                            obj.size = (0, Geo_1.vec)(obj.element.width, obj.element.height);
                        }
                        return [2];
                }
            });
        });
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
        this.drawBox = new Geo_1.Box(0, 0, this.colSize, this.rowSize, { x: 'center', y: 'bottom' });
        this.duration = duration;
    }
    SpriteSheet.prototype.getAnim = function (rows, cols) {
        var _this = this;
        var frames = [];
        rows.forEach(function (r) {
            cols.forEach(function (c) {
                frames.push(new Sprite(_this.image, new Geo_1.Box(c * _this.colSize, r * _this.rowSize, _this.colSize, _this.rowSize, _this.drawBox.origin), 1, _this.duration));
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
            this.drawBox = new Geo_1.Box(0, 0, image.size.x, image.size.y, { x: 'center', y: 'bottom' });
        }
        this.duration = duration;
        this.offScreenCanvas = new OffscreenCanvas(this.drawBox.width, this.drawBox.height);
        var ctx = this.offScreenCanvas.getContext('2d');
        ctx.scale(this.drawBox.width / this.image.size.x, this.drawBox.height / this.image.size.y);
        ctx.drawImage(this.image.element, this.drawBox.x, this.drawBox.y, this.drawBox.width, this.drawBox.height, 0, 0, this.image.size.x, this.image.size.y);
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