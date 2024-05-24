"use strict";
exports.__esModule = true;
exports.Obj = void 0;
var Geo_1 = require("./Geo");
var Obj = (function () {
    function Obj(id, image, size, pos, animations) {
        if (animations === void 0) { animations = {}; }
        this.id = "blah";
        this.size = (0, Geo_1.vec)(128, 50);
        this.pos = (0, Geo_1.vec)(10, 10);
        this.velocity = (0, Geo_1.vec)(0, 0);
        this.animations = {};
        this.animState = 'idle_down';
        this.z = 0;
        this.zVelocity = 0;
        this.id = id !== null && id !== void 0 ? id : this.id;
        this.image = image !== null && image !== void 0 ? image : this.image;
        this.size = size !== null && size !== void 0 ? size : this.size;
        this.pos = pos !== null && pos !== void 0 ? pos : this.pos;
        this.animations = animations !== null && animations !== void 0 ? animations : this.animations;
    }
    Obj.prototype.getAnimFrame = function () {
        return this.animations[this.animState].getCurrentFrame();
    };
    Obj.prototype.tickAnimFrame = function () {
        this.animations[this.animState].tickFrame();
    };
    Obj.addObj = function (obj) {
        Obj.store[obj.id] = obj;
    };
    Obj.store = {};
    return Obj;
}());
exports.Obj = Obj;
//# sourceMappingURL=Obj.js.map