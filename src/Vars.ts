import { Vec2, Box } from "./Geo";
export default class Vars {
	static inputState: { [id: string]: number } = {};
	static debugMode = true;
	static displayMode = 0;
	static spriteSheetMode = false;
	static slowMode = false;
	static showButtons = false;
	static showBackground = true;
	static mouseMove: Vec2 | null = null;
	static fullscreenMode = false;
	static canvasScale = 1;
	static cameraScale = 4;
	static canvasWidth = window.innerWidth / this.canvasScale;
	static canvasHeight = window.innerHeight / this.canvasScale;
	static cameraWidth = this.canvasWidth / this.cameraScale;
	static cameraHeight = this.canvasHeight / this.cameraScale;
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