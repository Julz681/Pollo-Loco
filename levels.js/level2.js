window.createLevel2 = function () {
  const level_start_x = 200;
  const level_end_x = 4500;
  const usableWidth = level_end_x - level_start_x - 500;

  const enemies = [];
  for (let i = 0; i < 8; i++) {
    const chicken = new Chicken();
    chicken.x = 500 + i * 400;
    enemies.push(chicken);
  }
  const boss = new Endboss();
  boss.x = 4300;
  enemies.push(boss);

  const clouds = createClouds(15);
  const backgroundObjects = createBackgroundObjects(9);
  const bottles = [];
  for (let i = 0; i < 8; i++) {
    bottles.push(new CollectableBottle(400 + i * 300));
  }

  const coins = [];
  const spacingX = 40;
  const coinsPerRow = 5;
  const rowCount = 7;
  const lowY = 160;
  const highY = 280;

  const totalCoinsWidth = coinsPerRow * spacingX;
  const rowSpacingX = (usableWidth - totalCoinsWidth) / (rowCount - 1);

  for (let row = 0; row < rowCount; row++) {
    const baseX = level_start_x + row * rowSpacingX;
    const y = row % 2 === 0 ? lowY : highY;
    for (let i = 0; i < coinsPerRow; i++) {
      coins.push(new Coin(baseX + i * spacingX, y));
    }
  }

  return new Level(
    enemies,
    clouds,
    backgroundObjects,
    bottles,
    coins,
    [],
    level_end_x
  );
};
