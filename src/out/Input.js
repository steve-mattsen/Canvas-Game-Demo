"use strict";
exports.__esModule = true;
exports.OnScreenControl = void 0;
var Input = (function () {
    function Input() {
    }
    Input.getOnscreenControl = function (id) {
        var result = Input.onscreenControls[id];
        switch (result.constructor.name) {
            case "VirtualJoystick":
                return result;
                break;
        }
        return result;
    };
    Input.onscreenControls = {};
    return Input;
}());
exports["default"] = Input;
var OnScreenControl = (function () {
    function OnScreenControl(id) {
        this.id = id;
        Input.onscreenControls[id] = this;
    }
    return OnScreenControl;
}());
exports.OnScreenControl = OnScreenControl;
//# sourceMappingURL=Input.js.map