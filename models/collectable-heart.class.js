class CollectableHeart extends MovableObject {
  constructor(x, y) {
    super();
    this.loadImage("img/7_statusbars/3_icons/icon_health.png");
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
  }
}
