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

  deaths = 0;
  coinsCollectedFinal = 0;
  startTime = 0;

  constructor(canvas, keyboard, level) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.level = level;
    this.draw();
    this.setWorld();
    this.run();
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
      if (!this.isPaused) {
        this.checkCollisions();
        this.checkThrowObjects();
      }
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
    let offsetX = this.character.otherDirection ? -100 : 100;
    let bottle = new throwableObject(
      this.character.x + offsetX,
      this.character.y + 100
    );
    bottle.otherDirection = this.character.otherDirection;
    bottle.world = this;
    this.throwableObject.push(bottle);

    this.character.isThrowing = true;
    this.character.loadImage(this.character.IMAGE_THROW[0]);

    setTimeout(() => {
      this.character.isThrowing = false;
      this.character.loadImage(this.character.IMAGES_WALKING[0]);
    }, 300);

    this.statusBarBottle.setPercentage(this.statusBarBottle.percentage - 20);
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
      enemy.world = this;
      if (this.character.isColliding(enemy)) {
        this.character.hit();

        this.deaths++;

        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  checkBottleCollisions() {
    this.level.enemies.forEach((enemy) => {
      this.throwableObject.forEach((bottle) => {
        if (bottle.isColliding(enemy) && !enemy.isDead && !bottle.hasHit) {
          bottle.hasHit = true;
          bottle.splash();
          if (enemy instanceof Endboss) {
            enemy.hit();
          } else {
            enemy.die();
          }
        }
      });
    });
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
      }
    }
  }

  collectCoins() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      let coin = this.level.coins[i];
      if (this.character.isColliding(coin)) {
        this.level.coins.splice(i, 1);
        const current = this.coinBar.coins || 0;
        this.coinBar.setCoinCount(current + 1);

        this.coinsCollectedFinal = current + 1;
      }
    }
  }

  collectHearts() {
    if (!this.level.hearts) return;
    for (let i = this.level.hearts.length - 1; i >= 0; i--) {
      let heart = this.level.hearts[i];
      if (this.character.isColliding(heart)) {
        this.level.hearts.splice(i, 1);
        let newEnergy = Math.min(this.character.energy + 20, 100);
        this.character.energy = newEnergy;
        this.statusBar.setPercentage(newEnergy);
      }
    }
  }

  checkGameOverOrWin() {
    if (this.character.isDead() && !this.showingEndScreen) {
      this.showingEndScreen = true;
      setTimeout(() => {
        showGameOverScreen();
      }, 1500);
    }

    const endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.isDead && !this.showingEndScreen) {
      this.showingEndScreen = true;
      setTimeout(() => {
        if (currentLevel === 8) {
          setTimeout(() => {
            showFinalLevelOverlay();
          }, 1500);
        } else {
          showEndScreenWithButtons("img/You won, you lost/You won A.png");
        }
      }, 1500);
    }
  }

  draw() {
    this.clearCanvas();
    if (this.isPaused) {
      this.drawPauseScreen();
      requestAnimationFrame(() => this.draw());
      return;
    }

    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundObjects();
    this.drawCharacterAndEnemies();
    this.ctx.translate(-this.camera_x, 0);
    this.drawHUD();
    this.drawEndbossBarIfVisible();
    this.drawEndScreenIfShowing();
    requestAnimationFrame(() => this.draw());
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
}
