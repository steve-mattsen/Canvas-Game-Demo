import { vec, vec2, bbox } from "./Geo";
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
		move = vec(
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
		move = vec(
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
	plyr.pos = vec(
		Math.max(0, Math.min(plyr.pos.x, Vars.canvasWidth - plyr.size.x)),
		Math.max(0, Math.min(plyr.pos.y, Vars.canvasHeight - plyr.size.y))
	)
}

let refresh = Vars.slowMode ? 15 : 59.67;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
