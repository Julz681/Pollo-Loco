class Endboss extends MovableObject {
  height = 420;
  width = 300;
  y = 48;
  hits = 0;
  isDead = false;
  isHurt = false;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
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

  walkingSpeed = 2;

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
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
        return;
      }
      if (this.isHurt) {
        this.playAnimation(this.IMAGES_HURT);
        return;
      }
      const character = this.world.character;
      const distance = character.x - this.x;
      const attackDistance = 300;
      if (distance < -attackDistance) {
        this.otherDirection = false; 
        this.moveLeft(this.walkingSpeed);
        this.playAnimation(this.IMAGES_WALKING);
      }
      else if (distance > attackDistance) {
        this.otherDirection = true; 
        this.moveRight(this.walkingSpeed);
        this.playAnimation(this.IMAGES_WALKING);
      }
      else {
        this.playAnimation(this.IMAGES_ATTACK);
      }
    }, 200);
  }

  moveLeft(speed = this.walkingSpeed) {
    this.x -= speed;
  }

  moveRight(speed = this.walkingSpeed) {
    this.x += speed;
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
