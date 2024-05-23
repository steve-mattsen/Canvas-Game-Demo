import { vec2, bbox } from "./Vec2";
export default class Vars {
	static inputState: { [id: string]: number } = {};
	static debugMode = false;
	static displayMode = 0;
	static spriteSheetMode = false;
	static slowMode = false;
	static showButtons = true;
	static showBackground = false;
	static mouseMove: vec2 | null = null;
	static buttons: {key: string, title: string, dimensions: bbox, varKey: string}[] = [
		{
			key: 'F1',
			varKey: 'displayMode',
			title: 'Display',
			dimensions: new bbox(new vec2(0,0), new vec2(0,0))
		}, {
			key: 'F2',
			varKey: 'spriteSheetMode',
			title: 'Spritesheet',
			dimensions: new bbox(new vec2(0,0), new vec2(0,0))
		}, {
			key: 'F3',
			varKey: 'slowMode',
			title: 'Slow',
			dimensions: new bbox(new vec2(0,0), new vec2(0,0))
		}, {
			key: 'F4',
			varKey: 'showBackground',
			title: "Background",
			dimensions: new bbox(new vec2(0,0), new vec2(0,0))
		}, {
			key: 'F5',
			varKey: 'showButtons',
			title: "Buttons",
			dimensions: new bbox(new vec2(0,0), new vec2(0,0))
		}, {
			key: 'F9',
			varKey: 'debugMode',
			title: 'Debug',
			dimensions: new bbox(new vec2(0,0), new vec2(0,0))
		}
	];
	static bgColors = [
		"#ffffff",
		"#000000",
		"#888888",
	]
	static fgColors = [
		"#000000",
		"#ffffff",
		"#ffffff",
	]
}