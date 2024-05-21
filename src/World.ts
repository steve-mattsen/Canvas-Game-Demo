
import {Img, Animation, Frame} from "./Sprites"
import {Obj} from "./Obj"
import {vec2} from "./Vec2"
let spritesheet_link = new Img('spritesheet_link', "/spritesheet_link.png");
Img.addImg(spritesheet_link);
let xSize = 102.4;
let ySize = 110.875;
let frameTime = 4;
let anims: { [id: string]: Animation } = {
	'idle': new Animation([
		new Frame(spritesheet_link, xSize * 0, 0, xSize, ySize, frameTime * 24),
		new Frame(spritesheet_link, xSize * 1, 0, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 2, 0, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1, 0, xSize, ySize, frameTime),
	]),
	'walk_right': new Animation([
		new Frame(spritesheet_link, xSize * 9 + 4, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 8 + 7, ySize * 7, xSize - 8, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 6 + 0, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 5 + 0, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 4 + 6, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 3 + 6, ySize * 7, xSize - 7, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1 + 2, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 0 + 0, ySize * 7, xSize, ySize, frameTime),
	]),
	'walk_left': new Animation([
		new Frame(spritesheet_link, xSize * 0 + 0, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1 + 2, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 3 + 6, ySize * 5, xSize - 7, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 4 + 6, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 5 + 0, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 6 + 0, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 8 + 7, ySize * 5, xSize - 8, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 9 + 4, ySize * 5, xSize, ySize, frameTime),
	]),
	'walk_down': new Animation([
		new Frame(spritesheet_link, xSize * 0 + 0, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1 + 2, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 3 + 6, ySize * 4, xSize - 7, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 4 + 6, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 5 + 0, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 6 + 0, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 8 + 7, ySize * 4, xSize - 8, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 9 + 4, ySize * 4, xSize, ySize, frameTime),
	]),
	'walk_up': new Animation([
		new Frame(spritesheet_link, xSize * 0 + 0, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1 + 2, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 3 + 6, ySize * 6, xSize - 7, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 4 + 6, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 5 + 0, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 6 + 0, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 8 + 7, ySize * 6, xSize - 8, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 9 + 4, ySize * 6, xSize, ySize, frameTime),
	])
};
anims['run_right'] = new Animation([
	anims['walk_right'].frames[0],
	anims['walk_right'].frames[1],
	new Frame(spritesheet_link, xSize * 2, ySize * 7, xSize, ySize, frameTime * 1.75),
	anims['walk_right'].frames[2],
	anims['walk_right'].frames[3],
	anims['walk_right'].frames[4],
	anims['walk_right'].frames[5],
	new Frame(spritesheet_link, xSize * 7, ySize * 7, xSize, ySize, frameTime * 1.75),
	anims['walk_right'].frames[6],
	anims['walk_right'].frames[7],
]);
anims['run_left'] = new Animation([
	anims['walk_left'].frames[0],
	anims['walk_left'].frames[1],
	new Frame(spritesheet_link, xSize * 2, ySize * 5, xSize, ySize, frameTime * 1.75),
	anims['walk_left'].frames[2],
	anims['walk_left'].frames[3],
	anims['walk_left'].frames[4],
	anims['walk_left'].frames[5],
	new Frame(spritesheet_link, xSize * 7, ySize * 5, xSize, ySize, frameTime * 1.75),
	anims['walk_left'].frames[6],
	anims['walk_left'].frames[7],
]);

anims['run_down'] = new Animation([
	anims['walk_down'].frames[0],
	anims['walk_down'].frames[1],
	new Frame(spritesheet_link, xSize * 2, ySize * 4, xSize, ySize, frameTime * 1.75),
	anims['walk_down'].frames[2],
	anims['walk_down'].frames[3],
	anims['walk_down'].frames[4],
	anims['walk_down'].frames[5],
	new Frame(spritesheet_link, xSize * 7, ySize * 4, xSize, ySize, frameTime * 1.75),
	anims['walk_down'].frames[6],
	anims['walk_down'].frames[7],
]);

anims['run_up'] = new Animation([
	anims['walk_up'].frames[0],
	anims['walk_up'].frames[1],
	new Frame(spritesheet_link, xSize * 2, ySize * 6, xSize, ySize, frameTime * 1.75),
	anims['walk_up'].frames[2],
	anims['walk_up'].frames[3],
	anims['walk_up'].frames[4],
	anims['walk_up'].frames[5],
	new Frame(spritesheet_link, xSize * 7, ySize * 6, xSize, ySize, frameTime * 1.75),
	anims['walk_up'].frames[6],
	anims['walk_up'].frames[7],
]);

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
Obj.addObj(player);