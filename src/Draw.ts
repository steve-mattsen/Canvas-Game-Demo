import { Img, sprt } from "./Sprites";
import { Obj } from "./Obj";
import Vars from "./Vars";
import Button from "./Button";
import { Box, Vec2 } from "./Geo";
import Input from "./Input";
import VirtualJoystick from "./VirtualJoystick";
import Colors from "./Colors";
import Game from "./Game";

export function onWindowResize() {
	let canvas = document.getElementById("game_window") as HTMLCanvasElement;
	let background = document.getElementById("background_canvas") as HTMLCanvasElement;
	let shadows = document.getElementById("shadow_canvas") as HTMLCanvasElement;
	Vars.canvasWidth = window.innerWidth / Vars.canvasScale;
	Vars.canvasHeight = window.innerHeight / Vars.canvasScale;
	Game.camera.updateDims();
	canvas.setAttribute('width', Vars.canvasWidth + '');
	canvas.setAttribute('height', Vars.canvasHeight + '');
	background.setAttribute('width', Vars.canvasWidth + '');
	background.setAttribute('height', Vars.canvasHeight + '');
	shadows.setAttribute('width', Vars.canvasWidth + '');
	shadows.setAttribute('height', Vars.canvasHeight + '');
	Vars.showBackground = true;
}
window.onresize = onWindowResize;

export default function draw() {
	let canvas = document.getElementById("game_window") as HTMLCanvasElement;
	if (canvas.getContext === undefined) {
		return;
	}
	let ctx = canvas.getContext('2d');
	if (ctx === null) {
		return;
	}
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	ctx.lineWidth = 1;

	ctx.imageSmoothingEnabled = false;
	ctx.scale(Game.camera.zoom, Game.camera.zoom)

	if (Vars.showBackground) {
		drawBackground();
	}

	let plyr = Obj.store['player'];

	drawObjects(ctx);

	if (Vars.spriteSheetMode) {
		let sprite = plyr.getAnimFrame();
		ctx.fillStyle = "red";
		ctx.fillRect(
			sprite.drawBox.x,
			sprite.drawBox.y,
			sprite.drawBox.width,
			sprite.drawBox.height,
		);
		ctx.drawImage(Img.store['spritesheet_link'].element, 0, 0)
	}

	Vars.debugMode && drawDebugInfo(ctx);

	ctx.scale(1 / Game.camera.zoom, 1 / Game.camera.zoom);
	ctx.imageSmoothingEnabled = true;

	drawControls(ctx);

	drawButtons(ctx);
}

function drawObjects(ctx: CanvasRenderingContext2D) {
	// Order draws by closeness to camera.
	let entries = Object.values(Obj.store).sort((a, b) => a.pos.y - b.pos.y);

	let cambox = Game.camera.fromOrigin();

	let fontSize = 4;
	ctx.font = `${fontSize}px Courier`;

	if (Vars.displayMode > 1) {
		drawShadows(entries);
		for (const obj of entries) {

			let sprite;
			if (Vars.displayMode < 3 || obj.animations == null) {
				// Just draw the sprite.
				sprite = obj.sprite;
			} else {
				if (Vars.displayMode < 3 || obj.animations == null) {
					// Just draw the sprite.
					sprite = obj.sprite;
				} else {
					sprite = obj.getAnimFrame();
				}
			}
			let offset = sprite.drawBox.getOrigin();
			ctx.drawImage(
				sprite.offScreenCanvas, //image
				obj.pos.x - offset.x - cambox.x, //posx
				obj.pos.y - offset.y - cambox.y - obj.z, //posy
			);
		}
	}

	if (Vars.displayMode < 4) {

		for (const obj of entries) {
			if (obj.hitBox === null) {
				continue;
			}
			let hb = obj.calcHitBox();
			hb.x -= cambox.x;
			hb.y -= cambox.y;
			// Draw points
			drawMarker(ctx, hb.x, hb.y);
			let p2 = hb.p2();
			drawMarker(ctx, p2.x, p2.y);
		}
	}

	if (Vars.displayMode !== 0 && Vars.displayMode < 4) {
		for (const obj of entries) {
			if (obj.hitBox === null) {
				continue;
			}
			let hb = obj.calcHitBox();
			// Draw box
			drawBoxOutline(ctx, hb);

		}
	}
};

function drawButtons(ctx: CanvasRenderingContext2D) {
	// Draw optional keys and states
	let button = Button.store.F6;
	let width = 50;
	let margin = 5;
	button.dimensions = new Box(
		Vars.canvasWidth - width - margin,
		margin,
		width,
		width,
		new Vec2(0, 0),
	);
	let colorKey = Number(Reflect.get(Vars, button.varKey));
	ctx.fillStyle = Colors.bg[colorKey] + "88";
	ctx.fillRect(
		button.dimensions.x,
		button.dimensions.y,
		button.dimensions.width,
		button.dimensions.height,
	);
	ctx.strokeStyle = "black";
	ctx.strokeRect(
		button.dimensions.x,
		button.dimensions.y,
		button.dimensions.width,
		button.dimensions.height,
	);
	ctx.fillStyle = Colors.fg[colorKey];
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `bold ${Math.ceil(button.dimensions.height)}px Courier`;
	ctx.fillText(
		`⤡`,
		button.dimensions.x + width / 2 - margin / 2,
		margin * 2 + button.dimensions.height / 2,
		width,
	)
}

function drawBackground() {
	let canvas = document.getElementById('background_canvas') as HTMLCanvasElement;
	if (canvas.getContext === undefined) {
		return;
	}
	let ctx = canvas.getContext('2d');
	if (ctx === null) {
		return;
	}
	let img = Img.store['grass'];
	if (!img?.size?.x || !img?.size?.y) {
		return;
	}

	let cambox = Game.camera.fromOrigin();

	let imgSize = new Vec2(
		img.size.x * Game.camera.zoom,
		img.size.y * Game.camera.zoom,
	)

	let xoffset = (cambox.x * Game.camera.zoom) % imgSize.x;
	let yoffset = (cambox.y * Game.camera.zoom) % imgSize.y;

	let backgroundRows = Math.ceil(cambox.width / img.size.x);
	let backgroundCols = Math.ceil(cambox.height / img.size.y);

	ctx.imageSmoothingEnabled = false;
	for (let i = -1; i <= backgroundRows; i++) {
		for (let j = -1; j <= backgroundCols; j++) {
			ctx.drawImage(
				img.element,
				i * imgSize.x - xoffset,
				j * imgSize.y - yoffset,
				imgSize.x,
				imgSize.y
			)
		}
	}
}

function drawMarker(ctx: CanvasRenderingContext2D, x: number, y: number, diagonal = true) {
	ctx.fillStyle = Colors.fg[0];
	ctx.lineWidth = 0.5;
	let path = new Path2D();
	let crosshairSize = 2;
	let offset = 0;
	x = x + offset;
	y = y + offset;
	if (diagonal) {
		path.moveTo(x - crosshairSize, y - crosshairSize);
		path.lineTo(x + crosshairSize, y + crosshairSize);
		path.moveTo(x - crosshairSize, y + crosshairSize);
		path.lineTo(x + crosshairSize, y - crosshairSize);
	} else {
		path.moveTo(x - crosshairSize, y);
		path.lineTo(x + crosshairSize, y);
		path.moveTo(x, y - crosshairSize);
		path.lineTo(x, y + crosshairSize);
	}
	ctx.stroke(path);
}

function drawBoxOutline(ctx: CanvasRenderingContext2D, box: Box) {
	ctx.save();
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = "black";
	ctx.strokeRect(
		box.x,
		box.y,
		box.width,
		box.height,
	);
	ctx.restore();
}

function drawDebugInfo(ctx: CanvasRenderingContext2D) {
	let entries = Object.values(Obj.store).sort((a, b) => a.pos.y - b.pos.y);
	let cambox = Game.camera.fromOrigin();
	ctx.save();
	let fontSize = 4;
	ctx.textAlign = "left";
	ctx.font = `${fontSize}px Courier`;

	// Fill the top left box.
	ctx.fillStyle = Colors.bg[0] + '88';
	ctx.fillRect(0, 0, 50, fontSize * 4);

	// Write top left text.
	ctx.fillStyle = Colors.fg[0];
	ctx.fillText(`window ${window.innerWidth}x${window.innerHeight}`,
		0, fontSize
	);
	ctx.fillText(`canvas ${Vars.canvasWidth}x${Vars.canvasHeight}`,
		0, fontSize * 2
	);
	ctx.fillText(`camera ${Game.camera.width.toFixed(1)}x${Game.camera.height.toFixed(1)}`,
		0, fontSize * 3
	);

	// Fill the top right box.
	let inputs = Object.entries(Vars.inputState).filter((k, v) => Vars.inputState[k[0]]);
	ctx.fillStyle = Colors.bg[0] + '88';
	ctx.fillRect(
		Game.camera.width - 50,
		0,
		50,
		fontSize * inputs.length * 1 + fontSize * .25,
	);

	//Write the top right text
	let count = 0;
	for (const [k, v] of inputs) {
		ctx.textAlign = "right";
		ctx.textBaseline = "hanging";
		ctx.fillStyle = Colors.fg[0];
		ctx.fillText(
			`${k} : ${v}`,
			Game.camera.width,
			count++ * fontSize,
		)
	}

	ctx.textAlign = "left";

	// Fill the bottom left box
	ctx.fillStyle = Colors.bg[0] + '88';
	let boxHeight = entries.length * fontSize;
	ctx.fillRect(
		0,
		Game.camera.height - boxHeight,
		50,
		boxHeight
	);

	count = 0;
	let plyr = Obj.store['player'];
	for (const obj of entries) {
		if (obj.hitBox !== null) {
			let hb = obj.calcHitBox();
			hb.x -= cambox.x;
			hb.y -= cambox.y;
			ctx.fillStyle = Colors.bg[0];
			if (obj.id !== 'player' && obj.calcHitBox().collidesWith(plyr.calcHitBox())) {
				ctx.fillStyle = "red";
			}
			ctx.fillRect(hb.x, hb.y, hb.width, hb.height);

			drawBoxOutline(ctx, hb);

			ctx.fillStyle = Colors.fg[0];
			ctx.textBaseline = "top";
			ctx.fillText(
				`x:${Math.round(obj.pos.x)}`,
				hb.x,
				hb.y,
				hb.width,
			);
			ctx.fillText(
				`y:${Math.round(obj.pos.y)}`,
				hb.x,
				hb.y + fontSize,
				hb.width,
			);
		}

		//Write the bottom left text.
		let text = `${obj.id}: `;
		if (obj.animations === null) {
			text += `${obj.sprite.image.id}`;
		} else {
			text += `${obj.animState} ${obj.animations[obj.animState].currentSprite}`;
		}
		ctx.fillText(
			text,
			0,
			Game.camera.height - ((1 + count++) * fontSize),
		);

		drawMarker(ctx, obj.pos.x - cambox.x, obj.pos.y - cambox.y);
		drawMarker(ctx, Game.camera.x, Game.camera.y);
		drawBoxOutline(ctx, Game.camera.fromOrigin());
		ctx.restore();
	}
}

function drawControls(ctx: CanvasRenderingContext2D) {
	ctx.save();
	ctx.globalCompositeOperation = "luminosity";
	let stick = Input.getOnscreenControl('left_stick') as VirtualJoystick;
	let box = stick.box;
	let middle = box.getCenterMiddle();
	ctx.beginPath();
	ctx.ellipse(
		middle.x,
		middle.y,
		stick.size / 2,
		stick.size / 2,
		0,
		0,
		10,
	);
	ctx.strokeStyle = Colors.fg[0] + '55';
	ctx.stroke();

	let gradient = ctx.createRadialGradient(
		middle.x,
		middle.y,
		0,
		middle.x,
		middle.y,
		stick.size / 2,
	)
	gradient.addColorStop(0, Colors.bg[1] + '88');
	gradient.addColorStop(0.99, Colors.bg[0] + '88');
	gradient.addColorStop(1.0, 'transparent');
	ctx.fillStyle = gradient;
	ctx.fillRect(
		middle.x - stick.size / 2,
		middle.y - stick.size / 2,
		stick.size,
		stick.size,
	);

	let innerStickSize = stick.size / 2;
	let innerStickPos = new Vec2(
		middle.x + stick.value.x * innerStickSize / 2,
		middle.y + stick.value.y * innerStickSize / 2,
	);
	ctx.beginPath();
	ctx.ellipse(
		innerStickPos.x,
		innerStickPos.y,
		innerStickSize / 2,
		innerStickSize / 2,
		0,
		0,
		10,
	);
	ctx.fillStyle = Colors.bg[0] + '88';
	ctx.fill();
	ctx.stroke();

	ctx.restore();
}

function drawShadows(entries: Obj[]) {

	let cambox = Game.camera.fromOrigin();
	let shadow = sprt('shadow');

	let canvas = document.getElementById("shadow_canvas") as HTMLCanvasElement;
	if (canvas.getContext === undefined) {
		return;
	}
	let ctx = canvas.getContext('2d');
	if (ctx === null) {
		return;
	}

	ctx.imageSmoothingEnabled = false;;

	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	for (const obj of entries) {
		let sprite;
		if (Vars.displayMode < 3 || obj.animations == null) {
			// Just draw the sprite.
			sprite = obj.sprite;
		} else {
			sprite = obj.getAnimFrame();
		}

		shadow.scale = sprite.drawBox.width / shadow.drawBox.width;
		let x = obj.pos.x - (shadow.drawBox.width * shadow.scale * 0.5) - 1 - cambox.x;
		let y = obj.pos.y - (shadow.drawBox.height * shadow.scale * 0.5) - 1 - cambox.y;
		ctx.drawImage(shadow.image.element,
			x * Game.camera.zoom,
			y * Game.camera.zoom,
			sprite.drawBox.width * Game.camera.zoom,
			sprite.drawBox.height * 0.5 * Game.camera.zoom,
		);
	}
}