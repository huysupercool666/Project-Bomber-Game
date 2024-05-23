export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.x = 100;
    this.y = 50;
    this.hardWall = this.#image("HardWall.png");
    this.softWall = this.#image("SoftWall.png");
    this.initMap();
    this.bombPositions = new Set();
  }

  setBomberMan(bomberMan) {
    this.bomberMan = bomberMan;
  }

  canMoveTo(x, y) {
    const characterWidth = this.tileSize * 0.6;
    const characterHeight = this.tileSize * 0.6;

    const corners = [
      { x: x, y: y },
      { x: x + characterWidth, y: y },
      { x: x, y: y + characterHeight },
      { x: x + characterWidth, y: y + characterHeight },
    ];

    return corners.every((corner) => {
      const tileX = Math.floor(corner.x / this.tileSize);
      const tileY = Math.floor(corner.y / this.tileSize);
      const tileKey = `${tileX},${tileY}`;

      return (
        tileY >= 0 &&
        tileY < this.map.length &&
        tileX >= 0 &&
        tileX < this.map[tileY].length &&
        this.map[tileY][tileX] === 0 &&
        !this.bombPositions.has(tileKey)
      );
    });
  }

  canMoveToIgnoreBomb(x, y) {
    const characterWidth = this.tileSize * 0.3;
    const characterHeight = this.tileSize * 0.3;
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

  placeBomb(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    this.bombPositions.add(`${tileX},${tileY}`);
  }

  removeBomb(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    this.bombPositions.delete(`${tileX},${tileY}`);
  }

  // Check if a tile contains a soft wall
  hasSoftWall(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    return this.map[tileY][tileX] === 2;
  }

  // Remove a soft wall tile
  removeTile(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    if (this.map[tileY][tileX] === 2) {
      this.map[tileY][tileX] = 0;
    }
  }

  #image(fileName) {
    const img = new Image();
    img.src = `/Image/${fileName}`;
    return img;
  }

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

  getRandomNumberInRange(min, max) {
    return (Math.random() * (max - min) + min) / 10;
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
    const numberOfSoftWalls = Math.floor(
      positions.length * this.getRandomNumberInRange(5, 10)
    );
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
    canvas.width = this.map[0].length * this.tileSize;
  }
}
