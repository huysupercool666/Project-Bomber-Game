export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.hardWall = this.#image("HardWall.png");
    this.softWall = this.#image("SoftWall.png");
    this.initMap();
  }

  #image(fileName) {
    const img = new Image();
    img.src = `Image/${fileName}`;
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
    for (let i = 1; i < this.map.length - 1; i++) {
      for (let j = 1; j < this.map[i].length - 1; j++) {
        if (this.map[i][j] === 0) {
          positions.push([i, j]);
        }
      }
    }
    const numberOfSoftWalls = positions.length * 0.2;
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
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            this.tileSize
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
