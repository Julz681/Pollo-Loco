class CollectableHeart extends MovableObject {
  constructor(x, y) {
    super();
    this.loadImage("img/7_statusbars/3_icons/icon_health.png");
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = 60;
    this.height = 60;

    this.animateWobble();
  }

  animateWobble() {
    setInterval(() => {
      const time = Date.now() / 600;
      this.y = this.baseY + Math.sin(time) * 10;
    }, 50);
  }
}
