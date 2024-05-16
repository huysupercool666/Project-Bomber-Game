import Bomb from "./Bomb.js";
import BomberManStates from "./BomberManStates.js";
import SpriteAnimation from "./SpriteAnimation.js";

export default class BomberMan {
  constructor(tileMap, tileSize) {
    this.tileMap = tileMap;
    this.tileSize = tileSize;
    this.state = BomberManStates.idle;
    this.bombs = [];
    this.#createAnimations();
    document.addEventListener("keydown", this.#keydown);
    document.addEventListener("keyup", this.#keyup);
    this.bomberManPosition = { x: 57, y: 48 }; // Adjust starting position if necessary
  }

  draw(ctx) {
    this.#setState();
    this.#updatePosition();
    const animation = this.animations.find((animation) =>
      animation.isFor(this.state)
    );
    if (animation) {
      const image = animation.getImage();
      ctx.drawImage(image, this.bomberManPosition.x, this.bomberManPosition.y);
    }
    this.bombs.forEach((bomb) => {
      bomb.update(20); // Assuming 20 is the deltaTime for simplicity
      bomb.draw(ctx);
    });
    this.bombs = this.bombs.filter((bomb) => !bomb.exploded);
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
    let newX =
      this.bomberManPosition.x +
      (this.rightPressed ? speed : 0) -
      (this.leftPressed ? speed : 0);
    let newY =
      this.bomberManPosition.y +
      (this.downPressed ? speed : 0) -
      (this.upPressed ? speed : 0);

    if (this.tileMap.canMoveTo(newX, this.bomberManPosition.y)) {
      this.bomberManPosition.x = newX;
    }
    if (this.tileMap.canMoveTo(this.bomberManPosition.x, newY)) {
      this.bomberManPosition.y = newY;
    }
  }

  #createAnimations() {
    this.characterIdle = new SpriteAnimation(
      "CharacterIdle(?).png",
      4,
      200,
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
      9,
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

  plantBomb() {
    const tileX =
      Math.floor(this.bomberManPosition.x / this.tileSize) * this.tileSize;
    const tileY =
      Math.floor(this.bomberManPosition.y / this.tileSize) * this.tileSize; 
    if (this.tileMap.canMoveTo(tileX, tileY)) {
      const bomb = new Bomb(tileX, tileY, this.tileSize, this.tileMap);
      this.bombs.push(bomb);
    }
  }

  #keydown = (event) => {
    switch (event.code) {
      case "KeyD":
        this.rightPressed = true;
        break;
      case "KeyA":
        this.leftPressed = true;
        break;
      case "KeyW":
        this.upPressed = true;
        break;
      case "KeyS":
        this.downPressed = true;
        break;
      case "Space":
        this.plantBomb();
        break;
      case "KeyB":
        this.deadPressed = true;
        break;
      case "KeyR":
        this.deadPressed = false;
        if (this.deadAnimation && this.deadAnimation.reset) {
          this.deadAnimation.reset();
        }
        break;
    }
  };

  #keyup = (event) => {
    switch (event.code) {
      case "KeyD":
        this.rightPressed = false;
        break;
      case "KeyA":
        this.leftPressed = false;
        break;
      case "KeyW":
        this.upPressed = false;
        break;
      case "KeyS":
        this.downPressed = false;
        break;
    }
  };
}
