import BomberMan from "./bomberMan.js";
import TileMap from "./tileMap.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const tileMap = new TileMap(tileSize);
const bomberMan = new BomberMan();

function gameLoop() {
  tileMap.draw(canvas, ctx);
  bomberMan.draw(ctx);
}

setInterval(gameLoop, 1000 / 60);
