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
    this.isAlive = true;
    this.recentlyPlantedBombs = []; // Store recently planted bombs with timestamps
    this.recentlyPlantedBombTime = 500; // milliseconds to allow moving off the bomb tile
    this.tileMap.setBomberMan(this); // Set BomberMan reference in TileMap
  }

  draw(ctx) {
    if (!this.isAlive) {
      this.state = BomberManStates.dead;
      this.#displayGameOver(ctx);
      return; // Stop drawing further animations if the player is dead
    }
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
      bomb.update(20);
      bomb.draw(ctx);
    });
    this.bombs = this.bombs.filter((bomb) => !bomb.exploded);

    this.checkExplosionCollision();
  }

  checkExplosionCollision() {
    if (!this.isAlive) return;

    const bombExplosions = this.bombs.filter((bomb) => bomb.exploded);
    bombExplosions.forEach((bomb) => {
      const bombX = Math.floor(bomb.x / this.tileSize);
      const bombY = Math.floor(bomb.y / this.tileSize);
      const playerX = Math.floor(this.bomberManPosition.x / this.tileSize);
      const playerY = Math.floor(this.bomberManPosition.y / this.tileSize);

      if (playerX === bombX && playerY === bombY) {
        this.isAlive = false;
        return;
      }

      for (let i = 1; i <= bomb.explosionLength; i++) {
        // Check left explosion
        if (playerX === bombX - i && playerY === bombY) {
          this.isAlive = false;
          return;
        }
        // Check right explosion
        if (playerX === bombX + i && playerY === bombY) {
          this.isAlive = false;
          return;
        }
        // Check up explosion
        if (playerX === bombX && playerY === bombY - i) {
          this.isAlive = false;
          return;
        }
        // Check down explosion
        if (playerX === bombX && playerY === bombY + i) {
          this.isAlive = false;
          return;
        }
      }
    });
  }

  isInExplosion(x, y) {
    const playerX = Math.floor(this.bomberManPosition.x / this.tileSize);
    const playerY = Math.floor(this.bomberManPosition.y / this.tileSize);
    return playerX === x && playerY === y;
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
    if (!this.isAlive) return;

    const speed = 2;
    let newX =
      this.bomberManPosition.x +
      (this.rightPressed ? speed : 0) -
      (this.leftPressed ? speed : 0);
    let newY =
      this.bomberManPosition.y +
      (this.downPressed ? speed : 0) -
      (this.upPressed ? speed : 0);

    const currentTime = new Date().getTime();

    // Filter out expired recently planted bombs
    this.recentlyPlantedBombs = this.recentlyPlantedBombs.filter(
      (bomb) => currentTime - bomb.time < this.recentlyPlantedBombTime
    );

    const canMoveTo = (x, y) => {
      if (
        this.recentlyPlantedBombs.some(
          (bomb) =>
            Math.floor(bomb.x / this.tileSize) ===
              Math.floor(x / this.tileSize) &&
            Math.floor(bomb.y / this.tileSize) === Math.floor(y / this.tileSize)
        )
      ) {
        return true; // Temporarily allow moving off the bomb tile
      }
      return this.tileMap.canMoveTo(x, y);
    };

    if (canMoveTo(newX, this.bomberManPosition.y)) {
      this.bomberManPosition.x = newX;
    }
    if (canMoveTo(this.bomberManPosition.x, newY)) {
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
      this.tileMap.placeBomb(tileX, tileY);
      this.recentlyPlantedBombs.push({
        x: tileX,
        y: tileY,
        time: new Date().getTime(),
      });
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

  #displayGameOver(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", ctx.canvas.width / 2, ctx.canvas.height / 2);
  }
}
