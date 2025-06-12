class CollisionManager {
  constructor(world) {
    this.world = world;
  }

  checkEnemyCollisions() {
    this.world.level.enemies.forEach(enemy => {
      if (enemy.isDead) return;
      if (this.world.character.isColliding(enemy)) {
        this.world.character.hit();
        this.world.soundManager.playHurtSound();
        this.world.deaths++;
        this.world.statusBar.setPercentage(this.world.character.energy);
      }
    });
  }

  checkBottleCollisions() {
    this.world.level.enemies.forEach(enemy => {
      this.world.throwableObject.forEach(bottle => {
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
      this.world.soundManager.playChickenDieSound();
    }

    if (enemy instanceof Endboss) {
      enemy.hit();
      this.world.soundManager.playEndbossHurtSound();
    } else {
      enemy.die();
    }
  }

  collectBottles() {
    for (let i = this.world.level.bottles.length - 1; i >= 0; i--) {
      let bottle = this.world.level.bottles[i];
      if (this.world.character.isColliding(bottle) && this.world.statusBarBottle.percentage < 100) {
        this.world.level.bottles.splice(i, 1);
        let newPercentage = Math.min(this.world.statusBarBottle.percentage + 20, 100);
        this.world.statusBarBottle.setPercentage(newPercentage);
        this.world.soundManager.playBottleFindSound();
      }
    }
  }

  collectCoins() {
    for (let i = this.world.level.coins.length - 1; i >= 0; i--) {
      let coin = this.world.level.coins[i];
      if (this.world.character.isColliding(coin)) {
        this.world.level.coins.splice(i, 1);
        const current = this.world.coinBar.coins || 0;
        this.world.coinBar.setCoinCount(current + 1);
        this.world.coinsCollectedFinal = current + 1;
        this.world.soundManager.playCoinSound();
      }
    }
  }

  collectHearts() {
    if (!this.world.level.hearts) return;
    for (let i = this.world.level.hearts.length - 1; i >= 0; i--) {
      let heart = this.world.level.hearts[i];
      if (this.world.character.isColliding(heart)) {
        this.world.level.hearts.splice(i, 1);
        this.world.updateCharacterEnergy();
        this.world.soundManager.playHeartSound();
      }
    }
  }

checkGameOverOrWin() {
  if (this.world.character.isDead() && !this.world.showingEndScreen) {
    this.world.showingEndScreen = true;
    setTimeout(() => {
      this.world.handleGameOver();
    }, 1500);
  }

  const endboss = this.world.level.enemies.find(e => e instanceof Endboss);
  if (endboss && endboss.isDead && !this.world.showingEndScreen) {
    this.world.showingEndScreen = true;
    setTimeout(() => {
      this.world.handleGameWin();
    }, 1500);
  }
}


}
