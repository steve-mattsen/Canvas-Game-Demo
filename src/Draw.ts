import { Img, sprt } from "./Sprites";
import { Obj } from "./Obj";
import Vars from "./Vars";
import Button from "./Button";
import { Box, Vec2 } from "./Geo";
import Input, { OnScreenControl } from "./Input";
import VirtualJoystick from "./VirtualJoystick";
import Colors from "./Colors";
import Game from "./Game";

export function onWindowResize() {
	Game.screen.width = window.innerWidth;
	Game.screen.height = window.innerHeight;
	Vars.canvasWidth = Game.screen.width / Vars.canvasScale;
	Vars.canvasHeight = Game.screen.height / Vars.canvasScale;
	Game.camera.updateDims();
	let canvases = ['game_window', 'background_canvas', 'shadow_canvas', 'controls_canvas'];
	for (const canvasID of canvases) {
		let canvas = document.getElementById(canvasID) as HTMLCanvasElement;
		canvas.setAttribute('width', Vars.canvasWidth + '');
		canvas.setAttribute('height', Vars.canvasHeight + '');
	}
	for (const input of Object.values(Input.onscreenControls)) {
		input.attach();
	}
	Game.backdrop = sprt('grass').toBackdrop();
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
		document.getElementById('background_canvas').hidden = false;
		drawBackground();
	} else {
		document.getElementById('background_canvas').hidden = true;
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

	let uiCanvas = document.getElementById('controls_canvas') as HTMLCanvasElement;
	let uiCtx = uiCanvas.getContext("2d");

	uiCtx.clearRect(0, 0, Vars.canvasWidth, Vars.canvasHeight);

	drawControls(uiCtx);

	drawButtons(uiCtx);
}

function drawObjects(ctx: CanvasRenderingContext2D) {
	let cambox = Game.camera.fromOrigin();
	let clipbox = Game.camera.clone();
	clipbox.x -= clipbox.width;
	clipbox.y -= clipbox.height;
	clipbox.width *= 2;
	clipbox.height *= 2;

	// Don't draw objects far from the camera.
	let entries = Object.values(Obj.store).filter(v => {
		return clipbox.contains(v.pos);
	});
	// Order draws by closeness to camera.
	entries.sort((a, b) => a.pos.y - b.pos.y);


	let fontSize = 5;
	ctx.font = `bold ${fontSize}px Courier`;

	if (Vars.displayMode > 1) {
		document.getElementById('shadow_canvas').hidden = false;
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
				sprite.bitmap, //image
				obj.pos.x - offset.x - cambox.x, //posx
				obj.pos.y - offset.y - cambox.y - obj.z, //posy
			);
		}
	} else {
		document.getElementById('shadow_canvas').hidden = true;
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
			hb.x -= cambox.x;
			hb.y -= cambox.y;
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
	ctx.fillStyle = Colors.bg[colorKey] + "ff";
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
	let ctx = canvas.getContext("2d");
	let backdrop = Game.backdrop;

	ctx.clearRect(0, 0, Game.camera.width * Game.camera.zoom, Game.camera.height * Game.camera.zoom);

	let imgSize = {
		x: backdrop.image.size.x * Game.camera.zoom,
		y: backdrop.image.size.y * Game.camera.zoom,
	};

	canvas.setAttribute('style', `
		background-size: ${imgSize.x}px ${imgSize.y}px;
		background-position-x: ${-Game.camera.x * Game.camera.zoom}px;
		background-position-y: ${-Game.camera.y * Game.camera.zoom}px;
	`);


	let cambox = Game.camera.fromOrigin();

	let whichFrame = (Game.tickCount % 30 >= 15 ? 1 : 0);

	let tile = Game.tileSet.sprites[1 + whichFrame][8];

	let center = new Vec2(-50, -50);

	ctx.imageSmoothingEnabled = false;

	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			ctx.drawImage(
				tile.bitmap,
				center.x - (i * tile.drawBox.width * Game.camera.zoom) - (cambox.x * Game.camera.zoom),
				center.y - (j * tile.drawBox.height * Game.camera.zoom) - (cambox.y * Game.camera.zoom),
				tile.drawBox.width * Game.camera.zoom,
				tile.drawBox.height * Game.camera.zoom,
			)
			ctx.drawImage(
				tile.bitmap,
				center.x - (i * tile.drawBox.width * Game.camera.zoom) - (cambox.x * Game.camera.zoom),
				center.y + (j * tile.drawBox.height * Game.camera.zoom) - (cambox.y * Game.camera.zoom),
				tile.drawBox.width * Game.camera.zoom,
				tile.drawBox.height * Game.camera.zoom,
			)
			ctx.drawImage(
				tile.bitmap,
				center.x + (i * tile.drawBox.width * Game.camera.zoom) - (cambox.x * Game.camera.zoom),
				center.y - (j * tile.drawBox.height * Game.camera.zoom) - (cambox.y * Game.camera.zoom),
				tile.drawBox.width * Game.camera.zoom,
				tile.drawBox.height * Game.camera.zoom,
			)
			ctx.drawImage(
				tile.bitmap,
				center.x + (i * tile.drawBox.width * Game.camera.zoom) - (cambox.x * Game.camera.zoom),
				center.y + (j * tile.drawBox.height * Game.camera.zoom) - (cambox.y * Game.camera.zoom),
				tile.drawBox.width * Game.camera.zoom,
				tile.drawBox.height * Game.camera.zoom,
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
	ctx.font = `bold ${fontSize}px Courier`;

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
				`${Math.round(obj.pos.x)}`,
				hb.x,
				hb.y,
				hb.width,
			);
			ctx.fillText(
				`${Math.round(obj.pos.y)}`,
				hb.x,
				hb.y + fontSize,
				hb.width,
			);
		}

		drawMarker(ctx, obj.pos.x - cambox.x, obj.pos.y - cambox.y);
		ctx.restore();
	}
}

function drawControls(ctx: CanvasRenderingContext2D) {
	let sticks = Game.mobile ? ['left_stick', 'right_stick'] : [];

	ctx.fillStyle = Colors.bg[4] + '22';
	ctx.beginPath();
	for (const name of sticks) {
		// Draw outer circle
		let stick = Input.getOnscreenControl(name) as VirtualJoystick;
		let box = stick.box;
		let middle = box.getCenterMiddle();
		let radius = stick.size.x / 2;

		let grad = ctx.createRadialGradient(
			middle.x,
			middle.y,
			0,
			middle.x,
			middle.y,
			radius,
		)
		grad.addColorStop(0.66, Colors.bg[4] + 'ff');
		grad.addColorStop(1, Colors.bg[4] + '00');
		ctx.fillStyle = grad;
		ctx.fillRect(
			box.x,
			box.y,
			box.width,
			box.height
		)
	}


	ctx.fillStyle = Colors.bg[0] + 'ff';
	for (const name of sticks) {
		// Draw inner circle
		let stick = Input.getOnscreenControl(name) as VirtualJoystick;
		let size = stick.size.x / 1.5;
		let radius = size / 2;
		let halfRadius = radius / 2;

		let box = stick.box.clone();
		box.x += radius / 2;
		box.y += radius / 2;
		box.width = size;
		box.height = size;

		box.x += (stick.value.x * halfRadius);
		box.y += (stick.value.y * halfRadius);

		let middle = box.getCenterMiddle();

		let grad = ctx.createRadialGradient(
			middle.x,
			middle.y,
			0,
			middle.x,
			middle.y,
			box.width,
		)
		grad.addColorStop(0.25, Colors.bg[0] + '00');
		grad.addColorStop(0.5, Colors.bg[0] + 'ff');
		grad.addColorStop(0.51, Colors.bg[0] + '00');

		ctx.beginPath();
		ctx.ellipse(
			middle.x,
			middle.y,
			radius,
			radius,
			0, 0, 100
		)
		ctx.globalCompositeOperation = "destination-out";
		ctx.fillStyle = "black";
		ctx.fill();

		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = grad;
		ctx.fillRect(
			box.x,
			box.y,
			box.width,
			box.height,
		)
	}
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
		ctx.drawImage(shadow.bitmap,
			x * Game.camera.zoom,
			y * Game.camera.zoom,
			sprite.drawBox.width * Game.camera.zoom,
			sprite.drawBox.height * 0.5 * Game.camera.zoom,
		);
	}
}