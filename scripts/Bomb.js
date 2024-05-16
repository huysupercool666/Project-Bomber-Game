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
    this.explosionDuration = 3000; // milliseconds for how long the explosion lasts
    this.exploded = false;
    this.explodedTime = 0; // Track how long the explosion has been visible
    this.bombAnimation = new SpriteAnimation(
      "BombAnimation(?).png",
      4,
      40,
      "plantBomb",
      true
    );
    this.explosionAnimation = new SpriteAnimation(
      "ExplosiveAnimation(2).png",
      8,
      30,
      "bombExplosion",
      true
    );
    this.explosionLength = 3; // Number of tiles in each direction the explosion covers
  }

  update(deltaTime) {
    if (this.timer > 0) {
      this.timer -= deltaTime;
      if (this.timer <= 0) {
        this.explode();
      }
    } else if (this.exploded && this.explodedTime > 0) {
      this.explodedTime -= deltaTime;
      if (this.explodedTime <= 0) {
        this.remove();
      }
    }
  }

  draw(ctx) {
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
      this.drawExplosion(ctx);
    }
  }

  explode() {
    this.exploded = true;
    console.log("Bomb exploded at", this.x, this.y);
  }

  drawExplosion(ctx) {
    const centerImage = this.explosionAnimation.getImage();
    ctx.drawImage(centerImage, this.x, this.y, this.tileSize, this.tileSize);

    // Draw the explosion in all four directions, stopping at walls
    for (let i = 1; i <= this.explosionLength; i++) {
      // Left
      const leftX = this.x - i * this.tileSize;
      const leftY = this.y;
      if (this.tileMap.canMoveTo(leftX, leftY)) {
        const stepImage = this.explosionAnimation.getImage();
        ctx.drawImage(stepImage, leftX, leftY, this.tileSize, this.tileSize);
      } else break;

      // Right
      const rightX = this.x + i * this.tileSize;
      const rightY = this.y;
      if (this.tileMap.canMoveTo(rightX, rightY)) {
        const stepImage = this.explosionAnimation.getImage();
        ctx.drawImage(stepImage, rightX, rightY, this.tileSize, this.tileSize);
      } else break;

      // Up
      const upX = this.x;
      const upY = this.y - i * this.tileSize;
      if (this.tileMap.canMoveTo(upX, upY)) {
        const stepImage = this.explosionAnimation.getImage();
        ctx.drawImage(stepImage, upX, upY, this.tileSize, this.tileSize);
      } else break;

      // Down
      const downX = this.x;
      const downY = this.y + i * this.tileSize;
      if (this.tileMap.canMoveTo(downX, downY)) {
        const stepImage = this.explosionAnimation.getImage();
        ctx.drawImage(stepImage, downX, downY, this.tileSize, this.tileSize);
      } else break;
    }
  }

  remove() {
    // Implement remove logic if needed
  }
}
