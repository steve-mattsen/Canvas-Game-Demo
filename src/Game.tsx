import { vec, Vec2, Line, Box } from "./Geo";
import { Obj } from "./Obj";
import Vars from "./Vars";
import draw, { onWindowResize } from "./Draw";
import "./World";
import VirtualJoystick from "./VirtualJoystick";
import Input from "./Input";
import buildWorld from "./World";
import { Camera } from "./Camera";
import { Img, Sprite, SpriteSheet } from "./Sprites";

function mobileAndTabletCheck() {
	let check = false;
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
	return check;
};

export default class Game {
	static tickCount = 0;
	static startTime = Date.now();
	static thread: NodeJS.Timeout;
	static camera = new Camera(0, 0, 0, 0, { x: 'center', y: 'middle' }, 4);
	static screen = new Box(0, 0, window.innerWidth, window.innerHeight);
	static backdrop: Sprite;
	static mobile = mobileAndTabletCheck();
	static tileSet: SpriteSheet;
	static init() {
		Game.camera.x = Game.camera.width / 2;
		Game.camera.y = Game.camera.height / 2;
		new VirtualJoystick('left_stick', { x: 'left', y: 'bottom' });
		new VirtualJoystick('right_stick', { x: 'right', y: 'bottom' });

		this.tileSet = new SpriteSheet('randomtextures', 32, 32, 30);
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

		if (move.length() == 0) {
			Input.moveCamera();
		} else {
			Game.camera.x = plyr.pos.x;
			Game.camera.y = plyr.pos.y;
		}

		Game.tickNPCs();

		requestAnimationFrame(draw);
	}

	static tickNPCs() {
		for (const o of Object.values(Obj.store)) {
			o.act();
		}
	}
}