import React from "react";
import "./App.css";
import "./Game";
import { Img } from "./Sprites";

function App() {

  return (
    <div>
      <canvas id="game_window">da game</canvas>
      {/* {Object.keys(Img.store).map(v => <img src={require("" + Img.store[v].uri)} />)} */}
    </div>
  );
}

export default App;