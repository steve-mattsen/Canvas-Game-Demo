import { vec2, bbox } from "./Vec2";
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
		dimensions: bbox = new bbox(new vec2(0, 0), new vec2(0, 0)),
	) {
		this.key = key ?? this.key;
		this.title = title ?? this.title;
		this.varKey = varKey ?? this.varKey;
		this.click = click ?? this.click;
		this.dimensions = dimensions ?? this.dimensions;

		Button.store[this.key] = this;
	}
	static store: {[id:string] : Button } = {};
}

new Button('F1', 'displayMode', 'Display', () => {
	Vars.displayMode = (++Vars.displayMode % 5);
});
new Button('F2', 'spriteSheetMode', 'Spritesheet');
new Button('F3', 'slowMode', 'Slow');
new Button('F4', 'showBackground', "Background");
new Button('F5', 'showButtons', "Buttons");
new Button('F9', 'debugMode', 'Debug');