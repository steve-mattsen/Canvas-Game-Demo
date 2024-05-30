import React from "react";
import "./App.css";
import { Img } from "./Sprites";


class App extends React.Component {

  async componentDidMount() {
    let images = [
      '/grass.png',
      '/spritesheet_link.png',
      '/shadow.png',
      '/tree.png',
      '/bush.png',
    ];

    await Img.preloadImages(images);

    require('./Game');
  }

  render() {
    return (<div>
      <canvas id="background_canvas">Background</canvas>
      <canvas id="shadow_canvas">Shadows</canvas>
      <canvas id="game_window">da game</canvas>
    </div>
    );
  }
}

export default App;