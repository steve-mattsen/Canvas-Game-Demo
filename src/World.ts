
import { Img, Animation, SpriteSheet, Sprite, sprt } from "./Sprites"
import { Obj } from "./Obj"
import { vec, Box } from "./Geo"
import Vars from "./Vars";

let ss = new SpriteSheet('spritesheet_link', 8, 10);
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
	vec(
		(Vars.canvasWidth - ss.rowSize - 1) / (2 * Vars.cameraScale),
		(Vars.canvasHeight - ss.colSize) / (2 * Vars.cameraScale),
	),
	anims.idle_down.sprites[0],
	new Box(0, 0, 10, 8, ['center', 'bottom']),
	anims
);
Obj.addObj(player);


for (let i = 0; i < 16; i++) {
const tree_sprite = sprt('tree');
const tree = new Obj(
		'tree' + i,
		vec(
			(Math.random() * Vars.cameraWidth),
			(Math.random() * Vars.cameraHeight),
		),
	tree_sprite,
	new Box(
		tree_sprite.drawBox.width * .4,
		tree_sprite.drawBox.height * .75,
		tree_sprite.drawBox.width * .2,
		tree_sprite.drawBox.height * .15,
		['center', 'bottom'],
	),
);
Obj.addObj(tree);
}

for (let i = 0; i < 20; i++) {
	const bush_sprite = sprt('bush');
	const bush = new Obj(
		'bush' + i,
		vec(
			(Math.random() * Vars.cameraWidth),
			(Math.random() * Vars.cameraHeight),
		),
		bush_sprite,
	)
	Obj.addObj(bush);
}