// export default class Camera {
//   constructor(bomberMan, canvasWidth, canvasHeight) {
//     this.bomberMan = bomberMan;
//     this.canvasWidth = canvasWidth;
//     this.canvasHeight = canvasHeight;
//     this.x = 40;
//     this.y = 25;
//   }

//   update() {}

//   drawGame() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.save();
//     ctx.translate(-camera.x, -camera.y);
//     drawMap();
//     drawPlayer();

//     ctx.restore();
//   }

//   drawPlayer() {
//     ctx.fillStyle = "blue";
//     ctx.fillRect(player.x, player.y, player.width, player.height);
//   }

//   canMoveTo(x, y) {
//     const mapX = Math.floor(x / tileSize);
//     const mapY = Math.floor(y / tileSize);
//     return tileMap[mapY][mapX] === 0;
//   }

//   movePlayer(direction) {
//     let newX = player.x;
//     let newY = player.y;

//     switch (direction) {
//       case "right":
//         newX += speed;
//         break;
//       case "left":
//         newX -= speed;
//         break;
//       case "up":
//         newY -= speed;
//         break;
//       case "down":
//         newY += speed;
//         break;
//     }

//     if (canMoveTo(newX, newY)) {
//       player.x = newX;
//       player.y = newY;
//     }
//   }
// }
