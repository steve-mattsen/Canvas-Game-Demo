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
	static fullscreenMode = false;
	static bgColors = [
		"#ffffff",
		"#666666",
		"#444444",
		"#222222",
		"#000000",
		"#000000",
	]
	static fgColors = [
		"#000000",
		"#ffffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",
		"#ffffff",
	]
}