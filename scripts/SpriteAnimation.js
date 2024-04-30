import img from "./Img.js";
export default class SpriteAnimation {
  images = [];
  constructor(fileNameTemplate, numberOfImages, timerCount, state, stopAtEnd) {
    for (let serialNum = 1; serialNum <= numberOfImages; serialNum++) {
      const image = img(fileNameTemplate.replace("?", serialNum));
      this.images.push(image);
    }
    this.timerCount = timerCount;
    this.timerCountDefault = this.timerCount;
    this.imageIndex = 0;
    this.state = state;
    this.stopAtEnd = stopAtEnd;
  }

  draw(ctx) {
    const image = this.characterIdle.getImage();
    const x = 50;
    const y = 25;
    ctx.drawImage(image, x, y);
  }

  isFor(state) {
    return this.state === state;
  }

  reset() {
    // this function when character dead and reset the animation.
    this.imageIndex = 0;
  }

  getImage() {
    this.#setImageIndex();
    return this.images[this.imageIndex];
  }

  #setImageIndex() {
    this.timerCount--;
    if (this.timerCount <= 0 && !this.#shouldStop()) {
      this.timerCount = this.timerCountDefault;
      this.imageIndex++;
      if (this.imageIndex >= this.images.length) {
        this.imageIndex = 0;
      }
    }
  }

  #shouldStop() {
    return this.stopAtEnd && this.imageIndex === this.images.length - 1;
  }
}