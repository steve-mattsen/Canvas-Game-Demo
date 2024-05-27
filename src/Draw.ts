import { Img, sprt } from "./Sprites";
import { Obj } from "./Obj";
import Vars from "./Vars";
import Button from "./Button";
import { Box } from "./Geo";

export default function draw() {
	let canvas = document.getElementById("game_window") as HTMLCanvasElement;
	Vars.canvasWidth = window.innerWidth / Vars.canvasScale;
	Vars.canvasHeight = window.innerHeight / Vars.canvasScale;
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

	ctx.scale(1 / Vars.cameraScale, 1 / Vars.cameraScale);
	ctx.imageSmoothingEnabled = true;

	drawButtons(ctx);
}

function drawObjects(ctx: CanvasRenderingContext2D) {
	// Order draws by closeness to camera.
	let entries = Object.values(Obj.store).sort((a, b) => a.pos.y - b.pos.y);
	for (const v of entries) {
		let obj = v;
		let hb = obj.calcHitBox();

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
				Math.floor(obj.pos.x - (shadow.drawBox.width * shadow.scale * 0.5) - 1),
				Math.floor(obj.pos.y - (shadow.drawBox.width * shadow.scale * 0.5) - 1),
				sprite.drawBox.width,
				sprite.drawBox.height * 0.5,
			);

			ctx.drawImage(
				sprite.image.element, //image
				sprite.drawBox.x, //subx
				sprite.drawBox.y, //suby
				sprite.drawBox.width, //subw
				sprite.drawBox.height, //subh
				Math.floor(obj.pos.x - sprite.drawBox.origin.x), //posx
				Math.floor(obj.pos.y - sprite.drawBox.origin.y - obj.z), //posy
				sprite.drawBox.width, //width
				sprite.drawBox.height, //height
			);
		}

		if (Vars.displayMode < 4) {
			// Draw points
			ctx.fillStyle = 'black';
			let pointSize = 4;

			let topLeft = new Path2D();

			let x = Math.floor(hb.x);
			let y = Math.floor(hb.y);
			topLeft.moveTo(x, y);
			topLeft.lineTo(x + pointSize, y);
			topLeft.lineTo(x, y + pointSize);
			topLeft.lineTo(x, y);

			let botRight = new Path2D();

			let p2 = hb.p2();

			x = Math.floor(p2.x);
			y = Math.floor(p2.y);
			botRight.moveTo(x, y);
			botRight.lineTo(x - pointSize, y);
			botRight.lineTo(x, y - pointSize);
			botRight.lineTo(x, y);

			ctx.fill(topLeft);
			ctx.fill(botRight);
		}

		if (Vars.displayMode !== 0 && Vars.displayMode < 4) {
			// Draw box
			ctx.strokeStyle = "black";
			let offset = ctx.lineWidth * 0.5;
			ctx.strokeRect(
				Math.floor(hb.x) + offset,
				Math.floor(hb.y) + offset,
				hb.width - offset * 2,
				hb.height - offset * 2,
			);
		}

		if (!Vars.debugMode) {
			continue;
		}
		let path = new Path2D();
		let crosshairSize = 2;
		let offset = 0;
		let x = Math.floor(obj.pos.x) + offset;
		let y = Math.floor(obj.pos.y) + offset;
		path.moveTo(x - crosshairSize, y);
		path.lineTo(x + crosshairSize, y);
		path.moveTo(x, y - crosshairSize);
		path.lineTo(x, y + crosshairSize);
		ctx.stroke(path);

		ctx.save();
		ctx.font = "bold 7px Courier";
		ctx.fillStyle = "black";
		ctx.fillText(
			Math.round(obj.pos.x) + ", " + Math.round(obj.pos.y),
			obj.pos.x,
			obj.pos.y - 2,
		);
		if (obj.animations !== null) {
			ctx.fillText(
				obj.animState + " " + obj.animations[obj.animState].currentSprite.toString(),
				obj.pos.x,
				obj.pos.y + obj.hitBox.p2().y + 18,
			)
		}
		ctx.fillText(`window ${Vars.canvasHeight}x${Vars.canvasWidth}`,
			0, 18
		);
		let count = 0;
		ctx.textAlign = "right";
		ctx.textBaseline = "top";
		Object.keys(Vars.inputState).forEach(v => {
			if (!Vars.inputState[v]) {
				return;
			}
			ctx.fillText(
				`${v} : ${Vars.inputState[v]}`,
				Vars.canvasWidth,
				count++ * 18,
			)
		});
		ctx.restore();
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
		let aspectRatio = Vars.canvasWidth / Vars.canvasHeight;
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