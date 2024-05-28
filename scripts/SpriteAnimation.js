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

  isFor(state) {
    return this.state === state;
  }

  reset() {
    this.imageIndex = 0;
    this.timerCount = this.timerCountDefault;
  }

  getImage() {
    this.#setImageIndex();
    return this.images[this.imageIndex];
  }

  getFrame(index) {
    return this.images[index];
  }

  #setImageIndex() {
    this.timerCount--;
    if (this.timerCount <= 0 && !this.#shouldStop()) {
      this.timerCount = this.timerCountDefault;
      this.imageIndex++;
      if (this.imageIndex >= this.images.length) {
        if (this.stopAtEnd) {
          this.imageIndex = this.images.length - 1;
        } else {
          this.imageIndex = 0;
        }
      }
    }
  }

  #shouldStop() {
    return this.stopAtEnd && this.imageIndex === this.images.length - 1;
  }

  isFinished() {
    return this.stopAtEnd && this.imageIndex === this.images.length - 1;
  }

  update() {
    this.#setImageIndex();
  }
}
