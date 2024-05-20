import { vec2 } from "./Vec2";
import * as Sprites from "./Sprites";
import { Obj } from "./Obj";
import { Img } from "./Sprites";

var inputState: { [id: string]: boolean } = {};

window.onkeydown = e => inputState[e.key] = true;
window.onkeyup = e => inputState[e.key] = false;

const player = new Obj('player', Img.store['spritesheet_link'], new vec2(50, 50), new vec2(10, 10));
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
		// debugger;

		// console.log(obj.image.element);
		ctx.drawImage(obj.image.element, obj.pos.x, obj.pos.y);
		document.getElementById("root")?.append(obj.image.element);
		ctx.fillStyle = "black";
		ctx.strokeRect(
			Math.round(obj.pos.x),
			Math.round(obj.pos.y),
			Math.round(obj.size.x),
			Math.round(obj.size.y),
		);
	});
}

function getCenter() {
	return {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};
}

let refresh = 120;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
