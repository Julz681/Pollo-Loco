function createLevel2() {
  // Gegner
  const enemies = [];
  for (let i = 0; i < 8; i++) {
    const chicken = new Chicken();
    chicken.x = 500 + i * 400;
    enemies.push(chicken);
  }
  const boss = new Endboss();
  boss.x = 4300;
  enemies.push(boss);

  // Clouds
  const clouds = [];
  for (let i = 0; i < 15; i++) {
    const cloud = new Cloud();
    cloud.x = i * 400 + Math.random() * 100;
    clouds.push(cloud);
  }

  // Background
  const segmentCount = 9;
  const backgroundObjects = createBackgroundObjects(segmentCount);

  // Bottles
  const bottles = [];
  for (let i = 0; i < 8; i++) {
    const x = 400 + i * 300;
    bottles.push(new CollectableBottle(x));
  }

  // Coins 
  const coins = [];
  const spacingX = 40;       // Abstand zwischen Coins in einer Reihe
  const coinsPerRow = 5;     // Coins pro Reihe
  const rowCount = 6;        // Anzahl Reihen
  const lowY = 160;
  const highY = 280;

  const levelWidth = 4300;   // Breite des Levels
  const totalCoinsWidth = coinsPerRow * spacingX; 
  const rowSpacingX = (levelWidth - totalCoinsWidth) / (rowCount - 1); 

  for (let row = 0; row < rowCount; row++) {
    const baseX = row * rowSpacingX;
    const y = (row % 2 === 0) ? lowY : highY;
    for (let i = 0; i < coinsPerRow; i++) {
      const x = baseX + i * spacingX;
      coins.push(new Coin(x, y));
    }
  }

  // Levelende 
  const level_end_x = 4300;

  return new Level(enemies, clouds, backgroundObjects, bottles, coins, level_end_x);
}
