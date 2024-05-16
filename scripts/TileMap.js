export default class TileMap {
  constructor(tileSize, bomberMan) {
    this.bomberMan = bomberMan;
    this.tileSize = tileSize;
    this.x = 100;
    this.y = 50;
    this.hardWall = this.#image("HardWall.png");
    this.softWall = this.#image("SoftWall.png");
    this.initMap();
  }
  //so sánh dài, rộng của nhân vật và tường, đồng thời cũng kiểm tra va chạm giữa nhân vật và tường
  canMoveTo(x, y) {
    const characterWidth = 25;
    const characterHeight = 30;
    const tiles = [
      { x: Math.floor(x / this.tileSize), y: Math.floor(y / this.tileSize) },
      {
        x: Math.floor((x + characterWidth) / this.tileSize),
        y: Math.floor(y / this.tileSize),
      },
      {
        x: Math.floor(x / this.tileSize),
        y: Math.floor((y + characterHeight) / this.tileSize),
      },
      {
        x: Math.floor((x + characterWidth) / this.tileSize),
        y: Math.floor((y + characterHeight) / this.tileSize),
      },
    ];
    return tiles.every((tile) => {
      return (
        tile.y >= 0 &&
        tile.y < this.map.length &&
        tile.x >= 0 &&
        tile.x < this.map[tile.y].length &&
        this.map[tile.y][tile.x] === 0
      );
    });
  }
  ////////////////////////////
  #image(fileName) {
    const img = new Image();
    img.src = `/Image/${fileName}`;
    return img;
  }

  //use 2 mension array to draw a map
  // 1 is hard wall
  // 2 is soft wall

  initMap() {
    this.map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    this.addSoftWalls();
  }

  addSoftWalls() {
    const positions = [];
    const playerPosX = Math.floor(this.x / this.tileSize);
    const playerPosY = Math.floor(this.y / this.tileSize);
    const safeZoneTiles = Math.ceil(50 / this.tileSize);

    for (let i = 1; i < this.map.length - 1; i++) {
      for (let j = 1; j < this.map[i].length - 1; j++) {
        const isInSafeZone =
          i >= playerPosY - safeZoneTiles &&
          i <= playerPosY + safeZoneTiles &&
          j >= playerPosX - safeZoneTiles &&
          j <= playerPosX + safeZoneTiles;

        if (this.map[i][j] === 0 && !isInSafeZone) {
          positions.push([i, j]);
        }
      }
    }
    //Math.random(10) ý tưởng là để tạo nhiều kiểu softwall khác nhau
    const numberOfSoftWalls = Math.floor(positions.length * 0.2);
    for (let i = 0; i < numberOfSoftWalls; i++) {
      const index = Math.floor(Math.random() * positions.length);
      const pos = positions.splice(index, 1)[0];
      this.map[pos[0]][pos[1]] = 2;
    }
  }

  draw(canvas, ctx) {
    this.#setCanvasSize(canvas);
    this.#clearCanvas(canvas, ctx);
    this.#drawMap(ctx);
  }

  #drawMap(ctx) {
    const wallPadding = (this.tileSize - 45) / 2;
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        let image = null;
        switch (tile) {
          case 1:
            image = this.hardWall;
            break;
          case 2:
            image = this.softWall;
            break;
        }
        if (image != null)
          ctx.drawImage(
            image,
            column * this.tileSize + wallPadding,
            row * this.tileSize + wallPadding,
            45,
            45
          );
      }
    }
  }

  #clearCanvas(canvas, ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  #setCanvasSize(canvas) {
    canvas.height = this.map.length * this.tileSize;
    console.log(canvas.height);
    canvas.width = this.map[0].length * this.tileSize;
    console.log(canvas.width);
  }
}
