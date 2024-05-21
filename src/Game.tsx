import { bbox, vec2 } from "./Vec2";
import { Obj } from "./Obj";
import { Img, Animation, Frame } from "./Sprites";
import "./World";

var inputState: { [id: string]: number } = {};
var debugMode = false;
var boxMode = false;

window.onkeydown = e => {
	let key = e.key.toLowerCase();
	if (['tab', 'f1', 'f2'].indexOf(key) > -1) {
		e.preventDefault();
	}
	if (!inputState[key]) {
		inputState[key] = 1;
	}
	if (inputState.f1 == 1) {
		debugMode = !debugMode;
	} else if (inputState.f2 == 1) {
		boxMode = !boxMode;
	}
}
window.onkeyup = e => {
	inputState[e.key.toLowerCase()] = 0;
}
window.onblur = e => {
	inputState = {};
}

function tick() {
	Object.keys(inputState).forEach(v => {
		if (inputState[v] > 0) {
			inputState[v] = inputState[v] + 1;
		}
	});
	let move = new vec2(
		(inputState.arrowright || inputState.d ? 1 : 0) - (inputState.arrowleft || inputState.a ? 1 : 0),
		(inputState.arrowdown || inputState.s ? 1 : 0) - (inputState.arrowup || inputState.w ? 1 : 0)
	);
	let speed = inputState.shift ? 8 : 3;
	//Normalize
	move = move.normalize();
	let plyr = Obj.store['player'];
	plyr.animState = 'idle';
	if (move.length() > 0) {
		plyr.animState = inputState.shift ? 'run' : 'walk'
	}
	if (move.x > 0) {
		plyr.animState += "_right";
	} else if (move.x < 0) {
		plyr.animState += "_left";
	} else if (move.y > 0) {
		plyr.animState += "_down";
	} else if (move.y < 0) {
		plyr.animState += "_up";
	}
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
			Math.floor(obj.pos.x), //posx
			Math.floor(obj.pos.y), //posy
			frame.subImg.getWidth(), //width
			frame.subImg.getHeight(), //height
		);
		ctx.fillStyle = "black";
		if (boxMode) {
			ctx.strokeRect(
				Math.floor(obj.pos.x),
				Math.floor(obj.pos.y),
				Math.floor(obj.size.x),
				Math.floor(obj.size.y),
			);
		}
		if (!debugMode) {
			return;
		}
		ctx.font = "18px Roboto"
		ctx.fillText(
			Math.round(obj.pos.x) + ", " + Math.round(obj.pos.y),
			obj.pos.x,
			obj.pos.y,
		);
		ctx.fillText(
			obj.animState + " " + obj.animations[obj.animState].currentFrame.toString(),
			obj.pos.x,
			obj.pos.y + obj.size.y + 24,
		)
		ctx.fillText(`
			window height: ${window.innerHeight}\n
			window width: ${window.innerWidth}`,
			0,18
		);
		let count = 0;
		ctx.textAlign = "right";
		ctx.textBaseline = "top";
		Object.keys(inputState).forEach(v => {
			if (!inputState[v]) {
				return;
			}
			ctx.fillText(
				`${v} : ${inputState[v]}`,
				window.innerWidth,
				count++ * 18,
			)
		});
	});
}

let refresh = 59.67;
// refresh = 15;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
