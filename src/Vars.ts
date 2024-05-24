import { vec2, Box } from "./Geo";
export default class Vars {
	static inputState: { [id: string]: number } = {};
	static debugMode = false;
	static displayMode = 5;
	static spriteSheetMode = false;
	static slowMode = false;
	static showButtons = true;
	static showBackground = false;
	static mouseMove: vec2 | null = null;
	static fullscreenMode = false;
	static canvasScale = 4;
	static canvasWidth = window.innerWidth / this.canvasScale;
	static canvasHeight = window.innerHeight / this.canvasScale;
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