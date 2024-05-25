"use strict";
exports.__esModule = true;
require("./App.css");
var Sprites_1 = require("./Sprites");
var images = [
    '/grass.png',
    '/spritesheet_link.png',
    '/shadow.png',
    '/tree.png',
];
for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
    var uri = images_1[_i];
    var key = uri.replace(RegExp(/(.*)\/(.*)\.(.*)/gim), "$2");
    console.log(key);
    Sprites_1.Img.addImg(new Sprites_1.Img(key, uri));
}
while (Sprites_1.Img.checkImagesArePreloaded() === false) {
    await new Promise(function (r) { return setTimeout(r, 100); });
}
require('./Game');
function App() {
    var buttons = [];
    return id = "game_window" > da;
    game < /canvas>
        < div;
    id = "game_buttons" >
        /div>
        < /div>;
    ;
}
exports["default"] = App;
//# sourceMappingURL=App.js.map