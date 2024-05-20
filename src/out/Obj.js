"use strict";
exports.__esModule = true;
exports.Obj = void 0;
var Vec2_1 = require("./Vec2");
var Obj = (function () {
    function Obj(id, image, size, pos) {
        this.id = "blah";
        this.size = new Vec2_1.vec2(50, 50);
        this.pos = new Vec2_1.vec2(10, 10);
        this.velocity = new Vec2_1.vec2(0, 0);
        this.id = id !== null && id !== void 0 ? id : this.id;
        this.image = image !== null && image !== void 0 ? image : this.image;
        this.size = size !== null && size !== void 0 ? size : this.size;
        this.pos = pos !== null && pos !== void 0 ? pos : this.pos;
    }
    Obj.addObj = function (obj) {
        Obj.store[obj.id] = obj;
    };
    Obj.store = {};
    return Obj;
}());
exports.Obj = Obj;
//# sourceMappingURL=Obj.js.map