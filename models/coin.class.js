class Coin extends MovableObject {
  baseY;
  wobbleOffset;

  constructor(x, y, wobbleOffset = 0) {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 80;
    this.height = 80;
    this.wobbleOffset = wobbleOffset;
  }

  animateWobble() {
    setInterval(() => {
      const time = Date.now() / 500;
      this.y = this.baseY + Math.sin(time + this.wobbleOffset) * 15;
    }, 50);
  }
}
