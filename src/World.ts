
import { Img, Animation, SpriteSheet, Sprite, sprite } from "./Sprites"
import { Obj } from "./Obj"
import { vec, vec2, bbox } from "./Geo"
import Vars from "./Vars";

let ss = new SpriteSheet(Img.store['spritesheet_link'], 8, 10);
let anims: { [id: string]: Animation } = {};

let idleFrames = [0, 1, 2, 1];
anims.idle_down = ss.getAnim([0], idleFrames);
anims.idle_left = ss.getAnim([1], idleFrames);
anims.idle_up = ss.getAnim([2], [0]);
anims.idle_right = ss.getAnim([3], idleFrames);

let blinkInterval = 60;
anims.idle_down.frames[0].duration = blinkInterval;
anims.idle_left.frames[0].duration = blinkInterval;
anims.idle_right.frames[0].duration = blinkInterval;


let walkFrames = [0, 1, 3, 4, 5, 6, 8, 9];
let walkFrameDuration = 8;
anims.walk_right = ss.getAnim([7], [...walkFrames].reverse(), walkFrameDuration);
anims.walk_left = ss.getAnim([5], walkFrames, walkFrameDuration);
anims.walk_down = ss.getAnim([4], walkFrames, walkFrameDuration);
anims.walk_up = ss.getAnim([6], walkFrames, walkFrameDuration);

let runFrames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let runFrameDuration = 2
anims.run_right = ss.getAnim([7], [...runFrames].reverse(), runFrameDuration);
anims.run_left = ss.getAnim([5], runFrames, runFrameDuration);
anims.run_down = ss.getAnim([4], runFrames, runFrameDuration);
anims.run_up = ss.getAnim([6], runFrames, runFrameDuration);

let lungeDuration = 7;
anims.run_right.frames[2].duration = lungeDuration;
anims.run_right.frames[7].duration = lungeDuration;
anims.run_left.frames[2].duration = lungeDuration;
anims.run_left.frames[7].duration = lungeDuration;
anims.run_down.frames[2].duration = lungeDuration;
anims.run_down.frames[7].duration = lungeDuration;
anims.run_up.frames[2].duration = lungeDuration;
anims.run_up.frames[7].duration = lungeDuration;


const player = new Obj(
	'player',
	ss.box.bottomRight,
	vec(
		(Vars.canvasWidth - ss.rowSize - 1) / 2,
		(Vars.canvasHeight - ss.colSize) / 2
	),
	new Sprite(Img.store.spritesheet_link, new bbox(vec(0, 0), vec(ss.rowSize, ss.colSize))),
	anims
);
player.animState = 'idle_down';
Obj.addObj(player);

const tree = new Obj(
	'tree',
	null,
	vec(50, 50),
	'tree'
)
Obj.addObj(tree);