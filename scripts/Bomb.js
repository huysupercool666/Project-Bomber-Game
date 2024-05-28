import BomberManStates from "./BomberManStates.js";
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
    this.explosionDuration = 2000; // milliseconds for how long the explosion lasts
    this.exploded = false;
    this.explodedTime = 3000; // Track how long the explosion has been visible
    this.isCharacterOverlapping = true; // Initially true when bomb is placed
    this.bombAnimation = new SpriteAnimation(
      "BombAnimation(?).png", // Adjust the file name template as needed
      4, // Number of images for bomb animation
      40, // Timer count for bomb animation
      "plantBomb",
      true
    );
    this.explosionAnimation = new SpriteAnimation(
      "ExplosiveAnimation(?).png", // Adjust the file name template for explosion sprite
      5, // Number of images for explosion animation
      1000, // Timer count for explosion animation
      "bombExplosion",
      true
    );
    this.explosionLength = 1;
  }

  update(deltaTime) {
    if (this.timer > 0) {
      this.timer -= deltaTime;
      this.bombAnimation.update();
      if (this.timer <= 0) {
        this.explodedTime = this.explosionDuration;
        this.explode();
        this.explodedTime = this.explosionDuration;
      }
    } else if (this.exploded && this.explodedTime > 0) {
      this.explodedTime -= deltaTime;
      this.explosionAnimation.update();
      if (this.explodedTime <= 0) {
        this.remove();
      }
    }
  }

  draw(ctx) {
    if (!this.exploded) {
      const image = this.bombAnimation.getImage();
      ctx.drawImage(image, this.x, this.y, this.tileSize, this.tileSize);
    } else {
      this.drawExplosion(ctx);
    }
  }

  explode() {
    this.exploded = true;
    this.tileMap.removeBomb(this.x, this.y);
  }

  drawExplosion(ctx) {
    const centerImage = this.explosionAnimation.getFrame(0);
    ctx.drawImage(centerImage, this.x, this.y, this.tileSize, this.tileSize);

    const getExplosionImage = (direction) => {
      // Tùy thuộc vào sprite của bạn, bạn có thể cần điều chỉnh để lấy đúng hình ảnh
      switch (direction) {
        case "left":
          return this.explosionAnimation.getFrame(1); // Frame cho hướng trái
        case "right":
          return this.explosionAnimation.getFrame(2); // Frame cho hướng phải
        case "up":
          return this.explosionAnimation.getFrame(3); // Frame cho hướng lên
        case "down":
          return this.explosionAnimation.getFrame(4); // Frame cho hướng xuống
        default:
          return centerImage;
      }
    };

    const propagateExplosion = (startX, startY, stepX, stepY, direction) => {
      const explosionImage = getExplosionImage(direction);
      for (let i = 1; i <= this.explosionLength; i++) {
        const x = startX + i * stepX;
        const y = startY + i * stepY;
        if (this.tileMap.hasSoftWall(x, y)) {
          this.tileMap.removeTile(x, y);
          ctx.drawImage(explosionImage, x, y, this.tileSize, this.tileSize);
          break;
        } else if (this.tileMap.canMoveToIgnoreBomb(x, y)) {
          ctx.drawImage(explosionImage, x, y, this.tileSize, this.tileSize);
          if (
            this.tileMap.bomberMan &&
            this.tileMap.bomberMan.isInExplosion(
              Math.floor(x / this.tileSize),
              Math.floor(y / this.tileSize)
            )
          ) {
            this.tileMap.bomberMan.state = BomberManStates.dead;
          }
        } else {
          break;
        }
      }
    };

    propagateExplosion(this.x, this.y, -this.tileSize, 0, "left"); // Left
    propagateExplosion(this.x, this.y, this.tileSize, 0, "right"); // Right
    propagateExplosion(this.x, this.y, 0, -this.tileSize, "up"); // Up
    propagateExplosion(this.x, this.y, 0, this.tileSize, "down"); // Down
  }

  remove() {
    this.tileMap.removeBomb(this.x, this.y);
  }

  isOverlapping(x, y, width, height) {
    return !(
      x + width <= this.x ||
      x >= this.x + this.tileSize ||
      y + height <= this.y ||
      y >= this.y + this.tileSize
    );
  }
}
