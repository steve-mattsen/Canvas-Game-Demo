import { vec2, bbox } from "./Vec2"
export default class Button {
	key: string;
	title: string;
	varKey: string;
	dimensions: bbox;
	constructor(
		key: string,
		varKey: string,
		title: string,
		dimensions: bbox = new bbox(new vec2(0, 0), new vec2(0, 0)),
	) {
		this.key = key ?? this.key;
		this.title = title ?? this.title;
		this.varKey = varKey ?? this.varKey;
		this.dimensions = dimensions ?? this.dimensions;
	}
	static store: Button[] = [
		new Button('F1', 'displayMode', 'Display'),
		new Button('F2', 'spriteSheetMode', 'Spritesheet'),
		new Button('F3', 'slowMode', 'Slow'),
		new Button('F4', 'showBackground', "Background"),
		new Button('F5', 'showButtons', "Buttons"),
		new Button('F9', 'debugMode', 'Debug')
	];
}