import Button from "./Button";
import Game from "./Game";
import { Box, Vec2, attachmentLocation, vec } from "./Geo";
import Vars from "./Vars";

import VirtualJoystick from "./VirtualJoystick";

export default class Input {
	static onscreenControls: { [id: string]: OnScreenControl } = {};
	public static getOnscreenControl(id: string) {
		let result = Input.onscreenControls[id];
		switch (result.constructor.name) {
			case "VirtualJoystick":
				return result as VirtualJoystick;
				break;
		}
		return result;
	}
	static moveCamera() {
		if (Vars.inputState['i'] > 0) {
			Game.camera.y -= 1;
		} else if (Vars.inputState['k'] > 0) {
			Game.camera.y += 1;
		}
		if (Vars.inputState['j'] > 0) {
			Game.camera.x -= 1;
		} else if (Vars.inputState['l'] > 0) {
			Game.camera.x += 1;
		}
	}
}

export abstract class OnScreenControl {
	id: string;
	attachment: attachmentLocation;
	box: Box;
	size: Vec2;
	margin: number;
	constructor(id: string, attachment: attachmentLocation, size: Vec2 = new Vec2(200, 200), margin: number = 25) {
		this.id = id;
		this.attachment = attachment;
		this.box = new Box(0, 0, size.x, size.y, attachment);
		this.size = size;
		this.margin = margin;
		this.attach();
		Input.onscreenControls[id] = this;
	}
	attach() {
		let attach = Game.screen.getPoint(this.attachment.x, this.attachment.y, this.margin);
		this.box = this.box.fromPoint(attach).fromOrigin();
	}
}


window.onkeydown = e => {
	Vars.debugMode && console.log(e);
	let key = e.key.toLowerCase();
	if (['tab', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10'].indexOf(key) > -1) {
		e.preventDefault();
	}
	if (!Vars.inputState[key]) {
		Vars.inputState[key] = 1;
	}
	if (Vars.inputState.f1 === 1) {
		Vars.displayMode = (++Vars.displayMode % 5);
	} else if (Vars.inputState.f2 === 1) {
		Vars.spriteSheetMode = !Vars.spriteSheetMode;
	} else if (Vars.inputState.f3 === 1) {
		Button.store['F3'].click();
	} else if (Vars.inputState.f4) {
		Vars.showBackground = !Vars.showBackground;
	} else if (Vars.inputState.f5) {
		Vars.showButtons = !Vars.showButtons;
	} else if (Vars.inputState.f6) {
		Button.store['F6'].click();
	} else if (Vars.inputState.f9 === 1) {
		Vars.debugMode = !Vars.debugMode;
	} else if (Vars.inputState['+'] > 0) {
		Vars.canvasScale += 0.1;
	} else if (Vars.inputState['-'] > 0) {
		Vars.canvasScale -= 0.1;
	}
}
window.onmousedown = (e) => {
	Vars.debugMode && console.log(e.type, e);
	let point = vec(
		e.clientX / Vars.canvasScale,
		e.clientY / Vars.canvasScale,
	);
	clickOrTouchStart(point);
}
window.onmousemove = (e) => {
	Vars.debugMode && console.log(e.type, e);
	if (Vars.inputState['left_stick'] > 0) {
		let stick = Input.getOnscreenControl('left_stick') as VirtualJoystick;
		stick.screenToValue(new Vec2(
			e.clientX,
			e.clientY,
		));
	} else if (Vars.mouseMove != null) {
		Vars.mouseMove.x = e.clientX;
		Vars.mouseMove.y = e.clientY;
	}
}
window.onmouseup = (e) => {
	Vars.debugMode && console.log(e.type, e);
	let stick = Input.getOnscreenControl('left_stick') as VirtualJoystick;
	stick.value = new Vec2(0, 0);
	clickOrTouchEnd();
	e.preventDefault();
}

window.ontouchstart = (e) => {
	Vars.debugMode && console.log(e.type, e);
	let point = vec(
		e.touches[0].clientX,
		e.touches[0].clientY,
	);
	clickOrTouchStart(point);
}
window.ontouchmove = (e) => {
	Vars.debugMode && console.log(e.type, e);
	if (Vars.inputState.left_stick > 0) {
		let stick = Input.getOnscreenControl('left_stick') as VirtualJoystick;
		stick.screenToValue(new Vec2(
			e.touches[0].clientX,
			e.touches[0].clientY,
		));
	} else if (Vars.mouseMove !== null) {
		Vars.mouseMove = vec(
			e.touches[0].clientX,
			e.touches[0].clientY,
		);
	}
}
window.ontouchend = (e) => {
	Vars.debugMode && console.log(e.type, e);
	clickOrTouchEnd();
	e.preventDefault();
}
window.onkeyup = e => {
	Vars.debugMode && console.log(e.type, e);
	Vars.inputState[e.key.toLowerCase()] = 0;
	e.preventDefault();
}
window.onblur = e => {
	Vars.debugMode && console.log(e.type, e);
	Vars.inputState = {};
}

function clickOrTouchStart(point: Vec2) {
	if (Vars.inputState['mouseDown'] > 0) {
		return;
	}
	let button = Button.store.F6;
	if (button.dimensions.contains(point)) {
		button.click();
		return;
	}
	let stick = Input.getOnscreenControl('left_stick') as VirtualJoystick;
	if (stick.box.contains(point)) {
		Vars.inputState['left_stick'] = 1;
		stick.screenToValue(point);
	} else {
		Vars.inputState['mouseDown'] = 1;
		Vars.mouseMove = point;
	}
}

function clickOrTouchEnd() {
	Vars.inputState['mouseDown'] = 0;
	if (Vars.inputState.left_stick > 0) {
		Vars.inputState['left_stick'] = 0;
		let stick = Input.getOnscreenControl('left_stick') as VirtualJoystick;
		stick.value.x = 0;
		stick.value.y = 0;
	}
	Vars.mouseMove = null;
}