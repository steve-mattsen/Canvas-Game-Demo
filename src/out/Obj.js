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
        this.currentMoveLength = 0;
        this.currentMove = new Geo_1.Vec2(0, 0);
        this.id = id !== null && id !== void 0 ? id : this.id;
        if (typeof spr === 'string') {
            var imgId = spr;
            this.sprite = (0, Sprites_1.sprt)(imgId);
        }
        else {
            this.sprite = spr;
        }
        this.hitBox = hitBox !== null && hitBox !== void 0 ? hitBox : null;
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
    Obj.prototype.calcHitBox = function () {
        return this.hitBox.fromPoint(this.pos).fromOrigin();
    };
    Obj.prototype.act = function () {
        if (this.id != 'tiger' && this.id != 'lion') {
            return;
        }
        if (this.currentMoveLength > 0) {
            this.pos.x += this.currentMove.x;
            this.pos.y += this.currentMove.y;
            this.currentMoveLength--;
        }
        if (Math.random() > 0.01) {
            return;
        }
        this.currentMove = new Geo_1.Vec2((Math.random() * 2) - 1, (Math.random() * 2) - 1);
        if (Math.abs(this.currentMove.x) >= Math.abs(this.currentMove.y)) {
            if (this.currentMove.x > 0) {
                this.animState = "run_right";
            }
            else {
                this.animState = "run_left";
            }
        }
        else {
            if (this.currentMove.y > 0) {
                this.animState = "run_down";
            }
            else {
                this.animState = "run_up";
            }
        }
        this.currentMoveLength = Math.random() * 120;
        return;
    };
    Obj.addObj = function (obj) {
        Obj.store[obj.id] = obj;
    };
    Obj.store = {};
    return Obj;
}());
exports.Obj = Obj;
//# sourceMappingURL=Obj.js.map