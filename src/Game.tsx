import { vec, Vec2, Line } from "./Geo";
import { Obj } from "./Obj";
import Vars from "./Vars";
import draw, { onWindowResize } from "./Draw";
import "./World";
import VirtualJoystick from "./VirtualJoystick";
import Input from "./Input";
import buildWorld from "./World";
import { Camera } from "./Camera";

export default class Game {
	static tickCount = 0;
	static startTime = Date.now();
	static thread: NodeJS.Timeout;
	static camera = new Camera(0, 0, 0, 0, { x: 'center', y: 'middle' }, 3);
	static init() {
		Game.camera.x = Game.camera.width / 2;
		Game.camera.y = Game.camera.height / 2;
		new VirtualJoystick('left_stick');

		buildWorld();

		onWindowResize();

		Game.thread = setInterval(Game.tick, 1000 / 60);
	}
	static tick() {
		Game.tickCount++;
		let plyr = Obj.store['player'];

		let gp = navigator.getGamepads()[0];
		Object.keys(Vars.inputState).forEach(v => {
			if (Vars.inputState[v] > 0) {
				Vars.inputState[v] = Vars.inputState[v] + 1;
			}
		});

		Input.moveCamera();

		let walkSpeed = 1;
		let runSpeed = 2;
		let move: Vec2;
		let speed = 0;
		let stick = Input.getOnscreenControl('left_stick') as VirtualJoystick;
		if (gp?.axes[0] || gp?.axes[1]) {
			move = vec(
				Number(gp?.axes[0]),
				Number(gp?.axes[1])
			);
			speed = move.length() * runSpeed;
		} else if (Vars.mouseMove !== null) {
			let x = window.innerWidth / 2;
			let y = window.innerHeight / 2;
			let line = new Line(
				x,
				y,
				Vars.mouseMove.x,
				Vars.mouseMove.y
			);
			if (line.length() > runSpeed) {
				speed = runSpeed;
			} else {
				speed = line.length();
			}
			move = line.normal();
		} else if (stick.value.x !== 0 || stick.value.y !== 0) {
			move = stick.value;
			speed = runSpeed * stick.value.length();
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
		Vars.move = move;

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
		} else if (speed > 0) {
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
			if (obj.hitBox === null) {
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
			(Vars.canvasWidth / Game.camera.zoom),
			(Vars.canvasHeight / Game.camera.zoom)
		)

		if (Vars.oneScreenMode == true) {
			if (hb.x < 0) {
				plyr.pos.x = plyr.hitBox.x;
			} else if (p2.x > cameraLimit.x) {
				plyr.pos.x = cameraLimit.x - plyr.hitBox.x;
			}
			if (hb.y < 0) {
				plyr.pos.y = plyr.hitBox.y;
			} else if (p2.y > cameraLimit.y) {
				plyr.pos.y = cameraLimit.y;
			}
		}

		Game.camera.x = plyr.pos.x;
		Game.camera.y = plyr.pos.y
		requestAnimationFrame(draw);
	}
}