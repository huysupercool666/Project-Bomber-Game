import SpriteAnimation from "./SpriteAnimation.js";

export default class Bomb {
  constructor(x, y, tileSize) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.timer = 3000;
    this.exploded = false;
    this.bombAnimation = new SpriteAnimation(
      "BombAnimation(?).png",
      8,
      19,
      "plantBomb",
      false
    );
  }

  update(deltaTime) {
    if (this.timer > 0) {
      this.timer -= deltaTime;
      if (this.timer <= 0) {
        this.explode();
      }
    }
  }

  draw(ctx) {
    if (!this.exploded) {
      const image = this.bombAnimation.getImage();
      ctx.drawImage(image, this.x, this.y, this.tileSize, this.tileSize);
    }
  }

  explode() {
    this.exploded = true;
    console.log("Bomb exploded at", this.x, this.y);
  }
}
