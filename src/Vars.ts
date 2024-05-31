import Game from "./Game";
import { Vec2, Box } from "./Geo";
export default class Vars {
	static inputState: { [id: string]: number } = {};
	static debugMode = false;
	static displayMode = 4;
	static spriteSheetMode = false;
	static slowMode = false;
	static showButtons = false;
	static showBackground = true;
	static mouseMove: Vec2 | null = null;
	static fullscreenMode = false;
	static canvasScale = 1;
	static canvasWidth = window.innerWidth / this.canvasScale;
	static canvasHeight = window.innerHeight / this.canvasScale;
	static move = new Vec2(0, 0);
	static oneScreenMode = false;
}