
export default class Input {
	static onScreenControls: { [id: string]: OnScreenControl } = {};
}

export class OnScreenControl {
	id: string;
	constructor(id: string) {
		this.id = id;
		Input.onScreenControls[id] = this;
	}
}