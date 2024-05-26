import { vec, Vec2, Box } from "./Geo";
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

	let walkSpeed = 1;
	let runSpeed = 3;
	let move: Vec2;
	let speed = 0;
	if (gp?.axes[0] || gp?.axes[1]) {
		move = vec(
			Number(gp?.axes[0]),
			Number(gp?.axes[1])
		);
		speed = move.length() * runSpeed;
	} else if (Vars.mouseMove !== null) {
		let line = new Box(
			plyr.pos.x,
			plyr.pos.y,
			Vars.mouseMove.x - plyr.pos.x,
			Vars.mouseMove.y - plyr.pos.y
		);
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
		plyr.zVelocity = 3.5;
	}
	plyr.z += plyr.zVelocity;
	plyr.zVelocity -= 0.25;
	if (plyr.z < 0) {
		plyr.z = 0;
		plyr.zVelocity = 0;
	}

	let previousAnim = plyr.animState;
	if (move.length() === 0) {
		plyr.animState = plyr.animState.replace(/(.*)_/, 'idle_');
	} else if (speed > walkSpeed) {
		plyr.animState = plyr.animState.replace(/(.*)_/, 'run_');
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
		plyr.animations[plyr.animState].currentSprite = 0;
	}
	plyr.tickAnimFrame();
	plyr.pos.x += move.x * speed;
	plyr.pos.y += move.y * speed;
	let hb = plyr.getAbsoluteHitbox();
	if (hb.x < 0) {
		plyr.pos.x = hb.origin.x;
	} else if (hb.p2().x > Vars.canvasWidth) {
		plyr.pos.x = Vars.canvasWidth - hb.width + hb.origin.x;
	}
	if (hb.y < 0) {
		plyr.pos.y = hb.origin.y;
	} else if (hb.p2().y > Vars.canvasHeight) {
		plyr.pos.y = Vars.canvasHeight - hb.height + hb.origin.y;
	}
}

let refresh = Vars.slowMode ? 15 : 59.67;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
