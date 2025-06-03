class Endboss extends MovableObject {
  height = 420;
  width = 300;
  y = 48;
  hits = 0;
  isDead = false;
  isHurt = false;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 700;
    this.animate();
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.world?.isPaused) return;
      if (this.isDead) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt) {
        this.playAnimation(this.IMAGES_HURT);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  hit() {
    if (this.isDead) return;

    this.hits++;
    const energyLeft = Math.max(0, 100 - this.hits * 20);
    if (this.world && this.world.endbossBar) {
      this.world.endbossBar.setPercentage(energyLeft);
    }
    if (this.hits >= 5) {
      this.die();
    } else {
      this.isHurt = true;
      setTimeout(() => {
        this.isHurt = false;
      }, 1000);
    }
  }

  die() {
    this.isDead = true;
    this.isHurt = false;
    clearInterval(this.animationInterval);

    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 200);

    setTimeout(() => {
      const index = this.world.level.enemies.indexOf(this);
      if (index > -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 2000);
  }
}
