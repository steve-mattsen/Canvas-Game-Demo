import { vec2 } from "./Vec2";
import { Obj } from "./Obj";
import { Img } from "./Sprites";
import "./World";

var inputState: { [id: string]: number } = {};
var debugMode = false;
var boxMode = 0;
var spriteSheetMode = false;
var slowMode = false;

window.onkeydown = e => {
	let key = e.key.toLowerCase();
	if (['tab', 'f1', 'f2', 'f3', 'f4', 'f10'].indexOf(key) > -1) {
		e.preventDefault();
	}
	if (!inputState[key]) {
		inputState[key] = 1;
	}
	if (inputState.f1 === 1) {
		boxMode = (++boxMode % 3);
	} else if (inputState.f2 === 1) {
		spriteSheetMode = !spriteSheetMode;
	} else if (inputState.f3 === 1) {
		slowMode = !slowMode;
		clearTimeout(drawThread)
		clearTimeout(gameThread)
		let refresh = slowMode ? 15 : 59.67;
		drawThread = setInterval(draw, 1000 / refresh);
		gameThread = setInterval(tick, 1000 / refresh);
	} else if (inputState.f10 === 1) {
		debugMode = !debugMode;
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

	let previousAnim = plyr.animState;
	if (move.length() > 0) {
		plyr.animState = plyr.animState.replace(/(.*)_/, inputState.shift ? 'run_' : 'walk_');
	} else {
		plyr.animState = plyr.animState.replace(/(.*)_/, 'idle_');
	}
	if (move.x > 0) {
		plyr.animState = plyr.animState.replace(/_.*/, "_right");
	} else if (move.x < 0) {
		plyr.animState = plyr.animState.replace(/_.*/, "_left");
	} else if (move.y > 0) {
		plyr.animState = plyr.animState.replace(/_.*/, "_down");
	} else if (move.y < 0) {
		plyr.animState = plyr.animState.replace(/_.*/, "_up");
	}
	if (previousAnim !== plyr.animState) {
		plyr.animations[plyr.animState].currentFrame = 0;
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
	let canvas = document.getElementById("game_window") as HTMLCanvasElement;
	canvas.setAttribute('width', window.innerWidth + '');
	canvas.setAttribute('height', window.innerHeight + '');
	if (canvas.getContext === undefined) {
		return;
	}
	let ctx = canvas.getContext('2d');
	if (ctx === null) {
		return;
	}

	let plyr = Obj.store['player'];

	if (spriteSheetMode) {
		let frame = plyr.getAnimFrame();
		ctx.fillStyle = "red";
		ctx.fillRect(
			frame.subImg.topLeft.x,
			frame.subImg.topLeft.y,
			frame.subImg.getWidth(),
			frame.subImg.getHeight(),
		);
		ctx.drawImage(Img.store['spritesheet_link'].element, 0, 0)
	}

	ctx.fillStyle = "black";
	if (boxMode) {
		ctx.fillRect(
			Math.floor(plyr.pos.x),
			Math.floor(plyr.pos.y),
			Math.ceil(plyr.size.x),
			Math.ceil(plyr.size.y),
		);
	}

	Object.keys(Obj.store).forEach(v => {
		let obj = Obj.store[v];

		let frame = obj.getAnimFrame();

		if (!(obj.id === 'player' && boxMode === 1)) {
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
		}
		if (!debugMode) {
			return;
		}
		ctx.font = "18px Roboto"
		ctx.fillText(
			Math.round(obj.pos.x) + ", " + Math.round(obj.pos.y),
			obj.pos.x,
			obj.pos.y - 2,
		);
		ctx.fillText(
			obj.animState + " " + obj.animations[obj.animState].currentFrame.toString(),
			obj.pos.x,
			obj.pos.y + obj.size.y + 18,
		)
		ctx.fillText(`
			window height: ${window.innerHeight}\n
			window width: ${window.innerWidth}`,
			0, 18
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

	drawButtons(ctx);
}

function drawButtons(ctx: CanvasRenderingContext2D) {
	// Draw optional keys and states
	let modes = [
		{
			key: 'f1',
			var: boxMode,
			title: 'player',
		}, {
			key: 'f2',
			var: spriteSheetMode,
			title: 'spritesheet',
		}, {
			key: 'f3',
			var: slowMode,
			title: 'slow'
		}, {
			key: 'f10',
			var: debugMode,
			title: 'debug'
		}
	]
	modes.reverse();
	modes.forEach((v, i) => {
		let buttonWidth = 100;
		let buttonHeight = 24;
		let margin = 5;
		let buttonX = window.innerWidth - buttonWidth - margin;
		let buttonY = window.innerHeight - (buttonHeight + margin) * (i + 1);
		ctx.fillStyle = v.var ? (v.var === 2 ? "gray" : "black") : "white";
		ctx.fillRect(
			buttonX,
			buttonY,
			buttonWidth,
			buttonHeight,
		)
		ctx.strokeStyle = "black";
		ctx.strokeRect(
			buttonX,
			buttonY,
			buttonWidth,
			buttonHeight,
		)
		ctx.fillStyle = v.var ? (v.var === 2 ? "black" : "white") : "black";
		ctx.textAlign = "left";
		ctx.font = `${buttonHeight / 1.5}px Roboto`;
		ctx.fillText(
			`${v.key}: ${v.title}`,
			buttonX + margin,
			buttonY + buttonHeight / 1.5,
			buttonWidth,
		)
	});

}

let refresh = slowMode ? 15 : 59.67;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
