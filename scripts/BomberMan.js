import BomberManStates from "./BomberManStates.js";
import SpriteAnimation from "./SpriteAnimation.js";
export default class BomberMan {
  constructor() {
    this.state = BomberManStates.idle;
    this.#createAnimations();
    document.addEventListener("keydown", this.#keydown);
    document.addEventListener("keyup", this.#keyup);
    this.bomberManPosition = {
      x: 40,
      y: 25,
    };
  }
  getBomberManPosition() {
    console.log(bomberManPosition.x);
    return this.bomberManPosition;
  }
  draw(ctx) {
    this.#setState();
    this.#updatePosition();
    const animation = this.animations.find((animation) =>
      animation.isFor(this.state)
    );
    const image = animation.getImage();
    ctx.drawImage(image, this.bomberManPosition.x, this.bomberManPosition.y);
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
      this.bomberManPosition.x += speed;
    }
    if (this.leftPressed) {
      this.bomberManPosition.x -= speed;
    }
    if (this.upPressed) {
      this.bomberManPosition.y -= speed;
    }
    if (this.downPressed) {
      this.bomberManPosition.y += speed;
    }
  }
  //check Collision (so sánh x,y)
  #createAnimations() {
    this.characterIdle = new SpriteAnimation(
      "CharacterIdle.png",
      1,
      10,
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
    this.bombAnimation = new SpriteAnimation(
      "BombAnimation(?).png",
      8,
      9,
      BomberManStates.plantBomb
    );
    this.animations = [
      this.characterIdle,
      this.goDownAnimation,
      this.goUpAnimation,
      this.goLeftAnimation,
      this.goRightAnimation,
      this.deadAnimation,
      this.bombAnimation,
    ];
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
        this.bombPressed = true;
        break;
      //create dead animation and reset character
      case "KeyB":
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
      case "Space":
        this.BombPressed = false;
        break;
    }
  };
}
