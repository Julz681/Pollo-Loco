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

    this.soundManager = new SoundManager(this);
    this.soundManager.initSounds();

    this.collisionManager = new CollisionManager(this);

    this._setupSounds();

    this.draw();
    this.setWorld();
    this.run();
  }

  _setupSounds() {
    this.sounds.background.loop = true;
    this.sounds.background.volume = 0.5;
    const storedMute = localStorage.getItem("isMuted");
    if (storedMute === "true") {
      this.soundManager.muteAllSounds();
    } else {
      this.soundManager.unmuteAllSounds();
      this.sounds.background.play();
    }
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this));
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
    )
      this.throwBottle();
  }

  throwBottle() {
    this.createBottle();
    this.startThrowAnimation();
    this.updateBottleStatus();
    this.soundManager.playThrowSound();
  }

  createBottle() {
    const offsetX = this.character.otherDirection ? -100 : 100;
    const bottle = new throwableObject(
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

  checkCollisions() {
    this.collisionManager.checkEnemyCollisions();
    this.collisionManager.checkBottleCollisions();
    this.collisionManager.collectBottles();
    this.collisionManager.collectCoins();
    this.collisionManager.collectHearts();
    this.collisionManager.checkGameOverOrWin();
  }

  updateCharacterEnergy() {
    const newEnergy = Math.min(this.character.energy + 20, 100);
    this.character.energy = newEnergy;
    this.statusBar.setPercentage(newEnergy);
  }

  handleGameOver() {
    this.showingEndScreen = true;
    setTimeout(() => {
      this._doGameOver();
    }, 1000);
  }

  _doGameOver() {
    this.isGameOver = true;
    this.soundManager.pauseBackgroundSound();
    showGameOverScreen();
    this.soundManager.playDieSound();
  }

  handleGameWin() {
    this.showingEndScreen = true;
    this.soundManager.playEndbossDieSound();
    this._saveBestCoins();
    setTimeout(() => {
      this._doGameWin();
    }, 3000);
  }

  _saveBestCoins() {
    const storageKey = `coinsLevel${currentLevel}`;
    const previousBest = parseInt(localStorage.getItem(storageKey)) || 0;
    if (this.coinsCollectedFinal > previousBest) {
      localStorage.setItem(storageKey, this.coinsCollectedFinal);
    }
  }

  _doGameWin() {
    this.isGameOver = true;
    this.soundManager.pauseBackgroundSound();
    if (currentLevel === 8) this.showFinalLevelOverlayWithApplause();
    else this.showWinScreenWithApplause();
  }

  showFinalLevelOverlayWithApplause() {
    showFinalLevelOverlay();
    setTimeout(() => {
      this._playApplause();
    }, 200);
  }

  showWinScreenWithApplause() {
    showEndScreenWithButtons("img/You won, you lost/You won A.png");
    this._updateBestCoinsDisplay();
    setTimeout(() => {
      this._playApplause();
    }, 200);
  }

  _playApplause() {
    if (!this.sounds.applause.paused) {
      this.sounds.applause.pause();
      this.sounds.applause.currentTime = 0;
    }
    this.sounds.applause.play();
  }

  _updateBestCoinsDisplay() {
    const storageKey = `coinsLevel${currentLevel}`;
    const bestCoins = localStorage.getItem(storageKey) || 0;
    const coinsDisplay = document.getElementById("coinsDisplay");
    if (coinsDisplay) coinsDisplay.textContent = `Best Coins: ${bestCoins}`;
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
    this._drawObjects(this.level.backgroundObjects);
    this._drawObjects(this.level.clouds);
    this._drawObjects(this.level.bottles);
    this._drawObjects(this.level.coins);
    this._drawObjects(this.level.hearts);
    this._drawObjects(this.level.enemies);
    this._drawObjects(this.throwableObject);
  }

  _drawObjects(objects) {
    objects.forEach((obj) => this.addToMap(obj));
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
    if (this.endbossInView()) this.addToMap(this.endbossBar);
  }

  drawEndScreenIfShowing() {
    if (!this.showingEndScreen || !this.endScreenImage) return;
    this.ctx.drawImage(
      this.endScreenImage,
      this.endScreenX,
      this.canvas.height / 2 - 150,
      400,
      300
    );
  }

  addToMap(movableObject) {
    if (movableObject.otherDirection) this._flipImage(movableObject);
    movableObject.draw(this.ctx);
    // movableObject.drawFrame(this.ctx);
    if (movableObject.otherDirection) this._flipImageBack(movableObject);
  }

  _flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x *= -1;
  }

  _flipImageBack(movableObject) {
    movableObject.x *= -1;
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
    if (this.endScreenX <= this.canvas.width / 2 - 200) return;
    this.endScreenX -= 10;
    requestAnimationFrame(() => this.animateEndScreen());
  }

  updateMuteIcon() {
    const muteIcon = document.getElementById("muteIcon");
    if (!muteIcon) return;
    muteIcon.style.display = this.isMuted ? "block" : "none";
  }
}
