class SoundManager {
  constructor(world) {
    this.world = world;
  }

  initSounds() {
    this.world.sounds = {
      background: new Audio("audio/background.mp3"),
      gamePaused: new Audio("audio/game_paused.mp3"),
      bottleFind: new Audio("audio/bottle_find.mp3"),
      coin: new Audio("audio/coin.mp3"),
      heart: new Audio("audio/heart.mp3"),
      throw: new Audio("audio/throw.mp3"),
      hurt: new Audio("audio/hurt.mp3"),
      die: new Audio("audio/die.mp3"),
      bottleBreak: new Audio("audio/bottle_break.mp3"),
      chickenDie: new Audio("audio/chicken_die.mp3"),
      endbossHurt: new Audio("audio/endboss_hurt.mp3"),
      endbossDie: new Audio("audio/endboss_die.mp3"),
      applause: new Audio("audio/applause.mp3"),
      jump_sound: new Audio("audio/jump.mp3"),
    };
  }

  muteAllSounds() {
    Object.values(this.world.sounds).forEach((sound) => {
      sound.muted = true;
      if (!sound.paused) sound.pause();
    });
    this.world.isMuted = true;
    localStorage.setItem("isMuted", "true");
    this.world.updateMuteIcon();
  }

  unmuteAllSounds() {
    Object.values(this.world.sounds).forEach((sound) => {
      sound.muted = false;
    });
    if (!this.world.isPaused && !this.world.isGameOver && this.world.sounds.background.paused) {
      this.world.sounds.background.play();
    }
    this.world.isMuted = false;
    localStorage.setItem("isMuted", "false");
    this.world.updateMuteIcon();
  }

  playThrowSound() {
    this.world.sounds.throw.currentTime = 0;
    this.world.sounds.throw.play();
  }

  playHurtSound() {
    this.world.sounds.hurt.currentTime = 0;
    this.world.sounds.hurt.play();
  }

  playChickenDieSound() {
    this.world.sounds.chickenDie.currentTime = 0;
    this.world.sounds.chickenDie.play();
  }

  playEndbossHurtSound() {
    this.world.sounds.endbossHurt.currentTime = 0;
    this.world.sounds.endbossHurt.play();
  }

  playBottleFindSound() {
    this.world.sounds.bottleFind.currentTime = 0;
    this.world.sounds.bottleFind.play();
  }

  playCoinSound() {
    this.world.sounds.coin.currentTime = 0;
    this.world.sounds.coin.volume = 0.5;
    this.world.sounds.coin.play();
  }

  playHeartSound() {
    this.world.sounds.heart.currentTime = 0;
    this.world.sounds.heart.play();
  }

  playDieSound() {
    this.world.sounds.die.currentTime = 0;
    this.world.sounds.die.play();
  }

  playEndbossDieSound() {
    this.world.sounds.endbossDie.currentTime = 0;
    this.world.sounds.endbossDie.play();
  }

  pauseBackgroundSound() {
    this.world.sounds.background.pause();
    this.world.sounds.background.currentTime = 0;
  }
}
