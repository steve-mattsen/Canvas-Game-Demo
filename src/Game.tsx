import { bbox, vec2 } from "./Vec2";
import { Obj } from "./Obj";
import { Img, Animation, Frame } from "./Sprites";

var inputState: { [id: string]: boolean } = {};

window.onkeydown = e => inputState[e.key] = true;
window.onkeyup = e => inputState[e.key] = false;


let spritesheet_link = new Img('spritesheet_link', "/spritesheet_link.png");
Img.addImg(spritesheet_link);
let xSize = 102.4;
let ySize = 110.875;
let frameTime = 4;
let anims: { [id: string]: Animation } = {
	'idle': new Animation([
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 0, 0), new vec2(xSize * 1, ySize)), frameTime * 32),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 1, 0), new vec2(xSize * 2, ySize)), frameTime),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 2, 0), new vec2(xSize * 3, ySize)), frameTime),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 1, 0), new vec2(xSize * 2, ySize)), frameTime),
	]),
	'walk': new Animation([
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 0, ySize * 7), new vec2(xSize * 1, ySize * 8)), frameTime),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 1 + 2, ySize * 7), new vec2(xSize * 2, ySize * 8)), frameTime * 1.75),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 3 + 6, ySize * 7), new vec2(xSize * 4 - 7, ySize * 8)), frameTime),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 4 + 6, ySize * 7), new vec2(xSize * 5, ySize * 8)), frameTime),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 5, ySize * 7), new vec2(xSize * 6, ySize * 8)), frameTime),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 6, ySize * 7), new vec2(xSize * 7, ySize * 8)), frameTime * 1.75),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 8 + 7, ySize * 7), new vec2(xSize * 9, ySize * 8)), frameTime),
		new Frame(spritesheet_link, new bbox(new vec2(xSize * 9 + 4, ySize * 7), new vec2(xSize * 10, ySize * 8)), frameTime),
	])
};
anims['run'] = new Animation([
	anims['walk'].frames[0],
	anims['walk'].frames[1],
	new Frame(spritesheet_link, new bbox(new vec2(xSize * 2, ySize * 7), new vec2(xSize * 3, ySize * 8)), frameTime * 1.75),
	anims['walk'].frames[2],
	anims['walk'].frames[3],
	anims['walk'].frames[4],
	anims['walk'].frames[5],
	new Frame(spritesheet_link, new bbox(new vec2(xSize * 7, ySize * 7), new vec2(xSize * 8, ySize * 8)), frameTime * 1.75),
	anims['walk'].frames[6],
	anims['walk'].frames[7],
]);
const player = new Obj('player', Img.store['spritesheet_link'], new vec2(xSize, ySize), new vec2(10, 10), anims);
Obj.addObj(player);

function tick() {
	let move = new vec2(
		(inputState.ArrowRight ? 1 : 0) - (inputState.ArrowLeft ? 1 : 0),
		(inputState.ArrowDown ? 1 : 0) - (inputState.ArrowUp ? 1 : 0)
	);
	let speed = inputState.Shift ? 8 : 2;
	//Normalize
	move = move.normalize();
	let plyr = Obj.store['player']
	plyr.animState = move.length() > 0 ? (
		inputState.Shift ? 'run' : 'walk'
	) : 'idle';
	plyr.tickAnimFrame();
	plyr.pos.x += (move.x ?? 0) * speed;
	plyr.pos.y += (move.y ?? 0) * speed;
	plyr.pos = new vec2(
		plyr.pos.x < 0 ? (window.innerWidth + plyr.pos.x) : plyr.pos.x %= window.innerWidth,
		plyr.pos.y < 0 ? (window.innerHeight + plyr.pos.y) : plyr.pos.y %= window.innerHeight,
	)
}
function draw() {
	const canvas: HTMLCanvasElement = document.getElementById("game_window") as HTMLCanvasElement;
	canvas.setAttribute('width', window.innerWidth + '');
	canvas.setAttribute('height', window.innerHeight + '');
	if (canvas.getContext == undefined) {
		return;
	}
	let ctx = canvas.getContext('2d');
	if (ctx === null) {
		return;
	}
	Object.keys(Obj.store).forEach(v => {
		let obj = Obj.store[v];

		let frame = obj.getAnimFrame();
		ctx.drawImage(
			frame.image.element, //image
			frame.subImg.topLeft.x, //subx
			frame.subImg.topLeft.y, //suby
			frame.subImg.getWidth(), //subw
			frame.subImg.getHeight(), //subh
			obj.pos.x, //posx
			obj.pos.y, //posy
			frame.subImg.getWidth(), //width
			frame.subImg.getHeight(), //height
		);
		// ctx.fillStyle = "black";
		// ctx.strokeRect(
		// 	Math.round(obj.pos.x),
		// 	Math.round(obj.pos.y),
		// 	Math.round(obj.size.x),
		// 	Math.round(obj.size.y),
		// );
		ctx.font = "24pt Roboto"
		// ctx.fillText(
		// 	obj.animations[obj.animState].currentFrame.toString(),
		// 	obj.pos.x,
		// 	obj.pos.y
		// )
	});
}

function getCenter() {
	return {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};
}

let refresh = 60;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
