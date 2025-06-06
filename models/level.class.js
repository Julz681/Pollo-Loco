function createBackgroundObjects(levelSegments) {
  const backgroundObjects = [];
  const segmentWidth = 719;
  const layerFiles = [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/",
    "img/5_background/layers/2_second_layer/",
    "img/5_background/layers/1_first_layer/",
  ];

  for (let i = 0; i < levelSegments; i++) {
    const x = i * segmentWidth - segmentWidth;

    backgroundObjects.push(new BackgroundObject(layerFiles[0], x));

    for (let j = 1; j < layerFiles.length; j++) {
      const layerNum = (i % 2) + 1;
      const path = layerFiles[j] + layerNum + ".png";
      backgroundObjects.push(new BackgroundObject(path, x));
    }
  }

  return backgroundObjects;
}

class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles;
  coins;
  hearts;
  level_end_x;

  constructor(
    enemies,
    clouds,
    backgroundObjects,
    bottles = [],
    coins = [],
    hearts = [],
    level_end_x = 3680
  ) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles;
    this.coins = coins;
    this.hearts = hearts;
    this.level_end_x = level_end_x;
  }
}

function distributePositions(count, startX, usableWidth) {
  if (count === 1) return [startX + usableWidth / 2];
  const positions = [];
  const spacing = usableWidth / (count - 1);
  for (let i = 0; i < count; i++) {
    positions.push(startX + i * spacing);
  }
  return positions;
}

function createClouds(count = 15) {
  const clouds = [];
  for (let i = 0; i < count; i++) {
    const cloud = new Cloud();
    cloud.x = i * 400 + Math.random() * 100;
    clouds.push(cloud);
  }
  return clouds;
}

function createBottles(count, startX, usableWidth) {
  const bottles = [];
  const positions = distributePositions(count, startX, usableWidth);
  for (let i = 0; i < count; i++) {
    bottles.push(new CollectableBottle(positions[i]));
  }
  return bottles;
}

function createDiagonalCoins(rowCount = 10, coinsPerRow = 5, startX = 600, width = 9000) {
  const coins = [];
  const spacingX = 40;
  const lowY = 160;
  const highY = 280;

  const coinsStartX = startX;
  const usableWidthCoins = width;

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


function createEnemies(level_start_x, usableWidth, bigChickenCount, smallChickenCount, bossX) {
  const enemies = [];

  const bigChickenPositions = distributePositions(bigChickenCount, level_start_x, usableWidth);
  for (let pos of bigChickenPositions) {
    const chicken = new Chicken();
    chicken.x = pos;
    enemies.push(chicken);
  }

  const smallChickenPositions = distributePositions(smallChickenCount, level_start_x, usableWidth);
  for (let pos of smallChickenPositions) {
    const smallChicken = new SmallChicken();
    smallChicken.x = pos;
    enemies.push(smallChicken);
  }

  if (typeof bossX === 'number') {
    const boss = new Endboss();
    boss.x = bossX;
    enemies.push(boss);
  }

  return enemies;
}

function createHearts(positions = [[2000,200], [6000,150], [8000,220]]) {
  const hearts = [];
  for (let [x, y] of positions) {
    hearts.push(new CollectableHeart(x, y));
  }
  return hearts;
}
