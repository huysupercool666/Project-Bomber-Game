import BomberManStates from "./BomberManStates.js";
import SpriteAnimation from "./SpriteAnimation.js";
export default class BomberMan {
  constructor() {
    this.state = BomberManStates.idle;
    this.x = 40;
    this.y = 25;
    this.height = 20;
    this.width = 20;
    this.tileSize = 32;
    this.#createAnimations();
    document.addEventListener("keydown", this.#keydown);
    document.addEventListener("keyup", this.#keyup);
  }
  draw(ctx) {
    this.#setState();
    this.#updatePosition();
    const animation = this.animations.find((animation) =>
      animation.isFor(this.state)
    );
    const image = animation.getImage();
    ctx.drawImage(image, this.x, this.y);
  }

  #setState() {
    if (this.deadPressed) {
      this.state = BomberManStates.dead;
    } else if (this.rightPressed) {
      this.state = BomberManStates.right;
    } else if (this.leftPressed) {
      this.state = BomberManStates.left;
    } else if (this.upPressed) {
      this.state = BomberManStates.up;
    } else if (this.downPressed) {
      this.state = BomberManStates.down;
    } else {
      this.state = BomberManStates.idle;
    }
  }
  #updatePosition() {
    const speed = 2;
    if (this.rightPressed) {
      this.x += speed;
    }
    if (this.leftPressed) {
      this.x -= speed;
    }
    if (this.upPressed && this.y > 32) {
      this.y -= speed;
    }
    if (this.downPressed) {
      this.y += speed;
    }
  }
  #canMoveTo(x, y) {
    return this.map[y][x] === 0;
  }
  #createAnimations() {
    this.characterIdle = new SpriteAnimation(
      "CharacterIdle.png",
      1,
      1,
      BomberManStates.idle
    );
    this.goDownAnimation = new SpriteAnimation(
      "CharacterMoveDown(?).png",
      4,
      10,
      BomberManStates.down
    );
    this.goUpAnimation = new SpriteAnimation(
      "CharacterMoveUp(?).png",
      4,
      10,
      BomberManStates.up
    );
    this.goLeftAnimation = new SpriteAnimation(
      "CharacterMoveLeft(?).png",
      4,
      10,
      BomberManStates.left
    );
    this.goRightAnimation = new SpriteAnimation(
      "CharacterMoveRight(?).png",
      4,
      10,
      BomberManStates.right
    );
    this.deadAnimation = new SpriteAnimation(
      "DeadAnimation(?).png",
      8,
      9,
      BomberManStates.dead,
      true
    );
    this.animations = [
      this.characterIdle,
      this.goDownAnimation,
      this.goUpAnimation,
      this.goLeftAnimation,
      this.goRightAnimation,
      this.deadAnimation,
    ];
  }

  #keydown = (event) => {
    switch (event.code) {
      case "ArrowRight":
        this.rightPressed = true;
        break;
      case "ArrowLeft":
        this.leftPressed = true;
        break;
      case "ArrowUp":
        this.upPressed = true;
        break;
      case "ArrowDown":
        this.downPressed = true;
        break;
      case "KeyD":
        this.deadPressed = true;
        break;
      case "KeyR":
        this.deadPressed = false;
        this.deadAnimation.reset();
        break;
    }
  };

  #keyup = (event) => {
    switch (event.code) {
      case "ArrowRight":
        this.rightPressed = false;
        break;
      case "ArrowLeft":
        this.leftPressed = false;
        break;
      case "ArrowUp":
        this.upPressed = false;
        break;
      case "ArrowDown":
        this.downPressed = false;
        break;
    }
  };
}
