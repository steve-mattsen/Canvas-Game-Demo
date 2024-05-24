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
var ss = new Sprites_1.SpriteSheet(Sprites_1.Img.store['spritesheet_link'], [0, 110.875, 221.75, 332.625, 443.5, 554.375, 665.25, 776.125], [0, 102.4, 204.8, 307.2, 409.6, 512, 614.4, 716.8, 819.2, 921.6]);
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
var xSize = 102.4;
var ySize = 111.25;
var player = new Obj_1.Obj('player', Sprites_1.Img.store['spritesheet_link'], (0, Geo_1.vec)(xSize - 1, ySize), (0, Geo_1.vec)((window.innerWidth - xSize - 1) / 2, (window.innerHeight - ySize) / 2), anims);
player.animState = 'idle_down';
Obj_1.Obj.addObj(player);
//# sourceMappingURL=World.js.map