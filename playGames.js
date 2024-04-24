import TileMap from "./TileMap.js";
import BomberMan  from "./bomberMan.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const tileMap = new TileMap(tileSize);
const bomberMan = new BomberMan(); 

function gameLoop() {
    tileMap.draw(canvas, ctx);
    bomberMan.draw()
}

setInterval(gameLoop, 1000 / 60);
