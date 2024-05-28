"use strict";
exports.__esModule = true;
exports.OnScreenControl = void 0;
var Input = (function () {
    function Input() {
    }
    Input.onScreenControls = {};
    return Input;
}());
exports["default"] = Input;
var OnScreenControl = (function () {
    function OnScreenControl(id) {
        this.id = id;
        Input.onScreenControls[id] = this;
    }
    return OnScreenControl;
}());
exports.OnScreenControl = OnScreenControl;
//# sourceMappingURL=Input.js.map