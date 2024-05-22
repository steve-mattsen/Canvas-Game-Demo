import { vec2 } from "./Vec2";
import { Obj } from "./Obj";
import { Img } from "./Sprites";
import "./World";

var inputState: { [id: string]: number } = {};
var debugMode = false;
var boxMode = 0; // 0 = points, 1 = box, 2 = box with sprite, 3 = just the sprite
var spriteSheetMode = false;
var slowMode = false;
var showButtons = true;
var showBackground = false;

window.onkeydown = e => {
	let key = e.key.toLowerCase();
	if (['tab', 'f1', 'f2', 'f3', 'f4', 'f5', 'f10'].indexOf(key) > -1) {
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
	} else if (inputState.f4) {
		showBackground = !showBackground;
	}else if (inputState.f5) {
		showButtons = !showButtons;
	} else if (inputState.f9 === 1) {
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
	let gp = navigator.getGamepads()[0];
	Object.keys(inputState).forEach(v => {
		if (inputState[v] > 0) {
			inputState[v] = inputState[v] + 1;
		}
	});

	let walkSpeed = 4;
	let runSpeed = 8;
	let move: vec2;
	let speed: number;
	if (gp?.axes[0] || gp?.axes[1]) {
		move = new vec2(
			Number(gp?.axes[0]), 
			Number(gp?.axes[1])
		);
		speed = move.length() * runSpeed;
	} else {
		let moveX = (inputState.arrowright || inputState.d ? 1:0) - (inputState.arrowleft || inputState.a ?1:0);
		let moveY = (inputState.arrowdown || inputState.s ? 1 : 0) - (inputState.arrowup || inputState.w ? 1 : 0);
		move = new vec2(
			moveX,
			moveY
		);
		speed = inputState.shift ? runSpeed : walkSpeed;
	}

	move = move.normalize();

	let plyr = Obj.store['player'];
	let previousAnim = plyr.animState;
	if (move.length() === 0) {
		plyr.animState = plyr.animState.replace(/(.*)_/, 'idle_');
	} else if (speed > walkSpeed) {
		plyr.animState = plyr.animState.replace(/(.*)_/, 'run_');
	} else {
		plyr.animState = plyr.animState.replace(/(.*)_/, 'walk_');
	}
	if (move.x >= 0.5) {
		plyr.animState = plyr.animState.replace(/_.*/, "_right");
	} else if (move.x <= -0.5) {
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
	plyr.pos.x += move.x * speed;
	plyr.pos.y += move.y * speed;
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

	if (showBackground) {
		drawBackground(ctx);
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

	drawObjects(ctx);

	if (showButtons) {
		drawButtons(ctx);
	}
}

function drawObjects(ctx: CanvasRenderingContext2D) {
	Object.keys(Obj.store).forEach(v => {
		let obj = Obj.store[v];

		let frame = obj.getAnimFrame();

		if (boxMode < 3) {
			// Draw points
			ctx.fillStyle = 'black';
			let pointSize = 6;
			ctx.fillRect(
				Math.floor(obj.pos.x),
				Math.floor(obj.pos.y),
				pointSize,
				pointSize,
			)
			ctx.fillRect(
				Math.floor(obj.pos.x + obj.size.x - pointSize),
				Math.floor(obj.pos.y + obj.size.y - pointSize),
				pointSize,
				pointSize,
			)
		}

		if (boxMode === 1 || boxMode === 2) {
			// Draw box
			ctx.fillStyle = "black";
			ctx.strokeRect(
				Math.floor(obj.pos.x),
				Math.floor(obj.pos.y),
				Math.ceil(obj.size.x),
				Math.ceil(obj.size.y),
			);
		}

		if (boxMode === 2 || boxMode === 3) {
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
		ctx.save();
		ctx.font = "18px Courier"
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
		ctx.fillText(`window ${window.innerHeight}x${window.innerWidth}`,
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
		ctx.restore();
	});
}

function drawButtons(ctx: CanvasRenderingContext2D) {
	// Draw optional keys and states
	let modes = [
		{
			key: 'F1',
			var: boxMode,
			title: 'Player',
		}, {
			key: 'F2',
			var: spriteSheetMode,
			title: 'Spritesheet',
		}, {
			key: 'F3',
			var: slowMode,
			title: 'Slow'
		}, {
			key: 'F4',
			var: showBackground,
			title: "Background",
		}, {
			key: 'F5',
			var: showButtons,
			title: "Buttons",
		}, {
			key: 'F9',
			var: debugMode,
			title: 'Debug'
		}
	]
	modes.reverse();
	modes.forEach((v, i) => {
		let buttonWidth = Math.max(70, Math.ceil(window.innerWidth * 0.2));
		let buttonHeight = Math.ceil(buttonWidth * .15);
		let margin = Math.ceil(buttonHeight * .2);
		let buttonX = window.innerWidth - buttonWidth - margin;
		let buttonY = window.innerHeight - (buttonHeight + margin) * (i + 1);
		let colors = [
			"#000000",
			"#ffffff",
			"#888888",
		]
		ctx.fillStyle = colors[v.var ? (v.var === 2 ? 2 : 0) : 1] + "88";
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
		ctx.fillStyle = colors[v.var ? (v.var === 2 ? 0 : 1) : 0];
		ctx.textAlign = "left";
		ctx.font = `${Math.ceil(buttonHeight * .75)}px Courier`;
		ctx.fillText(
			`${v.key} ${v.title}`,
			buttonX + margin,
			buttonY + Math.ceil(buttonHeight / 2) + margin,
			buttonWidth - margin * 2,
		)
	});

}

function drawBackground(ctx: CanvasRenderingContext2D) {
	let img = Img.store['grass'];
	if (!img?.size?.x || !img?.size?.y) {
		return;
	}
	for(let yi = 0; yi * img.size.y < window.innerHeight; yi++) {
		for(let xi = 0; xi * img.size.x < window.innerWidth; xi++) {
			ctx.drawImage(
				img.element, 
				xi * img.size.x,
				yi * img.size.y,
			)
		}
	}
}

let refresh = slowMode ? 15 : 59.67;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
