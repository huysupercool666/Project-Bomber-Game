import SpriteAnimation from "./SpriteAnimation.js";

export default class Monster {
  constructor(x, y, tileSize, type) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.type = type;
    this.alive = true;
    this.animations = this.#createAnimations(type);
    this.currentAnimation = this.animations.idle;
  }

  #createAnimations(type) {
    switch (type) {
      case 'monsterBallon':
        return {
          idle: new SpriteAnimation("monster1_idle.gif", 4, 300, 'idle', true),
          move: new SpriteAnimation("monster1_move.gif", 4, 100, 'move', true),
        };
      case 'monsterBear':
        return {
          idle: new SpriteAnimation("monster2_idle.gif", 4, 300, 'idle', true),
          move: new SpriteAnimation("monster2_move.gif", 4, 100, 'move', true),
        };
        case 'monsterBear':
        return {
          idle: new SpriteAnimation("monster2_idle.gif", 4, 300, 'idle', true),
          moveLeft: new SpriteAnimation("monster2_move.gif", 4, 100, 'move', true),
        };
        case 'monsterDuck':
        return {
          idle: new SpriteAnimation("monster2_idle.gif", 4, 300, 'idle', true),
          move: new SpriteAnimation("monster2_move.gif", 4, 100, 'move', true),
        };
        case 'monsterOctopus':
        return {
          idle: new SpriteAnimation("monster2_idle.gif", 4, 300, 'idle', true),
          move: new SpriteAnimation("monster2_move.gif", 4, 100, 'move', true),
        }; 
        case 'monsterBoar':
        return {
          idle: new SpriteAnimation("monster2_idle.gif", 4, 300, 'idle', true),
          move: new SpriteAnimation("monster2_move.gif", 4, 100, 'move', true),
        };
      // Add more monster types as needed
      default:
        return {
          idle: new SpriteAnimation("monster1_idle.gif", 4, 300, 'idle', true),
          move: new SpriteAnimation("monster1_move.gif", 4, 100, 'move', true),
        };
    }
  }

  update(deltaTime) {
    if (this.alive) {
      this.currentAnimation.update(deltaTime);
    }
  }

  draw(ctx) {
    if (this.alive) {
      const image = this.currentAnimation.getImage();
      ctx.drawImage(image, this.x, this.y, this.tileSize, this.tileSize);
    }
  }

  move() {
    // Logic for monster movement
    this.currentAnimation = this.animations.move;
  }
}