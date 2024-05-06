import BomberMan from "./BomberMan.js";
import TileMap from "./TileMap.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const bomberMan = new BomberMan();
const tileMap = new TileMap(tileSize, bomberMan);
function gameLoop() {
  tileMap.draw(canvas, ctx);
  bomberMan.draw(ctx);
}

setInterval(gameLoop, 1000 / 60);
