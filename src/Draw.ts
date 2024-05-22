import { Img } from "./Sprites";
import { Obj } from "./Obj";
import Vars from "./Vars";

export default function draw(boxMode: number, spriteSheetMode: boolean, showBackground: boolean,) {
	let canvas = document.getElementById("game_window") as HTMLCanvasElement;
	canvas.setAttribute('width', window.innerWidth + '');
	canvas.setAttribute('height', window.innerHeight + '');
	if (canvas.getContext === undefined) {
		return;
	}
	let ctx = canvas.getContext('2d');
	if (ctx === null) {
		return;
	}

	if (showBackground) {
		drawBackground(ctx);
	}

	let plyr = Obj.store['player'];

	if (spriteSheetMode) {
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

	if (Vars.showButtons) {
		drawButtons(ctx);
	}
}

function drawObjects(ctx: CanvasRenderingContext2D) {
	Object.keys(Obj.store).forEach(v => {
		let obj = Obj.store[v];

		if (Vars.boxMode < 3) {
			// Draw points
			ctx.fillStyle = 'black';
			let pointSize = 6;
			ctx.fillRect(
				Math.floor(obj.pos.x),
				Math.floor(obj.pos.y),
				pointSize,
				pointSize,
			)
			ctx.fillRect(
				Math.floor(obj.pos.x + obj.size.x - pointSize),
				Math.floor(obj.pos.y + obj.size.y - pointSize),
				pointSize,
				pointSize,
			)
		}

		if (Vars.boxMode === 1 || Vars.boxMode === 2) {
			// Draw box
			ctx.strokeStyle = "black";
			ctx.lineWidth = 2;
			let offset = ctx.lineWidth / 2;
			ctx.strokeRect(
				Math.floor(obj.pos.x + offset),
				Math.floor(obj.pos.y) + offset,
				Math.floor(obj.size.x - offset),
				Math.floor(obj.size.y - offset),
			);
		}

		if (Vars.boxMode > 1) {
			let frame = obj.getAnimFrame();
			if (Vars.boxMode < 4) {
				// Just get one frame.
				frame = obj.animations[Object.keys(obj.animations)[0]].frames[0];
			}
			ctx.drawImage(
				frame.image.element, //image
				frame.subImg.topLeft.x, //subx
				frame.subImg.topLeft.y, //suby
				frame.subImg.getWidth(), //subw
				frame.subImg.getHeight(), //subh
				Math.floor(obj.pos.x), //posx
				Math.floor(obj.pos.y), //posy
				frame.subImg.getWidth(), //width
				frame.subImg.getHeight(), //height
			);
		}
		if (!Vars.debugMode) {
			return;
		}
		ctx.save();
		ctx.font = "18px Courier"
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
		ctx.fillText(`window ${window.innerHeight}x${window.innerWidth}`,
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
				window.innerWidth,
				count++ * 18,
			)
		});
		ctx.restore();
	});
}

function drawButtons(ctx: CanvasRenderingContext2D) {
	// Draw optional keys and states
	let modes = [
		{
			key: 'F1',
			var: Vars.boxMode,
			title: 'Player',
		}, {
			key: 'F2',
			var: Vars.spriteSheetMode,
			title: 'Spritesheet',
		}, {
			key: 'F3',
			var: Vars.slowMode,
			title: 'Slow'
		}, {
			key: 'F4',
			var: Vars.showBackground,
			title: "Background",
		}, {
			key: 'F5',
			var: Vars.showButtons,
			title: "Buttons",
		}, {
			key: 'F9',
			var: Vars.debugMode,
			title: 'Debug'
		}
	]
	modes.reverse();
	modes.forEach((v, i) => {
		let buttonWidth = Math.max(70, Math.ceil(window.innerWidth * 0.2));
		let buttonHeight = Math.ceil(buttonWidth * .15);
		let margin = Math.ceil(buttonHeight * .2);
		let buttonX = window.innerWidth - buttonWidth - margin;
		let buttonY = window.innerHeight - (buttonHeight + margin) * (i + 1);
		let colors = [
			"#000000",
			"#ffffff",
			"#888888",
		]
		ctx.fillStyle = colors[v.var ? (v.var === 2 ? 2 : 0) : 1] + "88";
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
		ctx.fillStyle = colors[v.var ? (v.var === 2 ? 0 : 1) : 0];
		ctx.textAlign = "left";
		ctx.font = `${Math.ceil(buttonHeight * .75)}px Courier`;
		ctx.fillText(
			`${v.key} ${v.title}`,
			buttonX + margin,
			buttonY + Math.ceil(buttonHeight / 2) + margin,
			buttonWidth - margin * 2,
		)
	});

}

function drawBackground(ctx: CanvasRenderingContext2D) {
	let img = Img.store['grass'];
	if (!img?.size?.x || !img?.size?.y) {
		return;
	}
	for (let yi = 0; yi * img.size.y < window.innerHeight; yi++) {
		for (let xi = 0; xi * img.size.x < window.innerWidth; xi++) {
			ctx.drawImage(
				img.element,
				xi * img.size.x,
				yi * img.size.y,
			)
		}
	}
}