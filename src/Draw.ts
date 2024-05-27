import { Img, sprt } from "./Sprites";
import { Obj } from "./Obj";
import Vars from "./Vars";
import Button from "./Button";
import { Box } from "./Geo";

export default function draw() {
	let canvas = document.getElementById("game_window") as HTMLCanvasElement;
	Vars.canvasWidth = window.innerWidth / Vars.canvasScale;
	Vars.canvasHeight = window.innerHeight / Vars.canvasScale;
	Vars.cameraWidth = Vars.canvasWidth / Vars.cameraScale;
	Vars.cameraHeight = Vars.canvasHeight / Vars.cameraScale;
	canvas.setAttribute('width', Vars.canvasWidth + '');
	canvas.setAttribute('height', Vars.canvasHeight + '');
	if (canvas.getContext === undefined) {
		return;
	}
	let ctx = canvas.getContext('2d');
	if (ctx === null) {
		return;
	}

	ctx.lineWidth = 1;

	ctx.imageSmoothingEnabled = false;
	ctx.scale(Vars.cameraScale, Vars.cameraScale)

	if (Vars.showBackground) {
		drawBackground(ctx);
	}

	let plyr = Obj.store['player'];

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

	drawObjects(ctx);

	Vars.debugMode && drawDebugInfo(ctx);

	ctx.scale(1 / Vars.cameraScale, 1 / Vars.cameraScale);
	ctx.imageSmoothingEnabled = true;


	drawButtons(ctx);
}

function drawObjects(ctx: CanvasRenderingContext2D) {
	// Order draws by closeness to camera.
	let entries = Object.values(Obj.store).sort((a, b) => a.pos.y - b.pos.y);
	for (const v of entries) {
		ctx.save();
		let obj = v;
		let hb = obj.calcHitBox();

		let fontSize = 4;
		ctx.font = `${fontSize}px Courier`;

		if (Vars.displayMode > 1) {

			let sprite;
			if (Vars.displayMode < 3 || obj.animations == null) {
				// Just draw the sprite.
				sprite = obj.sprite;
			} else {
				sprite = obj.getAnimFrame();
			}

			let shadow = sprt('shadow');
			shadow.scale = sprite.drawBox.width / shadow.drawBox.width;
			ctx.drawImage(shadow.image.element,
				Math.round(obj.pos.x - (shadow.drawBox.width * shadow.scale * 0.5) - 1),
				Math.round(obj.pos.y - (shadow.drawBox.height * shadow.scale * 0.5) - 1),
				sprite.drawBox.width,
				sprite.drawBox.height * 0.5,
			);

			let drawBox = sprite.drawBox.fromPoint(obj.pos).fromOrigin(['center', 'bottom']);
			ctx.drawImage(
				sprite.image.element, //image
				sprite.drawBox.x, //subx
				sprite.drawBox.y, //suby
				sprite.drawBox.width, //subw
				sprite.drawBox.height, //subh
				Math.round(obj.pos.x - sprite.drawBox.origin.x), //posx
				Math.round(obj.pos.y - sprite.drawBox.origin.y - obj.z), //posy
				drawBox.width, //width
				drawBox.height, //height
			);
		}

		if (Vars.displayMode < 4) {
			// Draw points
			drawMarker(ctx, hb.x, hb.y);
			let p2 = hb.p2();
			drawMarker(ctx, p2.x, p2.y);
		}

		if (Vars.displayMode !== 0 && Vars.displayMode < 4) {
			// Draw box
			drawBoxOutline(ctx, hb);
		}
	};
}

function drawButtons(ctx: CanvasRenderingContext2D) {
	ctx.save();
	// Draw optional keys and states
	let i = 0;
	for (const [key, button] of Object.entries(Button.store).reverse()) {
		if (!Vars.showButtons && button.varKey !== 'showButtons') {
			continue;
		}
		let aspectRatio = Vars.cameraWidth;
		let buttonWidth;
		let buttonHeight;
		let margin;
		let buttonAspect = 1 / 8;
		if (aspectRatio > 1) {
			//It's wide. Use width as primary dimension.
			buttonWidth = Math.max(
				70,
				Math.ceil(Vars.canvasWidth * 0.2),
				Math.ceil(Vars.canvasHeight * 0.05 / buttonAspect),
			);
		} else if (aspectRatio > 0.5) {
			buttonWidth = Math.max(
				70,
				Math.ceil(Vars.canvasWidth * .5)
			);
		} else {
			buttonWidth = Math.ceil(Vars.canvasWidth);
		}
		buttonHeight = Math.ceil(buttonWidth * buttonAspect);
		margin = Math.ceil(buttonHeight * .2);
		let buttonX = Vars.canvasWidth - buttonWidth - margin;
		let buttonY = Vars.canvasHeight - (buttonHeight + margin) * (i + 1);

		Button.store[key].dimensions = new Box(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight);
		let colorKey = Number(Reflect.get(Vars, button.varKey));
		ctx.fillStyle = Vars.bgColors[colorKey] + "88";
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
		ctx.fillStyle = Vars.fgColors[colorKey];
		ctx.textAlign = "left";
		ctx.font = `${Math.ceil(buttonHeight * .75)}px Courier`;
		ctx.fillText(
			`${key} ${button.title}`,
			buttonX + margin,
			buttonY + Math.ceil(buttonHeight / 2) + margin,
			buttonWidth - margin * 2,
		)
		i++;
	}
	ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
	let img = Img.store['grass'];
	if (!img?.size?.x || !img?.size?.y) {
		return;
	}
	ctx.save();
	for (let yi = 0; yi * img.size.y < Vars.canvasHeight; yi++) {
		for (let xi = 0; xi * img.size.x < Vars.canvasWidth; xi++) {
			ctx.drawImage(
				img.element,
				xi * img.size.x,
				yi * img.size.y,
			)
		}
	}
	ctx.restore();
}

function drawMarker(ctx: CanvasRenderingContext2D, x: number, y: number, diagonal = true) {
	ctx.save();
	ctx.fillStyle = Vars.fgColors[0];
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
	ctx.restore();
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
	ctx.save();
	let fontSize = 4;
	ctx.font = `${fontSize}px Courier`;
	ctx.fillStyle = Vars.bgColors[0] + '88';
	ctx.fillRect(0, 0, 50, fontSize * 4);
	ctx.fillStyle = Vars.fgColors[0];
	ctx.fillText(`window ${window.innerWidth}x${window.innerHeight}`,
		0, fontSize
	);
	ctx.fillText(`canvas ${Vars.canvasWidth}x${Vars.canvasHeight}`,
		0, fontSize * 2
	);
	ctx.fillText(`camera ${Vars.cameraWidth}x${Vars.cameraHeight}`,
		0, fontSize * 3
	);

	let inputs = Object.entries(Vars.inputState).filter((k, v) => Vars.inputState[k[0]]);
	ctx.fillStyle = Vars.bgColors[0] + '88';
	ctx.fillRect(
		Vars.cameraWidth - 50,
		0,
		50,
		fontSize * inputs.length * 1 + fontSize * .25,
	);

	let count = 0;
	for (const [k, v] of inputs) {
		ctx.textAlign = "right";
		ctx.textBaseline = "hanging";
		ctx.fillStyle = Vars.fgColors[0];
		ctx.fillText(
			`${k} : ${v}`,
			Vars.cameraWidth,
			count++ * fontSize,
		)
	}

	ctx.textAlign = "left";

	for (const obj of entries) {
		let hb = obj.calcHitBox();

		ctx.fillStyle = Vars.bgColors[0];
		ctx.fillRect(hb.x, hb.y, hb.width, hb.height);

		drawBoxOutline(ctx, hb);

		ctx.fillStyle = Vars.fgColors[0];
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

		if (obj.animations !== null) {
			ctx.fillText(
				obj.animState + " " + obj.animations[obj.animState].currentSprite.toString(),
				obj.pos.x,
				obj.pos.y + obj.hitBox.p2().y + fontSize,
			)
		}

		drawMarker(ctx, obj.pos.x, obj.pos.y);
		ctx.restore();
	}
}