import SpriteAnimation from "./SpriteAnimation.js";

export default class Bomb {
  constructor(x, y, tileSize, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.tileMap = tileMap;
    this.width = tileSize;
    this.height = tileSize;
    this.timer = 3000; // milliseconds until the bomb explodes
    this.explosionDuration = 1000; // milliseconds for how long the explosion lasts
    this.exploded = false;
    this.explodedTime = 3000; // Track how long the explosion has been visible
    this.bombAnimation = new SpriteAnimation(
      "BombAnimation(?).png",
      4,
      40,
      "plantBomb",
      true
    );
    this.explosionAnimation = new SpriteAnimation(
      "ExplosiveAnimation(2).png",
      2,
      30,
      "bombExplosion",
      true
    );
    this.explosionLength = 2; // Number of tiles in each direction the explosion covers
  }

  update(deltaTime) {
    if (this.timer > 0) {
      this.timer -= deltaTime;
      if (this.timer <= 0) {
        this.explodedTime = this.explosionDuration;
        this.explode();
        this.explodedTime = this.explosionDuration;
      }
    } else if (this.exploded && this.explodedTime > 0) {
      this.explodedTime -= deltaTime;
      if (this.explodedTime <= 0) {
        this.remove();
      }
    }
  }

  draw(ctx, deltaTime) {
    if (!this.exploded) {
      const image = this.bombAnimation.getImage();
      ctx.drawImage(
        image,
        this.x + (this.tileSize - image.width) / 2,
        this.y + (this.tileSize - image.height) / 2,
        this.tileSize,
        this.tileSize
      );
    } else {
      this.drawExplosion(ctx, deltaTime);
    }
  }

  explode() {
    this.exploded = true;
  }

  drawExplosion(ctx, deltaTime) {
    ctx.fillStyle = "#D72B16"; // Orange color for the explosion

    // Draw the center explosion
    ctx.fillRect(this.x, this.y, this.tileSize, this.tileSize);

    // Function to handle the explosion propagation
    const propagateExplosion = (startX, startY, stepX, stepY, color) => {
      ctx.fillStyle = color;
      for (let i = 1; i <= this.explosionLength; i++) {
        const x = startX + i * stepX;
        const y = startY + i * stepY;
        if (this.tileMap.hasSoftWall(x, y)) {
          this.tileMap.removeTile(x, y);
          ctx.fillRect(x, y, this.tileSize, this.tileSize);
          break;
        } else if (this.tileMap.canMoveTo(x, y)) {
          ctx.fillRect(x, y, this.tileSize, this.tileSize);
        } else {
          break;
        }
      }
    };

    // Draw the explosion in all four directions
    propagateExplosion(this.x, this.y, -this.tileSize, 0, "#F39642"); // Left
    propagateExplosion(this.x, this.y, this.tileSize, 0, "#F39642"); // Right
    propagateExplosion(this.x, this.y, 0, -this.tileSize, "#FFE5A8"); // Up
    propagateExplosion(this.x, this.y, 0, this.tileSize, "#FFE5A8"); // Down
  }

  remove() {
    // Implement any additional removal logic if needed
  }
}
