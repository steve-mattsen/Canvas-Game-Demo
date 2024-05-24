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
var Sprites_1 = require("./Sprites");
var Obj_1 = require("./Obj");
var Geo_1 = require("./Geo");
var Vars_1 = require("./Vars");
var ss = new Sprites_1.SpriteSheet(Sprites_1.Img.store['spritesheet_link'], 8, 10);
var anims = {};
var idleFrames = [0, 1, 2, 1];
anims.idle_down = ss.getAnim([0], idleFrames);
anims.idle_left = ss.getAnim([1], idleFrames);
anims.idle_up = ss.getAnim([2], [0]);
anims.idle_right = ss.getAnim([3], idleFrames);
var blinkInterval = 60;
anims.idle_down.frames[0].duration = blinkInterval;
anims.idle_left.frames[0].duration = blinkInterval;
anims.idle_right.frames[0].duration = blinkInterval;
var walkFrames = [0, 1, 3, 4, 5, 6, 8, 9];
var walkFrameDuration = 8;
anims.walk_right = ss.getAnim([7], __spreadArray([], walkFrames, true).reverse(), walkFrameDuration);
anims.walk_left = ss.getAnim([5], walkFrames, walkFrameDuration);
anims.walk_down = ss.getAnim([4], walkFrames, walkFrameDuration);
anims.walk_up = ss.getAnim([6], walkFrames, walkFrameDuration);
var runFrames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var runFrameDuration = 2;
anims.run_right = ss.getAnim([7], __spreadArray([], runFrames, true).reverse(), runFrameDuration);
anims.run_left = ss.getAnim([5], runFrames, runFrameDuration);
anims.run_down = ss.getAnim([4], runFrames, runFrameDuration);
anims.run_up = ss.getAnim([6], runFrames, runFrameDuration);
var lungeDuration = 7;
anims.run_right.frames[2].duration = lungeDuration;
anims.run_right.frames[7].duration = lungeDuration;
anims.run_left.frames[2].duration = lungeDuration;
anims.run_left.frames[7].duration = lungeDuration;
anims.run_down.frames[2].duration = lungeDuration;
anims.run_down.frames[7].duration = lungeDuration;
anims.run_up.frames[2].duration = lungeDuration;
anims.run_up.frames[7].duration = lungeDuration;
var player = new Obj_1.Obj('player', ss.box.bottomRight, (0, Geo_1.vec)((Vars_1["default"].canvasWidth - ss.rowSize - 1) / 2, (Vars_1["default"].canvasHeight - ss.colSize) / 2), new Sprites_1.Sprite(Sprites_1.Img.store.spritesheet_link, new Geo_1.bbox((0, Geo_1.vec)(0, 0), (0, Geo_1.vec)(ss.rowSize, ss.colSize))), anims);
player.animState = 'idle_down';
Obj_1.Obj.addObj(player);
var tree = new Obj_1.Obj('tree', (0, Geo_1.vec)(50, 50), (0, Geo_1.vec)(50, 50), 'tree');
Obj_1.Obj.addObj(tree);
//# sourceMappingURL=World.js.map