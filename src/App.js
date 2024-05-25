import React from "react";
import "./App.css";
import { Img } from "./Sprites";

let images = [
  '/grass.png',
  '/spritesheet_link.png',
  '/shadow.png',
  '/tree.png',
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
  let buttons = [
    {
      id: 'settings',
      key: 'f5',
      title: 'Settings',
    }, {
      id: 'fullscreen',
      key: 'f6',
      title: 'Fullscreen',
    },
  ];

  let fullscreen_click = e => {
    if (document.fullscreenElement === null) {
      document.documentElement.requestFullscreen();
    } else {
      // document.exitFullscreen();
    }
    // e.preventDefault();
    // return false;
  };

  return (
    <div id="game_container">
      <canvas id="game_window">da game</canvas>
      <div id="top_buttons">
        <button id="button_settings">⚙</button>
        <button id="button_fullscreen" onClick={fullscreen_click} onTouchEnd={fullscreen_click}>⤡</button>
      </div>
    </div>
  );
}

export default App;