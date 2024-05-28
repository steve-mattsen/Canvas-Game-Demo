import VirtualJoystick from "./VirtualJoystick";

export default class Input {
	static onscreenControls: { [id: string]: OnScreenControl } = {};
	public static getOnscreenControl(id: string) {
		let result = Input.onscreenControls[id];
		switch (result.constructor.name) {
			case "VirtualJoystick":
				return result as VirtualJoystick;
				break;
		}
		return result;
	}
}

export abstract class OnScreenControl {
	id: string;
	constructor(id: string) {
		this.id = id;
		Input.onscreenControls[id] = this;
	}
}