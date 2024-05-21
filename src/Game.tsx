import { bbox, vec2 } from "./Vec2";
import { Obj } from "./Obj";
import { Img, Animation, Frame } from "./Sprites";
import "./World"

var inputState: { [id: string]: boolean } = {};

window.onkeydown = e => inputState[e.key] = true;
window.onkeyup = e => inputState[e.key] = false;

function tick() {
	let move = new vec2(
		(inputState.ArrowRight || inputState.d ? 1 : 0) - (inputState.ArrowLeft || inputState.a ? 1 : 0),
		(inputState.ArrowDown || inputState.s ? 1 : 0) - (inputState.ArrowUp || inputState.w ? 1 : 0)
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
		Math.max(0, Math.min(plyr.pos.x, window.innerWidth - plyr.size.x)),
		Math.max(0, Math.min(plyr.pos.y, window.innerHeight - plyr.size.y))
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
		ctx.fillStyle = "black";
		ctx.strokeRect(
			Math.round(obj.pos.x),
			Math.round(obj.pos.y),
			Math.round(obj.size.x),
			Math.round(obj.size.y),
		);
		ctx.font = "24px Roboto"
		ctx.fillText(
			Math.round(obj.pos.x) + ", " + Math.round(obj.pos.y),
			obj.pos.x - 4,
			obj.pos.y - 4,
		);
		ctx.fillText(
			obj.animState + " " + obj.animations[obj.animState].currentFrame.toString(),
			obj.pos.x,
			obj.pos.y + obj.size.y + 24,
		)
		ctx.fillText(`
			window height: ${window.innerHeight}\n
			window width: ${window.innerWidth}`,
			0,24
		);
	});
}

let refresh = 60;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
