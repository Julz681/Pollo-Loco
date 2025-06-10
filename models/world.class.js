class World {
  character = new Character();
  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  statusBar = new StatusBar();
  throwableObject = [];
  endbossBar = new StatusBarEndboss();
  statusBarBottle = new StatusBarBottle();
  coinBar = new CoinStatusBar();
  endScreenImage = null;
  endScreenX = null;
  showingEndScreen = false;
  isPaused = false;
  pauseImage = null;
  isGameOver = false;
  deaths = 0;
  coinsCollectedFinal = 0;
  startTime = 0;
  isMuted = false;

constructor(canvas, keyboard, level) {
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.keyboard = keyboard;
  this.level = level;

  this.initSounds();
  this.sounds.background.loop = true;
  this.sounds.background.volume = 0.5;
  const storedMute = localStorage.getItem('isMuted');
  if (storedMute === 'true') {
    this.muteAllSounds();
  } else {
    this.unmuteAllSounds();
    this.sounds.background.play();
  }

  this.draw();
  this.setWorld();
  this.run();
}


  initSounds() {
    this.sounds = {
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

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
    this.pauseImage = new Image();
    this.pauseImage.src = "img/You won, you lost/Game_paused.png";
  }

  run() {
    setInterval(() => {
      this.handlePauseToggle();
      if (this.isPaused || this.isGameOver) return;

      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  handlePauseToggle() {
    if (this.keyboard.P) this.isPaused = true;
    if (this.keyboard.C) this.isPaused = false;
  }

  checkThrowObjects() {
    if (
      this.keyboard.D &&
      this.statusBarBottle.percentage > 0 &&
      !this.character.isThrowing
    ) {
      this.throwBottle();
    }
  }

  throwBottle() {
    this.createBottle();
    this.startThrowAnimation();
    this.updateBottleStatus();
    this.playThrowSound();
  }

  createBottle() {
    let offsetX = this.character.otherDirection ? -100 : 100;
    let bottle = new throwableObject(
      this.character.x + offsetX,
      this.character.y + 100
    );
    bottle.otherDirection = this.character.otherDirection;
    bottle.world = this;
    this.throwableObject.push(bottle);
  }

  startThrowAnimation() {
    this.character.isThrowing = true;
    this.character.loadImage(this.character.IMAGE_THROW[0]);
    setTimeout(() => {
      this.character.isThrowing = false;
      this.character.loadImage(this.character.IMAGES_WALKING[0]);
    }, 300);
  }

  updateBottleStatus() {
    this.statusBarBottle.setPercentage(this.statusBarBottle.percentage - 20);
  }

  playThrowSound() {
    this.sounds.throw.currentTime = 0;
    this.sounds.throw.play();
  }

  checkCollisions() {
    this.checkEnemyCollisions();
    this.checkBottleCollisions();
    this.collectBottles();
    this.collectCoins();
    this.collectHearts();
    this.checkGameOverOrWin();
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead) return;
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.playHurtSound();
        this.deaths++;
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  playHurtSound() {
    this.sounds.hurt.currentTime = 0;
    this.sounds.hurt.play();
  }

  checkBottleCollisions() {
    this.level.enemies.forEach((enemy) => {
      this.throwableObject.forEach((bottle) => {
        if (bottle.isColliding(enemy) && !enemy.isDead && !bottle.hasHit) {
          this.handleBottleHit(enemy, bottle);
        }
      });
    });
  }

  handleBottleHit(enemy, bottle) {
    bottle.hasHit = true;
    bottle.splash();

    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
      this.playChickenDieSound();
    }

    if (enemy instanceof Endboss) {
      enemy.hit();
      this.playEndbossHurtSound();
    } else {
      enemy.die();
    }
  }

  playChickenDieSound() {
    this.sounds.chickenDie.currentTime = 0;
    this.sounds.chickenDie.play();
  }

  playEndbossHurtSound() {
    this.sounds.endbossHurt.currentTime = 0;
    this.sounds.endbossHurt.play();
  }

  collectBottles() {
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      let bottle = this.level.bottles[i];
      if (
        this.character.isColliding(bottle) &&
        this.statusBarBottle.percentage < 100
      ) {
        this.level.bottles.splice(i, 1);
        let newPercentage = Math.min(this.statusBarBottle.percentage + 20, 100);
        this.statusBarBottle.setPercentage(newPercentage);
        this.playBottleFindSound();
      }
    }
  }

  playBottleFindSound() {
    this.sounds.bottleFind.currentTime = 0;
    this.sounds.bottleFind.play();
  }

  collectCoins() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      let coin = this.level.coins[i];
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(i, 1);
        const current = this.coinBar.coins || 0;
        this.coinBar.setCoinCount(current + 1);
        this.coinsCollectedFinal = current + 1;
        this.playCoinSound();
      }
    }
  }

  playCoinSound() {
    this.sounds.coin.currentTime = 0;
    this.sounds.coin.volume = 0.5;
    this.sounds.coin.play();
  }

  collectHearts() {
    if (!this.level.hearts) return;
    for (let i = this.level.hearts.length - 1; i >= 0; i--) {
      let heart = this.level.hearts[i];
      if (this.character.isColliding(heart)) {
        this.level.hearts.splice(i, 1);
        this.updateCharacterEnergy();
        this.playHeartSound();
      }
    }
  }

  updateCharacterEnergy() {
    let newEnergy = Math.min(this.character.energy + 20, 100);
    this.character.energy = newEnergy;
    this.statusBar.setPercentage(newEnergy);
  }

  playHeartSound() {
    this.sounds.heart.currentTime = 0;
    this.sounds.heart.play();
  }

  checkGameOverOrWin() {
    if (this.character.isDead() && !this.showingEndScreen) {
      this.handleGameOver();
      return;
    }

    const endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.isDead && !this.showingEndScreen) {
      this.handleGameWin();
    }
  }

  handleGameOver() {
    this.showingEndScreen = true;

    setTimeout(() => {
      this.isGameOver = true;
      this.pauseBackgroundSound();
      showGameOverScreen();
      this.playDieSound();
    }, 1000);
  }

  handleGameWin() {
    this.showingEndScreen = true;
    this.playEndbossDieSound();
    const storageKey = `coinsLevel${currentLevel}`;
    const previousBest = parseInt(localStorage.getItem(storageKey)) || 0;
    const currentCoins = this.coinsCollectedFinal;
    if (currentCoins > previousBest) {
      localStorage.setItem(storageKey, currentCoins);
    }
    setTimeout(() => {
      this.isGameOver = true;
      this.pauseBackgroundSound();

      if (currentLevel === 8) {
        this.showFinalLevelOverlayWithApplause();
      } else {
        this.showWinScreenWithApplause();
      }
    }, 3000);
  }

  pauseBackgroundSound() {
    this.sounds.background.pause();
    this.sounds.background.currentTime = 0;
  }

  playDieSound() {
    this.sounds.die.currentTime = 0;
    this.sounds.die.play();
  }

  playEndbossDieSound() {
    this.sounds.endbossDie.currentTime = 0;
    this.sounds.endbossDie.play();
  }

  showFinalLevelOverlayWithApplause() {
    showFinalLevelOverlay();
    setTimeout(() => {
      if (!this.sounds.applause.paused) {
        this.sounds.applause.pause();
        this.sounds.applause.currentTime = 0;
      }
      this.sounds.applause.play();
    }, 200);
  }

  showWinScreenWithApplause() {
    showEndScreenWithButtons("img/You won, you lost/You won A.png");
    const storageKey = `coinsLevel${currentLevel}`;
    const bestCoins = localStorage.getItem(storageKey) || 0;
    const coinsDisplay = document.getElementById("coinsDisplay");
    if (coinsDisplay) {
      coinsDisplay.textContent = `Best Coins: ${bestCoins}`;
    }

    setTimeout(() => {
      if (!this.sounds.applause.paused) {
        this.sounds.applause.pause();
        this.sounds.applause.currentTime = 0;
      }
      this.sounds.applause.play();
    }, 200);
  }

  draw() {
    if (this.isPaused) return this.drawPausedScreen();
    if (this.isGameOver) return this.drawGameOverScreen();

    this.resumeBackgroundSound();
    this.clearCanvas();

    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundObjects();
    this.drawCharacterAndEnemies();
    this.ctx.translate(-this.camera_x, 0);

    this.drawHUD();
    this.drawEndbossBarIfVisible();
    this.drawEndScreenIfShowing();

    requestAnimationFrame(() => this.draw());
  }

  drawPausedScreen() {
    if (!this.sounds.background.paused) this.sounds.background.pause();
    if (this.sounds.gamePaused.paused) {
      this.sounds.gamePaused.currentTime = 0;
      this.sounds.gamePaused.play();
    }
    this.clearCanvas();
    this.drawPauseScreen();
    requestAnimationFrame(() => this.draw());
  }

  drawGameOverScreen() {
    this.clearCanvas();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawEndScreenIfShowing();
    requestAnimationFrame(() => this.draw());
  }

  resumeBackgroundSound() {
    if (!this.sounds.gamePaused.paused) this.sounds.gamePaused.pause();
    if (this.sounds.background.paused) this.sounds.background.play();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPauseScreen() {
    this.ctx.drawImage(
      this.pauseImage,
      this.canvas.width / 2 - 200,
      this.canvas.height / 2 - 150,
      400,
      300
    );
  }

  drawBackgroundObjects() {
    this.addObjectToMap(this.level.backgroundObjects);
    this.addObjectToMap(this.level.clouds);
    this.addObjectToMap(this.level.bottles);
    this.addObjectToMap(this.level.coins);
    this.addObjectToMap(this.level.hearts);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.throwableObject);
  }

  drawCharacterAndEnemies() {
    this.addToMap(this.character);
  }

  drawHUD() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.coinBar);
  }

  drawEndbossBarIfVisible() {
    if (this.endbossInView()) {
      this.addToMap(this.endbossBar);
    }
  }

  drawEndScreenIfShowing() {
    if (this.showingEndScreen && this.endScreenImage) {
      this.ctx.drawImage(
        this.endScreenImage,
        this.endScreenX,
        this.canvas.height / 2 - 150,
        400,
        300
      );
    }
  }

  addObjectToMap(objects) {
    objects.forEach((object) => this.addToMap(object));
  }

  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.draw(this.ctx);
    //movableObject.drawFrame(this.ctx);
    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
  }

  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }

  endbossInView() {
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    return boss && this.character.x + 400 >= boss.x && !boss.isDead;
  }

  showEndScreen(path) {
    this.showingEndScreen = true;
    this.endScreenImage = new Image();
    this.endScreenImage.src = path;
    this.endScreenX = this.canvas.width;
    this.animateEndScreen();
  }

  animateEndScreen() {
    if (this.endScreenX > this.canvas.width / 2 - 200) {
      this.endScreenX -= 10;
      requestAnimationFrame(() => this.animateEndScreen());
    }
  }

  muteAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.muted = true;
      if (!sound.paused) sound.pause();
    });
    this.isMuted = true;
    localStorage.setItem("isMuted", "true");
    this.updateMuteIcon();
  }

  unmuteAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.muted = false;
    });
    if (!this.isPaused && !this.isGameOver && this.sounds.background.paused) {
      this.sounds.background.play();
    }
    this.isMuted = false;
    localStorage.setItem("isMuted", "false");
    this.updateMuteIcon();
  }

  updateMuteIcon() {
  const muteIcon = document.getElementById("muteIcon");
  if (!muteIcon) return;
  if (this.isMuted) {
    muteIcon.style.display = "block";
  } else {
    muteIcon.style.display = "none";
  }
}

}
