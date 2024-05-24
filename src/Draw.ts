import { Img, Sprite, sprite, Frame } from "./Sprites";
import { Obj } from "./Obj";
import Vars from "./Vars";
import Button from "./Button";
import { bbox, vec, vec2 } from "./Geo";

export default function draw() {
	let canvas = document.getElementById("game_window") as HTMLCanvasElement;
	canvas.setAttribute('width', Vars.canvasWidth + '');
	canvas.setAttribute('height', Vars.canvasHeight + '');
	if (canvas.getContext === undefined) {
		return;
	}
	let ctx = canvas.getContext('2d');
	if (ctx === null) {
		return;
	}

	ctx.lineWidth = 2;

	if (Vars.showBackground) {
		drawBackground(ctx);
	}

	let plyr = Obj.store['player'];

	if (Vars.spriteSheetMode) {
		let frame = plyr.getAnimFrame();
		ctx.fillStyle = "red";
		ctx.fillRect(
			frame.subImg.topLeft.x,
			frame.subImg.topLeft.y,
			frame.subImg.getWidth(),
			frame.subImg.getHeight(),
		);
		ctx.drawImage(Img.store['spritesheet_link'].element, 0, 0)
	}

	drawObjects(ctx);

	drawButtons(ctx);
}

function drawObjects(ctx: CanvasRenderingContext2D) {
	Object.keys(Obj.store).forEach(v => {
		let obj = Obj.store[v];

		if (Vars.displayMode < 4) {
			// Draw points
			ctx.fillStyle = 'black';
			let pointSize = 16;

			let topLeft = new Path2D();

			let x = Math.floor(obj.pos.x)
			let y = Math.floor(obj.pos.y)
			topLeft.moveTo(x, y);
			topLeft.lineTo(x + pointSize, y);
			topLeft.lineTo(x, y + pointSize);
			topLeft.lineTo(x, y);

			let botRight = new Path2D();

			x = Math.floor(obj.pos.x + obj.size.x);
			y = Math.floor(obj.pos.y + obj.size.y);
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
			let offset = ctx.lineWidth / 2;
			ctx.strokeRect(
				Math.floor(obj.pos.x + offset),
				Math.floor(obj.pos.y) + offset,
				Math.floor(obj.size.x - offset),
				Math.floor(obj.size.y - offset),
			);
		}

		if (Vars.displayMode > 1) {
			let shadow = sprite('shadow');
			shadow.scale = .25;
			shadow.draw(ctx, vec(obj.pos.x, obj.pos.y + (obj.size.y * 0.7)));

			if (Vars.displayMode < 3 || Object.keys(obj.animations).length == 0) {
				// Just draw the sprite.
				obj.sprite.draw(ctx, obj.pos);
			} else {
				let frame = obj.getAnimFrame();
				ctx.drawImage(
					frame.image.element, //image
					frame.subImg.topLeft.x, //subx
					frame.subImg.topLeft.y, //suby
					frame.subImg.getWidth(), //subw
					frame.subImg.getHeight(), //subh
					Math.floor(obj.pos.x), //posx
					Math.floor(obj.pos.y - obj.z), //posy
					frame.subImg.getWidth(), //width
					frame.subImg.getHeight(), //height
				);
			}
		}
		if (!Vars.debugMode) {
			return;
		}
		ctx.save();
		ctx.font = "18px Courier";
		ctx.fillStyle = "black";
		ctx.fillText(
			Math.round(obj.pos.x) + ", " + Math.round(obj.pos.y),
			obj.pos.x,
			obj.pos.y - 2,
		);
		ctx.fillText(
			obj.animState + " " + obj.animations[obj.animState].currentFrame.toString(),
			obj.pos.x,
			obj.pos.y + obj.size.y + 18,
		)
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

		Button.store[key].dimensions = new bbox(vec(buttonX, buttonY), vec(buttonX + buttonWidth, buttonY + buttonHeight));
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