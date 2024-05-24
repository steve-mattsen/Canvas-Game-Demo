
import { Img, Animation, SpriteSheet, Sprite, sprt } from "./Sprites"
import { Obj } from "./Obj"
import { vec, vec2, Box } from "./Geo"
import Vars from "./Vars";

let ss = new SpriteSheet(Img.store['spritesheet_link'], 8, 10);
let anims: { [id: string]: Animation } = {};

let idleFrames = [0, 1, 2, 1];
anims.idle_down = ss.getAnim([0], idleFrames);
anims.idle_left = ss.getAnim([1], idleFrames);
anims.idle_up = ss.getAnim([2], [0]);
anims.idle_right = ss.getAnim([3], idleFrames);

let blinkInterval = 60;
anims.idle_down.sprites[0].duration = blinkInterval;
anims.idle_left.sprites[0].duration = blinkInterval;
anims.idle_right.sprites[0].duration = blinkInterval;

let runFrames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
anims.run_right = ss.getAnim([7], [...runFrames].reverse());
anims.run_left = ss.getAnim([5], runFrames);
anims.run_down = ss.getAnim([4], runFrames);
anims.run_up = ss.getAnim([6], runFrames);

let lungeDuration = 7;
anims.run_right.sprites[2].duration = lungeDuration;
anims.run_right.sprites[7].duration = lungeDuration;
anims.run_left.sprites[2].duration = lungeDuration;
anims.run_left.sprites[7].duration = lungeDuration;
anims.run_down.sprites[2].duration = lungeDuration;
anims.run_down.sprites[7].duration = lungeDuration;
anims.run_up.sprites[2].duration = lungeDuration;
anims.run_up.sprites[7].duration = lungeDuration;


const player = new Obj(
	'player',
	ss.drawBox.bottomRight,
	vec(
		(Vars.canvasWidth - ss.rowSize - 1) / 2,
		(Vars.canvasHeight - ss.colSize) / 2
	),
	new Sprite(Img.store.spritesheet_link, new Box(0, 0, ss.colSize, ss.rowSize)),
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