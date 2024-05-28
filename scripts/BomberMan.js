import Bomb from "./Bomb.js";
import BomberManStates from "./BomberManStates.js";
import SpriteAnimation from "./SpriteAnimation.js";

export default class BomberMan {
  constructor(tileMap, tileSize) {
    this.tileMap = tileMap;
    this.tileSize = tileSize;
    this.characterSize = tileSize * 0.6; // Chỉnh sửa kích thước nhân vật
    this.state = BomberManStates.idle;
    this.bombs = [];
    this.#createAnimations();
    document.addEventListener("keydown", this.#keydown);
    document.addEventListener("keyup", this.#keyup);
    this.bomberManPosition = { x: 58, y: 50 };
    this.isAlive = true;
    this.recentlyPlantedBombs = [];
    this.recentlyPlantedBombTime = 500;
    this.characterMovedOffBomb = false; // Trạng thái di chuyển khỏi vị trí bom
    this.tileMap.setBomberMan(this);
    this.idleResetTime = 120; // Thời gian reset Idle
    this.lastActionTime = new Date().getTime();
    this.currentAnimation = this.characterIdle; // Hoạt ảnh hiện tại
  }

  draw(ctx) {
    if (this.state === BomberManStates.dead) {
      // Hiển thị hoạt ảnh "dead"
      if (this.deadAnimation && !this.deadAnimation.isFinished()) {
        this.currentAnimation = this.deadAnimation;
        this.currentAnimation.update(); // Cập nhật khung hình hoạt ảnh
      } else {
        this.isAlive = false; // Đánh dấu nhân vật đã chết
        this.#displayGameOver(ctx); // Hiển thị màn hình Game Over
        return;
      }
    } else {
      this.#setState();
      this.#updatePosition();
    }

    // Vẽ bomb trước nhân vật
    this.bombs.forEach((bomb) => {
      bomb.update(20);
      bomb.draw(ctx);
    });

    if (this.currentAnimation && this.currentAnimation.state !== this.state) {
      this.currentAnimation.reset();
    }
    this.currentAnimation = this.animations.find((animation) =>
      animation.isFor(this.state)
    );
    if (this.currentAnimation) {
      const image = this.currentAnimation.getImage();
      ctx.drawImage(
        image,
        this.bomberManPosition.x,
        this.bomberManPosition.y,
        this.characterSize,
        this.characterSize
      );
    }

    this.bombs = this.bombs.filter((bomb) => !bomb.exploded);
  }

  isInExplosion(x, y) {
    const playerX = Math.floor(this.bomberManPosition.x / this.tileSize);
    const playerY = Math.floor(this.bomberManPosition.y / this.tileSize);
    return playerX === x && playerY === y;
  }

  #setState() {
    const currentTime = new Date().getTime();
    if (this.deadPressed) {
      this.state = BomberManStates.dead;
    } else if (this.rightPressed) {
      this.state = BomberManStates.right;
      this.lastActionTime = currentTime;
    } else if (this.leftPressed) {
      this.state = BomberManStates.left;
      this.lastActionTime = currentTime;
    } else if (this.upPressed) {
      this.state = BomberManStates.up;
      this.lastActionTime = currentTime;
    } else if (this.downPressed) {
      this.state = BomberManStates.down;
      this.lastActionTime = currentTime;
    } else if (currentTime - this.lastActionTime > this.idleResetTime) {
      this.state = BomberManStates.idle;
    }
  }

  #updatePosition() {
    const speed = 2;
    const characterWidth = this.tileSize * 0.7;
    const characterHeight = this.tileSize * 0.7;
    const currentX = this.bomberManPosition.x;
    const currentY = this.bomberManPosition.y;

    const newX =
      currentX +
      (this.rightPressed ? speed : 0) -
      (this.leftPressed ? speed : 0);
    const newY =
      currentY + (this.downPressed ? speed : 0) - (this.upPressed ? speed : 0);

    const canMoveTo = (x, y) => {
      const bombAtNewPosition = this.bombs.find((bomb) =>
        bomb.isOverlapping(x, y, characterWidth, characterHeight)
      );
      if (bombAtNewPosition) {
        if (bombAtNewPosition.isCharacterOverlapping) {
          return true; // Cho phép di chuyển khỏi ô bomb
        } else {
          return false; // Ngăn di chuyển vào ô bomb
        }
      }
      return this.tileMap.canMoveTo(x, y);
    };

    const wasOnBomb = this.isCharacterOnBomb();

    if (canMoveTo(newX, currentY)) {
      this.bomberManPosition.x = newX;
    } else {
      this.bomberManPosition.x = currentX;
    }

    if (canMoveTo(this.bomberManPosition.x, newY)) {
      this.bomberManPosition.y = newY;
    } else {
      this.bomberManPosition.y = currentY;
    }

    const isNowOnBomb = this.isCharacterOnBomb();

    if (wasOnBomb && !isNowOnBomb) {
      this.characterMovedOffBomb = true;
      this.compareCharacterAndBombPositions();
    }

    // Cập nhật trạng thái của bomb để ngừng chồng chéo sau khi nhân vật di chuyển
    this.bombs.forEach((bomb) => {
      if (
        !bomb.isOverlapping(
          this.bomberManPosition.x,
          this.bomberManPosition.y,
          characterWidth,
          characterHeight
        )
      ) {
        bomb.isCharacterOverlapping = false;
      }
    });
  }

  isCharacterOnBomb() {
    const characterWidth = this.tileSize * 0.6;
    const characterHeight = this.tileSize * 0.6;

    return this.bombs.some((bomb) =>
      bomb.isOverlapping(
        this.bomberManPosition.x,
        this.bomberManPosition.y,
        characterWidth,
        characterHeight
      )
    );
  }

  compareCharacterAndBombPositions() {
    this.bombs.forEach((bomb) => {
      const characterTileX = Math.floor(
        this.bomberManPosition.x / this.tileSize
      );
      const characterTileY = Math.floor(
        this.bomberManPosition.y / this.tileSize
      );
      const bombTileX = Math.floor(bomb.x / this.tileSize);
      const bombTileY = Math.floor(bomb.y / this.tileSize);

      console.log(`Character Position: (${characterTileX}, ${characterTileY})`);
      console.log(`Bomb Position: (${bombTileX}, ${bombTileY})`);
    });
  }

  #createAnimations() {
    this.characterIdle = new SpriteAnimation(
      "CharacterIdle(?).png",
      4,
      300,
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
      20,
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
    // if (this.bombs.length > 0) {
    //   return; // Chỉ đặt một bomb tại một thời điểm
    // }

    const tileX = 
      Math.floor(this.bomberManPosition.x / this.tileSize) * this.tileSize;
    const tileY =
      Math.floor(this.bomberManPosition.y / this.tileSize) * this.tileSize;

    // Đặt bomb ngay dưới nhân vật
    const bomb = new Bomb(tileX, tileY, this.tileSize, this.tileMap);
    this.bombs.push(bomb);
    this.recentlyPlantedBombs.push({
      x: tileX,
      y: tileY,
      time: new Date().getTime(),
    });
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
    ctx.fillText("Game Over", ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);

    // Thêm nút "Restart"
    const buttonX = ctx.canvas.width / 2 - 50;
    const buttonY = ctx.canvas.height / 2;
    const buttonWidth = 100;
    const buttonHeight = 40;

    ctx.fillStyle = "white";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = "black";
    ctx.font = "24px sans-serif";
    ctx.fillText("Restart", ctx.canvas.width / 2, buttonY + 28);

    // Lắng nghe sự kiện click vào nút "Restart"
    //canvas.addEventListener("click", this.#handleRestartClick);
  }

  // #handleRestartClick = (event) => {
  //   const canvas = event.target;
  //   const rect = canvas.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;

  //   const buttonX = canvas.width / 2 - 50;
  //   const buttonY = canvas.height / 2;
  //   const buttonWidth = 100;
  //   const buttonHeight = 40;

  //   if (
  //     x >= buttonX &&
  //     x <= buttonX + buttonWidth &&
  //     y >= buttonY &&
  //     y <= buttonY + buttonHeight
  //   ) {
  //     this.#restartGame();
  //   }
  // };

  // #restartGame() {
  //   // Đặt lại các trạng thái và vị trí của trò chơi
  //   this.bomberManPosition = { x: 58, y: 50 };
  //   this.state = BomberManStates.idle;
  //   this.isAlive = true;
  //   this.bombs = [];
  //   this.tileMap.initMap();
  //   this.currentAnimation = this.characterIdle;
  //   // Xóa sự kiện click
  //   const canvas = document.querySelector("canvas");
  //   canvas.removeEventListener("click", this.#handleRestartClick);
  // }
}
