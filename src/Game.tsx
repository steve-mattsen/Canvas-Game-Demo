import { vec2, bbox } from "./Vec2";
import { Obj } from "./Obj";
import Vars from "./Vars";
import draw from "./Draw";
import Button from "./Button";
import "./World";

window.onkeydown = e => {
	let key = e.key.toLowerCase();
	if (['tab', 'f1', 'f2', 'f3', 'f4', 'f5', 'f10'].indexOf(key) > -1) {
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
		Vars.slowMode = !Vars.slowMode;
		clearTimeout(drawThread)
		clearTimeout(gameThread)
		let refresh = Vars.slowMode ? 15 : 59.67;
		drawThread = setInterval(draw, 1000 / refresh);
		gameThread = setInterval(tick, 1000 / refresh);
	} else if (Vars.inputState.f4) {
		Vars.showBackground = !Vars.showBackground;
	} else if (Vars.inputState.f5) {
		Vars.showButtons = !Vars.showButtons;
	} else if (Vars.inputState.f9 === 1) {
		Vars.debugMode = !Vars.debugMode;
	}
}
window.onmousedown = (e) => {
	let point = new vec2(e.clientX, e.clientY);
	clickOrTouchStart(point);
}
window.onmousemove = (e) => {
	if (Vars.mouseMove === null) {
		return;
	}
	Vars.mouseMove = new vec2(e.clientX, e.clientY);
}
window.onmouseup = (e) => {
	Vars.mouseMove = null;
}

window.ontouchstart = (e) => {
	let point = new vec2(e.touches[0].clientX, e.touches[0].clientY);
	clickOrTouchStart(point);
}
window.ontouchmove = (e) => {
	if (Vars.mouseMove === null) {
		return;
	}
	Vars.mouseMove = new vec2(e.touches[0].clientX, e.touches[0].clientY);
}
window.onkeyup = e => {
	Vars.inputState[e.key.toLowerCase()] = 0;
}
window.onblur = e => {
	Vars.inputState = {};
}

function clickOrTouchStart(point: vec2) {
	for (const button of Button.store) {
		if (button.dimensions.contains(point)) {
			button.click();
			return;
		}
	}
	Vars.mouseMove = point;
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
		speed = Vars.inputState.shift ? runSpeed : walkSpeed;
	}

	move = move.normalize();

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
