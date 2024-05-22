
import {Img, Animation, Frame, SpriteSheet} from "./Sprites"
import {Obj} from "./Obj"
import {bbox, vec2} from "./Vec2"
let spritesheet_link = new Img('spritesheet_link', "/spritesheet_link.png");
Img.addImg(spritesheet_link);
let ss = new SpriteSheet(spritesheet_link, 
	[0, 110.875, 221.75, 332.625, 443.5, 554.375, 665.25, 776.125 ],
	[0, 102.4, 204.8, 307.2, 409.6, 512, 614.4, 716.8, 819.2, 921.6	],
)
let anims: { [id: string]: Animation } = {};

let idleFrames = [0,1,2,1];
anims.idle_down = ss.getAnim([0], idleFrames);
anims.idle_left = ss.getAnim([1], idleFrames);
anims.idle_up = ss.getAnim([2], [0]);
anims.idle_right = ss.getAnim([3], idleFrames);

let blinkInterval = 60;
anims.idle_down.frames[0].duration = blinkInterval;
anims.idle_left.frames[0].duration = blinkInterval;
anims.idle_right.frames[0].duration = blinkInterval;


let walkFrames = [0,1,3,4,5,6,8,9];
let walkFrameDuration = 8;
anims.walk_right = ss.getAnim([7], [...walkFrames].reverse(), walkFrameDuration);
anims.walk_left = ss.getAnim([5], walkFrames, walkFrameDuration);
anims.walk_down = ss.getAnim([4], walkFrames, walkFrameDuration);
anims.walk_up = ss.getAnim([6], walkFrames, walkFrameDuration);

let runFrames = [0,1,2,3,4,5,6,7,8,9];
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


let xSize = 102.4;
let ySize = 111.25;
const player = new Obj(
	'player', 
	Img.store['spritesheet_link'], 
	new vec2(xSize - 1, ySize), 
	new vec2(
		(window.innerWidth - xSize -1) / 2,
		(window.innerHeight - ySize) / 2
	), 
	anims
);
player.animState = 'idle_down';
Obj.addObj(player);