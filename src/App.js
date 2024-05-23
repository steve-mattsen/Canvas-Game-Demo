import React from "react";
import "./App.css";
import { Img } from "./Sprites";

let images = [
  '/grass.png',
  '/spritesheet_link.png',
];

for (const uri of images) {
  let key = uri.replace(RegExp(/(.*)\/(.*)\.(.*)/gim), "$2");
  console.log(key);
  Img.addImg(new Img(key, uri));
}

while (Img.checkImagesArePreloaded() === false) {
  await new Promise(r => setTimeout(r, 100));
}

require('./Game');

function App() {

  return (
    <canvas id="game_window">da game</canvas>
  );
}

export default App;