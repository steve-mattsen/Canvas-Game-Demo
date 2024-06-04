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
var Game_1 = require("./Game");
function buildWorld() {
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
    for (var i = 0; i < 10; i++) {
        var tree_sprite = (0, Sprites_1.sprt)('tree');
        var tree = new Obj_1.Obj('tree' + i, (0, Geo_1.vec)(Math.floor((Math.random() * Game_1["default"].camera.width)), Math.floor((Math.random() * Game_1["default"].camera.height) + tree_sprite.image.size.y / 2)), tree_sprite, new Geo_1.Box(tree_sprite.drawBox.width * .4, tree_sprite.drawBox.height * .75, tree_sprite.drawBox.width * .2, tree_sprite.drawBox.height * .15, { x: 'center', y: 'bottom' }));
        Obj_1.Obj.addObj(tree);
    }
    for (var i = 0; i < 50; i++) {
        var bush_sprite = (0, Sprites_1.sprt)('bush');
        var bush = new Obj_1.Obj('bush' + i, (0, Geo_1.vec)(Math.floor((Math.random() * Game_1["default"].camera.width)), Math.floor((Math.random() * Game_1["default"].camera.height) + bush_sprite.image.size.y / 2)), bush_sprite);
        Obj_1.Obj.addObj(bush);
    }
    randomizeLayout();
    var player = new Obj_1.Obj('player', (0, Geo_1.vec)((Vars_1["default"].canvasWidth - ss.rowSize - 1) / (2 * Game_1["default"].camera.zoom), (Vars_1["default"].canvasHeight - ss.colSize) / (2 * Game_1["default"].camera.zoom)), anims.idle_down.sprites[0], new Geo_1.Box(0, 0, 10, 8, { x: 'center', y: 'bottom' }), anims);
    Obj_1.Obj.addObj(player);
    genTiger();
    genLion();
}
exports["default"] = buildWorld;
function randomizeLayout() {
    var entries = Object.values(Obj_1.Obj.store);
    entries.sort(function (a, b) { return Math.random() - Math.random(); });
    var cols = Math.floor(Math.sqrt(entries.length));
    var colWidth = Math.floor(Game_1["default"].camera.width / cols);
    var rows = Math.floor(entries.length / cols);
    var rowHeight = Math.floor((Game_1["default"].camera.height * .9) / rows);
    var randomOffset = 25;
    var i = 0;
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var obj = entries_1[_i];
        obj.pos.x = (i % cols) * colWidth + (colWidth * .5);
        obj.pos.x += (Math.random() * randomOffset) - randomOffset;
        obj.pos.y = Game_1["default"].camera.height * .25;
        obj.pos.y += Math.floor(i / cols) * rowHeight + (rowHeight * .5);
        obj.pos.y += ((Math.random() * randomOffset) - randomOffset) * 2;
        i++;
    }
}
function genTiger() {
    var ss = new Sprites_1.SpriteSheet('tiger', 8, 12);
    var anims = {};
    var idleFrames = [1];
    anims.idle_down = ss.getAnim([0], idleFrames);
    anims.idle_left = ss.getAnim([1], idleFrames);
    anims.idle_right = ss.getAnim([2], idleFrames);
    anims.idle_up = ss.getAnim([3], [0]);
    var walkFrames = [0, 1, 2, 1];
    anims.run_down = ss.getAnim([0], idleFrames);
    anims.run_left = ss.getAnim([1], idleFrames);
    anims.run_right = ss.getAnim([2], idleFrames);
    anims.run_up = ss.getAnim([3], [0]);
    var tiger = new Obj_1.Obj('tiger', (0, Geo_1.vec)((Vars_1["default"].canvasWidth - ss.rowSize - 1) / (2 * Game_1["default"].camera.zoom) + 50, (Vars_1["default"].canvasHeight - ss.colSize) / (2 * Game_1["default"].camera.zoom) + 50), anims.idle_down.sprites[0], new Geo_1.Box(0, 0, 20, 35, { x: 'center', y: 'bottom' }), anims);
    Obj_1.Obj.addObj(tiger);
}
function genLion() {
    var ss = new Sprites_1.SpriteSheet('lion', 8, 12);
    var anims = {};
    var idleFrames = [1];
    anims.idle_down = ss.getAnim([0], idleFrames);
    anims.idle_left = ss.getAnim([1], idleFrames);
    anims.idle_right = ss.getAnim([2], idleFrames);
    anims.idle_up = ss.getAnim([3], [0]);
    var walkFrames = [0, 1, 2, 1];
    anims.run_down = ss.getAnim([0], idleFrames);
    anims.run_left = ss.getAnim([1], idleFrames);
    anims.run_right = ss.getAnim([2], idleFrames);
    anims.run_up = ss.getAnim([3], [0]);
    var lion = new Obj_1.Obj('lion', (0, Geo_1.vec)((Vars_1["default"].canvasWidth - ss.rowSize - 1) / (2 * Game_1["default"].camera.zoom) - 50, (Vars_1["default"].canvasHeight - ss.colSize) / (2 * Game_1["default"].camera.zoom) + 50), anims.idle_down.sprites[0], new Geo_1.Box(0, 0, 20, 35, { x: 'center', y: 'bottom' }), anims);
    Obj_1.Obj.addObj(lion);
}
//# sourceMappingURL=World.js.map