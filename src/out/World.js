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
var ss = new Sprites_1.SpriteSheet('spritesheet_link', 8, 10);
var anims = {};
var idleFrames = [0, 1, 2, 1];
anims.idle_down = ss.getAnim([0], idleFrames);
anims.idle_left = ss.getAnim([1], idleFrames);
anims.idle_up = ss.getAnim([2], [0]);
anims.idle_right = ss.getAnim([3], idleFrames);
var blinkInterval = 60;
anims.idle_down.sprites[0].duration = blinkInterval;
anims.idle_left.sprites[0].duration = blinkInterval;
anims.idle_right.sprites[0].duration = blinkInterval;
var runFrames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
anims.run_right = ss.getAnim([7], __spreadArray([], runFrames, true).reverse());
anims.run_left = ss.getAnim([5], runFrames);
anims.run_down = ss.getAnim([4], runFrames);
anims.run_up = ss.getAnim([6], runFrames);
var lungeDuration = 7;
anims.run_right.sprites[2].duration = lungeDuration;
anims.run_right.sprites[7].duration = lungeDuration;
anims.run_left.sprites[2].duration = lungeDuration;
anims.run_left.sprites[7].duration = lungeDuration;
anims.run_down.sprites[2].duration = lungeDuration;
anims.run_down.sprites[7].duration = lungeDuration;
anims.run_up.sprites[2].duration = lungeDuration;
anims.run_up.sprites[7].duration = lungeDuration;
var player = new Obj_1.Obj('player', (0, Geo_1.vec)((Vars_1["default"].canvasWidth - ss.rowSize - 1) / (2 * Vars_1["default"].cameraScale), (Vars_1["default"].canvasHeight - ss.colSize) / (2 * Vars_1["default"].cameraScale)), anims.idle_down.sprites[0], new Geo_1.Box(0, 0, 10, 8, ['center', 'bottom']), anims);
Obj_1.Obj.addObj(player);
for (var i = 0; i < 16; i++) {
    var tree_sprite = (0, Sprites_1.sprt)('tree');
    var tree = new Obj_1.Obj('tree' + i, (0, Geo_1.vec)((Math.random() * Vars_1["default"].cameraWidth), (Math.random() * Vars_1["default"].cameraHeight)), tree_sprite, new Geo_1.Box(tree_sprite.drawBox.width * .4, tree_sprite.drawBox.height * .75, tree_sprite.drawBox.width * .2, tree_sprite.drawBox.height * .15, ['center', 'bottom']));
    Obj_1.Obj.addObj(tree);
}
for (var i = 0; i < 20; i++) {
    var bush_sprite = (0, Sprites_1.sprt)('bush');
    var bush = new Obj_1.Obj('bush' + i, (0, Geo_1.vec)((Math.random() * Vars_1["default"].cameraWidth), (Math.random() * Vars_1["default"].cameraHeight)), bush_sprite);
    Obj_1.Obj.addObj(bush);
}
//# sourceMappingURL=World.js.map