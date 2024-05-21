
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
	'walk': new Animation([
		new Frame(spritesheet_link, xSize * 9 + 4, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 8 + 7, ySize * 7, xSize - 8, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 6 + 0, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 5 + 0, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 4 + 6, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 3 + 6, ySize * 7, xSize - 7, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 1 + 2, ySize * 7, xSize, ySize, frameTime),
		new Frame(spritesheet_link, xSize * 0 + 0, ySize * 7, xSize, ySize, frameTime),
	])
};
anims['run'] = new Animation([
	anims['walk'].frames[0],
	anims['walk'].frames[1],
	new Frame(spritesheet_link, xSize * 2, ySize * 7, xSize, ySize, frameTime * 1.75),
	anims['walk'].frames[2],
	anims['walk'].frames[3],
	anims['walk'].frames[4],
	anims['walk'].frames[5],
	new Frame(spritesheet_link, xSize * 7, ySize * 7, xSize, ySize, frameTime * 1.75),
	anims['walk'].frames[6],
	anims['walk'].frames[7],
]);
const player = new Obj(
	'player', 
	Img.store['spritesheet_link'], 
	new vec2(xSize - 4, ySize), 
	new vec2(
		(window.innerWidth - xSize -4) / 2,
		(window.innerHeight - ySize) / 2
	), 
	anims
);
Obj.addObj(player);