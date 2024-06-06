import React from "react";
import "./App.css";
import { Img } from "./Sprites";
import Game from "./Game";
class App extends React.Component {

  static alreadyMounted = false;

  async componentDidMount(key) {
    if (App.alreadyMounted === true) {
      return;
    }
    App.alreadyMounted = true;
    let images = [
      '/grass.png',
      '/spritesheet_link.png',
      '/shadow.png',
      '/tree.png',
      '/corn.png',
      '/tiger.png',
      '/lion.png',
      '/bushes.png',
      '/bluejay.png',
      '/crow.png',
      '/dove.png',
      '/robin.png',
      '/sparrow.png',
      '/tilesets/randomtextures.png',
    ];

    await Img.preloadImages(images);

    Game.init();
  }

  render() {
    return (<div>
      <canvas id="background_canvas">Background</canvas>
      <canvas id="shadow_canvas">Shadows</canvas>
      <canvas id="game_window">da game</canvas>
      <canvas id="controls_canvas">UI / onscreen controls</canvas>
    </div>
    );
  }
}

export default App;