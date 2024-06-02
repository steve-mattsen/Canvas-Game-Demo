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
      '/bush.png',
    ];

    await Img.preloadImages(images);

    Game.init();
  }

  render() {
    return (<div>
      <canvas id="background_canvas">Background</canvas>
      <canvas id="shadow_canvas">Shadows</canvas>
      <canvas id="game_window">da game</canvas>
      <canvas id="ui_canvas">UI / onscreen controls</canvas>
    </div>
    );
  }
}

export default App;