import { vec, vec2, bbox } from "./Geo";
import Vars from "./Vars";
export default class Button {
	key: string;
	varKey: string;
	title: string;
	click: () => void;
	dimensions: bbox;
	constructor(
		key: string,
		varKey: string,
		title: string,
		click: () => void = () => {
			let value = Reflect.get(Vars, this.varKey);
			Reflect.set(Vars, this.varKey, !value);
		},
		dimensions: bbox = new bbox(vec(0, 0), vec(0, 0)),
	) {
		this.key = key ?? this.key;
		this.title = title ?? this.title;
		this.varKey = varKey ?? this.varKey;
		this.click = click ?? this.click;
		this.dimensions = dimensions ?? this.dimensions;

		Button.store[this.key] = this;
	}
	static store: { [id: string]: Button } = {};
}

new Button('F1', 'displayMode', 'Display', () => {
	Vars.displayMode = (++Vars.displayMode % 5);
});
new Button('F2', 'spriteSheetMode', 'Spritesheet');
new Button('F3', 'slowMode', 'Slow');
new Button('F4', 'showBackground', "Background");
new Button('F5', 'showButtons', "Buttons");
new Button('F6', 'fullscreenMode', 'Fullscreen', () => {
	if (!Vars.fullscreenMode) {
		document.getElementsByTagName('html')[0].requestFullscreen({ 'navigationUI': 'hide' });
		Vars.fullscreenMode = true;
	} else {
		if (document.fullscreenElement !== null) {
			document.exitFullscreen();
		}
		Vars.fullscreenMode = false;
	}
});
new Button('F9', 'debugMode', 'Debug');

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
	}
}
window.onmousedown = (e) => {
	Vars.debugMode && console.log(e.type, e);
	let point = vec(
		e.clientX / Vars.canvasScale,
		e.clientY / Vars.canvasScale
	);
	clickOrTouchStart(point);
}
window.onmousemove = (e) => {
	// Vars.debugMode && console.log(e.type, e);
	if (Vars.mouseMove === null) {
		return;
	}
	Vars.mouseMove = vec(
		e.clientX / Vars.canvasScale,
		e.clientY / Vars.canvasScale,
	);
}
window.onmouseup = (e) => {
	Vars.debugMode && console.log(e.type, e);
	clickOrTouchEnd();
	e.preventDefault();
}

window.ontouchstart = (e) => {
	Vars.debugMode && console.log(e.type, e);
	let point = vec(
		e.touches[0].clientX / Vars.canvasScale,
		e.touches[0].clientY / Vars.canvasScale,
	);
	clickOrTouchStart(point);
}
window.ontouchmove = (e) => {
	Vars.debugMode && console.log(e.type, e);
	if (Vars.mouseMove === null) {
		return;
	}
	Vars.mouseMove = vec(
		e.touches[0].clientX / Vars.canvasScale,
		e.touches[0].clientY / Vars.canvasScale,
	);
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

function clickOrTouchStart(point: vec2) {
	if (Vars.inputState['mouseDown'] > 0) {
		return;
	}
	Vars.inputState['mouseDown'] = 1;
	for (const [key, button] of Object.entries(Button.store)) {
		if (!Vars.showButtons && button.varKey != "showButtons") {
			continue;
		}
		if (button.dimensions.contains(point)) {
			button.click();
			return;
		}
	}
	Vars.mouseMove = point;
}

function clickOrTouchEnd() {
	Vars.inputState['mouseDown'] = 0;
	Vars.mouseMove = null;
}