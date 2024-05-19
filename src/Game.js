import { vec2 } from "./Vec2";
var objStore = {};

var inputState = KeyboardEvent;

window.onkeydown = e => inputState[e.key] = true;
window.onkeyup = e => inputState[e.key] = false;

class gameObj {
	color = "#000000";
	size = new vec2(50, 50);
	pos = new vec2(10, 10);
	velocity = new vec2(0, 0);
	name = "blah";
	constructor(args = {}) {
		Object.keys(args).forEach(v => this[v] = args[v])
	}
}

objStore['redBox'] = new gameObj({ color: "red" });
objStore['box'] = new gameObj();

function tick() {
	let move = new vec2(
		(inputState.ArrowRight ?? 0) - (inputState.ArrowLeft ?? 0),
		(inputState.ArrowDown ?? 0) - (inputState.ArrowUp ?? 0)
	);
	let speed = inputState.Shift ? 4 : 2;
	//Normalize
	move = move.normalize();
	objStore['box'].pos.x += (move.x ?? 0) * speed;
	objStore['box'].pos.y += (move.y ?? 0) * speed;
	objStore['box'].pos.x %= window.innerWidth;
	objStore['box'].pos.y %= window.innerHeight;
}
function draw() {
	const canvas = document.getElementById("game_window");
	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight);
	if (canvas.getContext == undefined) {
		return;
	}
	let ctx = canvas.getContext('2d');
	Object.keys(objStore).forEach(v => {
		let obj = objStore[v];
		ctx.fillStyle = obj.color;
		ctx.fillRect(obj.pos.x, obj.pos.y, obj.size.x, obj.size.y);
	});
}

function getCenter() {
	return {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};
}

window.onresize = draw;
let drawThread = setInterval(draw, 1000 / 60);
let gameThread = setInterval(tick, 1000 / 60);