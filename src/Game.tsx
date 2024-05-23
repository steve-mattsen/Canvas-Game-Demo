import { vec2, bbox } from "./Vec2";
import { Obj } from "./Obj";
import Vars from "./Vars";
import draw from "./Draw";
import Button from "./Button";
import "./World";

Button.store['F3'].click = () => {
	Vars.slowMode = !Vars.slowMode;
	clearTimeout(drawThread)
	clearTimeout(gameThread)
	let refresh = Vars.slowMode ? 15 : 59.67;
	drawThread = setInterval(draw, 1000 / refresh);
	gameThread = setInterval(tick, 1000 / refresh);
}

window.onkeydown = e => {
	Vars.debugMode && console.log(e);
	let key = e.key.toLowerCase();
	if (['tab', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10'].indexOf(key) > -1) {
		e.preventDefault();
	}
	if (!Vars.inputState[key]) {
		Vars.inputState[key] = 1;
	}
	if (Vars.inputState.f1 === 1) {
		Vars.displayMode = (++Vars.displayMode % 5);
	} else if (Vars.inputState.f2 === 1) {
		Vars.spriteSheetMode = !Vars.spriteSheetMode;
	} else if (Vars.inputState.f3 === 1) {
		Button.store['F3'].click();
	} else if (Vars.inputState.f4) {
		Vars.showBackground = !Vars.showBackground;
	} else if (Vars.inputState.f5) {
		Vars.showButtons = !Vars.showButtons;
	} else if (Vars.inputState.f6) {
		Button.store['F6'].click();
	} else if (Vars.inputState.f9 === 1) {
		Vars.debugMode = !Vars.debugMode;
	}
}
window.onmousedown = (e) => {
	Vars.debugMode && console.log(e.type, e);
	let point = new vec2(e.clientX, e.clientY);
	clickOrTouchStart(point);
}
window.onmousemove = (e) => {
	// Vars.debugMode && console.log(e.type, e);
	if (Vars.mouseMove === null) {
		return;
	}
	Vars.mouseMove = new vec2(e.clientX, e.clientY);
}
window.onmouseup = (e) => {
	Vars.debugMode && console.log(e.type, e);
	clickOrTouchEnd();
	e.preventDefault();
}

window.ontouchstart = (e) => {
	Vars.debugMode && console.log(e.type, e);
	let point = new vec2(e.touches[0].clientX, e.touches[0].clientY);
	clickOrTouchStart(point);
}
window.ontouchmove = (e) => {
	Vars.debugMode && console.log(e.type, e);
	if (Vars.mouseMove === null) {
		return;
	}
	Vars.mouseMove = new vec2(e.touches[0].clientX, e.touches[0].clientY);
}
window.ontouchend = (e) => {
	Vars.debugMode && console.log(e.type, e);
	clickOrTouchEnd();
	e.preventDefault();
}
window.onkeyup = e => {
	Vars.debugMode && console.log(e.type, e);
	Vars.inputState[e.key.toLowerCase()] = 0;
	e.preventDefault();
}
window.onblur = e => {
	Vars.debugMode && console.log(e.type, e);
	Vars.inputState = {};
}

function clickOrTouchStart(point: vec2) {
	if (Vars.inputState['mouseDown'] > 0) {
		return;
	}
	Vars.inputState['mouseDown'] = 1;
	for (const [key, button] of Object.entries(Button.store)) {
		if (!Vars.showButtons && button.varKey != "showButtons") {
			continue;
		}
		if (button.dimensions.contains(point)) {
			button.click();
			return;
		}
	}
	Vars.mouseMove = point;
}

function clickOrTouchEnd() {
	Vars.inputState['mouseDown'] = 0;
	Vars.mouseMove = null;
}

function tick() {
	let plyr = Obj.store['player'];

	let gp = navigator.getGamepads()[0];
	Object.keys(Vars.inputState).forEach(v => {
		if (Vars.inputState[v] > 0) {
			Vars.inputState[v] = Vars.inputState[v] + 1;
		}
	});

	let walkSpeed = 4;
	let runSpeed = 8;
	let move: vec2;
	let speed = 0;
	if (gp?.axes[0] || gp?.axes[1]) {
		move = new vec2(
			Number(gp?.axes[0]),
			Number(gp?.axes[1])
		);
		speed = move.length() * runSpeed;
	} else if (Vars.mouseMove !== null) {
		let line = new bbox(plyr.pos, Vars.mouseMove);
		if (line.length() > runSpeed) {
			speed = runSpeed;
		} else {
			speed = line.length();
		}
		move = line.normalize();
	} else {
		let moveX = (Vars.inputState.arrowright || Vars.inputState.d ? 1 : 0)
			- (Vars.inputState.arrowleft || Vars.inputState.a ? 1 : 0);
		let moveY = (Vars.inputState.arrowdown || Vars.inputState.s ? 1 : 0)
			- (Vars.inputState.arrowup || Vars.inputState.w ? 1 : 0);
		move = new vec2(
			moveX,
			moveY
		);
		speed = runSpeed;
	}

	move = move.normalize();

	if (Vars.inputState[" "] == 2 && plyr.z == 0) {
		plyr.zVelocity = 15;
	}
	plyr.z += plyr.zVelocity-- * 0.5;
	if (plyr.z < 0) {
		plyr.z = 0;
		plyr.zVelocity = 0;
	}

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

let refresh = Vars.slowMode ? 15 : 59.67;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
