import { vec, Vec2, Box, Line } from "./Geo";
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
	let runSpeed = 2;
	let move: Vec2;
	let speed = 0;
	if (gp?.axes[0] || gp?.axes[1]) {
		move = vec(
			Number(gp?.axes[0]),
			Number(gp?.axes[1])
		);
		speed = move.length() * runSpeed;
	} else if (Vars.mouseMove !== null) {
		let line = new Line(
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
		move = line.normal().p2();
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

	if (Vars.inputState[" "] === 2 && plyr.z === 0) {
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
	let preMoveHitBox = plyr.calcHitBox();
	let postMoveHitBox = plyr.calcHitBox();
	postMoveHitBox.x += move.x * speed;
	postMoveHitBox.y += move.y * speed;

	for (const [key, obj] of Object.entries(Obj.store)) {
		if (key === 'player') {
			continue;
		}
		let ohb = obj.calcHitBox();
		if (postMoveHitBox.collidesWith(ohb)) {
			move = preMoveHitBox.adjustForCollision(ohb, move, speed);
			speed = 1;
		}
	}
	plyr.pos.x += move.x * speed;
	plyr.pos.y += move.y * speed;

	let hb = plyr.calcHitBox();
	let p2 = hb.p2();
	let cameraLimit = new Vec2(
		(Vars.canvasWidth / Vars.cameraScale),
		(Vars.canvasHeight / Vars.cameraScale)
	)

	if (hb.x < 0) {
		plyr.pos.x = plyr.hitBox.origin.x;
	} else if (p2.x > cameraLimit.x) {
		plyr.pos.x = cameraLimit.x - plyr.hitBox.origin.x;
	}
	if (hb.y < 0) {
		plyr.pos.y = plyr.hitBox.origin.y;
	} else if (p2.y > cameraLimit.y) {
		plyr.pos.y = cameraLimit.y;
	}
}

let refresh = Vars.slowMode ? 15 : 59.67;
let drawThread = setInterval(draw, 1000 / refresh);
let gameThread = setInterval(tick, 1000 / refresh);
