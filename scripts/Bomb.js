import SpriteAnimation from "./SpriteAnimation.js";

export default class Bomb {
  constructor(x, y, tileSize) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.timer = 3000;
    this.explosionDuration = 500;
    this.exploded = false;
    this.explodedTime = 0;
    this.bombAnimation = new SpriteAnimation(
      "BombAnimation(?).png",
      3,
      40,
      "plantBomb",
      true
    );
    this.explosionAnimation = new SpriteAnimation(
      "ExplosiveAnimation(?).png",
      8,
      3000,
      "bombExplosion",
      true
    );
    this.explosionLength = 3;
  }

  update(deltaTime) {
    if (this.timer > 0) {
      this.timer -= deltaTime;
      if (this.timer <= 0) {
        this.explode();
        this.explodedTime = this.explosionDuration;
      }
    }
    if (this.exploded && this.explodedTime > 0) {
      this.explodedTime -= deltaTime;
      if (this.explodedTime <= 0) {
        this.remove();
      }
    }
  }

  draw(ctx, deltaTime) {
    if (!this.exploded) {
      const image = this.bombAnimation.getImage(deltaTime);
      ctx.drawImage(
        image,
        this.x + (this.tileSize - image.width) / 2,
        this.y + (this.tileSize - image.height) / 2,
        image.width,
        image.height
      );
    } else if (this.exploded && this.explodedTime > 0) {
      this.drawExplosion(ctx, deltaTime);
    }
  }

  explode() {
    this.exploded = true;
    console.log("Bomb exploded at", this.x, this.y);
  }

  drawExplosion(ctx, deltaTime) {
    const centerImage = this.explosionAnimation.getImage(deltaTime);
    ctx.drawImage(centerImage, this.x, this.y, this.tileSize, this.tileSize);

    for (let i = 1; i <= this.explosionLength; i++) {
      const stepImage = this.explosionAnimation.getImage(deltaTime);

      // Draw to the left
      ctx.drawImage(
        stepImage,
        this.x - i * this.tileSize,
        this.y,
        this.tileSize,
        this.tileSize
      );

      // Draw to the right
      ctx.drawImage(
        stepImage,
        this.x + i * this.tileSize,
        this.y,
        this.tileSize,
        this.tileSize
      );

      // Draw upwards
      ctx.drawImage(
        stepImage,
        this.x,
        this.y - i * this.tileSize,
        this.tileSize,
        this.tileSize
      );

      // Draw downwards
      ctx.drawImage(
        stepImage,
        this.x,
        this.y + i * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }
  }

  remove() {
    // Implement remove logic if needed
  }
}
