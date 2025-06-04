window.createLevel6 = function () {
  const level_start_x = 600;
  const level_end_x = 10000;
  const usableWidth = level_end_x - level_start_x - 500;

  const enemies = createEnemies(level_start_x, usableWidth);
  const clouds = createClouds();
  const backgroundObjects = createBackgroundObjects(16);
  const bottles = createBottles(18, level_start_x, usableWidth);
  const coins = createDiagonalCoins();
  const hearts = createHearts();

  return new Level(
    enemies,
    clouds,
    backgroundObjects,
    bottles,
    coins,
    hearts,
    level_end_x
  );
};

function distributePositions(count, startX, usableWidth) {
  if (count === 1) return [startX + usableWidth / 2];
  const positions = [];
  const spacing = usableWidth / (count - 1);
  for (let i = 0; i < count; i++) {
    positions.push(startX + i * spacing);
  }
  return positions;
}

function createEnemies(level_start_x, usableWidth) {
  const enemies = [];

  const bigChickenCount = 15;
  const smallChickenCount = 12;

  const bigChickenPositions = distributePositions(
    bigChickenCount,
    level_start_x,
    usableWidth
  );
  for (let i = 0; i < bigChickenCount; i++) {
    const chicken = new Chicken();
    chicken.x = bigChickenPositions[i];
    enemies.push(chicken);
  }

  const smallChickenPositions = distributePositions(
    smallChickenCount,
    level_start_x,
    usableWidth
  );
  for (let i = 0; i < smallChickenCount; i++) {
    const smallChicken = new SmallChicken();
    smallChicken.x = smallChickenPositions[i];
    enemies.push(smallChicken);
  }

  const boss = new Endboss();
  boss.x = 9000;
  enemies.push(boss);

  return enemies;
}

function createClouds() {
  const clouds = [];
  for (let i = 0; i < 15; i++) {
    const cloud = new Cloud();
    cloud.x = i * 400 + Math.random() * 100;
    clouds.push(cloud);
  }
  return clouds;
}

function createBottles(count, level_start_x, usableWidth) {
  const bottles = [];
  const bottlePositions = distributePositions(
    count,
    level_start_x,
    usableWidth
  );
  for (let i = 0; i < count; i++) {
    bottles.push(new CollectableBottle(bottlePositions[i]));
  }
  return bottles;
}

function createDiagonalCoins() {
  const coins = [];
  const spacingX = 40;
  const coinsPerRow = 5;
  const rowCount = 10;
  const lowY = 160;
  const highY = 280;

  const usableWidthCoins = 9000;
  const coinsStartX = 600;

  const totalCoinsWidth = spacingX * (coinsPerRow - 1);
  const rowSpacingX = (usableWidthCoins - totalCoinsWidth) / (rowCount - 1);

  for (let row = 0; row < rowCount; row++) {
    const baseX = coinsStartX + row * rowSpacingX;

    const yStart = row % 2 === 0 ? lowY : highY;
    const yEnd = row % 2 === 0 ? highY : lowY;

    const yStep = (yEnd - yStart) / (coinsPerRow - 1);

    for (let i = 0; i < coinsPerRow; i++) {
      const x = baseX + i * spacingX;
      const y = yStart + i * yStep;
      coins.push(new Coin(x, y));
    }
  }

  return coins;
}


function createHearts() {
  const hearts = [];
  hearts.push(new CollectableHeart(2000, 200));
  hearts.push(new CollectableHeart(6000, 150));
  hearts.push(new CollectableHeart(8000, 220));
  return hearts;
}
