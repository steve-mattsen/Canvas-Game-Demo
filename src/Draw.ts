import { Img, Sprite, sprt } from "./Sprites";
import { Obj } from "./Obj";
import Vars from "./Vars";
import Button from "./Button";
import { Box, vec, Vec2 } from "./Geo";

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

	if (Vars.showBackground) {
		drawBackground(ctx);
	}

	let plyr = Obj.store['player'];

	if (Vars.spriteSheetMode) {
		let sprite = plyr.getAnimFrame();
		ctx.fillStyle = "red";
		ctx.fillRect(
			sprite.drawBox.topLeft.x,
			sprite.drawBox.topLeft.y,
			sprite.drawBox.getWidth(),
			sprite.drawBox.getHeight(),
		);
		ctx.drawImage(Img.store['spritesheet_link'].element, 0, 0)
	}

	drawObjects(ctx);

	drawButtons(ctx);
}

function drawObjects(ctx: CanvasRenderingContext2D) {
	Object.keys(Obj.store).forEach(v => {
		let obj = Obj.store[v];
		let hb = obj.getAbsoluteHitbox();

		if (Vars.displayMode < 4) {
			// Draw points
			ctx.fillStyle = 'black';
			let pointSize = 8;

			let topLeft = new Path2D();

			let x = Math.floor(hb.topLeft.x);
			let y = Math.floor(hb.topLeft.y);
			topLeft.moveTo(x, y);
			topLeft.lineTo(x + pointSize, y);
			topLeft.lineTo(x, y + pointSize);
			topLeft.lineTo(x, y);

			let botRight = new Path2D();

			x = Math.floor(hb.bottomRight.x);
			y = Math.floor(hb.bottomRight.y);
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
				Math.floor(hb.topLeft.x) + offset,
				Math.floor(hb.topLeft.y) + offset,
				hb.getWidth() - offset * 2,
				hb.getHeight() - offset * 2,
			);
		}

		if (Vars.displayMode > 1) {

			let shadow = sprt('shadow');
			shadow.scale = obj.sprite.drawBox.getWidth() / shadow.drawBox.getWidth();
			shadow.draw(ctx, vec(
				hb.getX() - obj.hitBox.bottomRight.x * .025,
				hb.getY() + (obj.hitBox.bottomRight.y * 0.7)
			));
			if (Vars.displayMode < 3 || obj.animations == null) {
				// Just draw the sprite.
				obj.sprite.draw(ctx, vec(hb.getX(), hb.getY()));
			} else {
				let sprite = obj.getAnimFrame();
				ctx.drawImage(
					sprite.image.element, //image
					sprite.drawBox.topLeft.x, //subx
					sprite.drawBox.topLeft.y, //suby
					sprite.drawBox.getWidth(), //subw
					sprite.drawBox.getHeight(), //subh
					Math.floor(hb.getX()), //posx
					Math.floor(hb.getY() - obj.z), //posy
					sprite.drawBox.getWidth(), //width
					sprite.drawBox.getHeight(), //height
				);
			}
		}
		if (!Vars.debugMode) {
			return;
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
				obj.pos.y + obj.hitBox.bottomRight.y + 18,
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
	});
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