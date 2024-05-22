import { vec2 } from "./Vec2";
export default class Vars {
	static inputState: { [id: string]: number } = {};
	static debugMode = false;
	static displayMode = 0;
	static spriteSheetMode = false;
	static slowMode = false;
	static showButtons = true;
	static showBackground = false;
	static mouseMove: vec2 | null = null;
}