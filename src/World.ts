
import {Img, Animation, Frame} from "./Sprites"
import {Obj} from "./Obj"
import {vec2} from "./Vec2"
let spritesheet_link = new Img('spritesheet_link', "/spritesheet_link.png");
Img.addImg(spritesheet_link);
let xSize = 102.4;
let ySize = 111.25;
let frameTime = 4;
let anims: { [id: string]: Animation } = {};
anims.idle = new Animation([
		new Frame(spritesheet_link, xSize * 0, 0, xSize, ySize, frameTime * 24),
		new Frame(spritesheet_link, xSize * 1, 0, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 2, 0, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1, 0, xSize, ySize, frameTime),
	]);
anims.walk_right = new Animation([
		new Frame(spritesheet_link, xSize * 9 + 4, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 8 + 7, ySize * 7, xSize - 8, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 6 + 0, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 5 + 0, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 4 + 6, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 3 + 6, ySize * 7, xSize - 7, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1 + 2, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 0 + 0, ySize * 7, xSize, ySize, frameTime),
	]);
anims.walk_left = new Animation([
		new Frame(spritesheet_link, xSize * 0 + 0, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1 + 2, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 3 + 6, ySize * 5, xSize - 7, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 4 + 6, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 5 + 0, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 6 + 0, ySize * 5, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 8 + 7, ySize * 5, xSize - 8, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 9 + 4, ySize * 5, xSize, ySize, frameTime),
	]);
anims.walk_down = new Animation([
		new Frame(spritesheet_link, xSize * 0 + 0, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1 + 2, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 3 + 6, ySize * 4, xSize - 7, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 4 + 6, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 5 + 0, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 6 + 0, ySize * 4, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 8 + 7, ySize * 4, xSize - 8, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 9 + 4, ySize * 4, xSize, ySize, frameTime),
	]);
anims.walk_up = new Animation([
		new Frame(spritesheet_link, xSize * 0 + 0, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1 + 2, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 3 + 6, ySize * 6, xSize - 7, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 4 + 6, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 5 + 0, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 6 + 0, ySize * 6, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 8 + 7, ySize * 6, xSize - 8, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 9 + 4, ySize * 6, xSize, ySize, frameTime),
	]);

anims.run_right = anims.walk_right.copy();
anims.run_right.frames.splice(2, 0, new Frame(spritesheet_link, xSize * 2, ySize * 7, xSize, ySize, frameTime * 1.75));
anims.run_right.frames.splice(7, 0, new Frame(spritesheet_link, xSize * 7, ySize * 7, xSize, ySize, frameTime * 1.75));

anims.run_left = anims.walk_left.copy();
anims.run_left.frames.splice(2, 0, new Frame(spritesheet_link, xSize * 2, ySize * 5, xSize, ySize, frameTime * 1.75));
anims.run_left.frames.splice(7, 0, new Frame(spritesheet_link, xSize * 7, ySize * 5, xSize, ySize, frameTime * 1.75));

anims.run_down = anims.walk_down.copy();
anims.run_down.frames.splice(2, 0, new Frame(spritesheet_link, xSize * 2, ySize * 4, xSize, ySize, frameTime * 1.75));
anims.run_down.frames.splice(7, 0, new Frame(spritesheet_link, xSize * 7, ySize * 4, xSize, ySize, frameTime * 1.75));

anims.run_up = anims.walk_up.copy();
anims.run_up.frames.splice(2, 0, new Frame(spritesheet_link, xSize * 2, ySize * 6, xSize, ySize, frameTime * 1.75));
anims.run_up.frames.splice(7, 0, new Frame(spritesheet_link, xSize * 7, ySize * 6, xSize, ySize, frameTime * 1.75));

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