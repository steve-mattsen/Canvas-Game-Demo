"use strict";
exports.__esModule = true;
exports.Obj = void 0;
var Geo_1 = require("./Geo");
var Sprites_1 = require("./Sprites");
var Obj = (function () {
    function Obj(id, pos, spr, hitBox, animations) {
        this.id = "blah";
        this.velocity = (0, Geo_1.vec)(0, 0);
        this.animState = 'idle_down';
        this.z = 0;
        this.zVelocity = 0;
        this.id = id !== null && id !== void 0 ? id : this.id;
        if (typeof spr === 'string') {
            var imgId = spr;
            this.sprite = (0, Sprites_1.sprt)(imgId);
        }
        else {
            this.sprite = spr;
        }
        this.hitBox = hitBox;
        if (hitBox === null || hitBox === undefined) {
            this.hitBox = this.sprite.drawBox;
        }
        this.pos = pos !== null && pos !== void 0 ? pos : this.pos;
        this.animations = animations;
        if (animations === undefined) {
            this.animations = null;
        }
        else {
            this.animState = Object.keys(this.animations)[0];
        }
    }
    Obj.prototype.getAnimFrame = function () {
        return this.animations[this.animState].getCurrentFrame();
    };
    Obj.prototype.tickAnimFrame = function () {
        this.animations[this.animState].tickSprite();
    };
    Obj.prototype.getAbsoluteHitbox = function () {
        return this.hitBox.fromOrigin();
    };
    Obj.addObj = function (obj) {
        Obj.store[obj.id] = obj;
    };
    Obj.store = {};
    return Obj;
}());
exports.Obj = Obj;
//# sourceMappingURL=Obj.js.map