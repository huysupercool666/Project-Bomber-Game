import BomberMan from "./BomberMan.js";
import TileMap from "./TileMap.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 45 ;
const tileMap = new TileMap(tileSize, BomberMan);
const bomberMan = new BomberMan(tileMap, tileSize);
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  tileMap.draw(canvas, ctx);
  bomberMan.draw(ctx);
}

setInterval(gameLoop, 1000 / 60);
