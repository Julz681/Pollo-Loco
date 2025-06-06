window.createLevel3 = function () {
  const level_start_x = 600;
  const level_end_x = 5200;
  const usableWidth = level_end_x - level_start_x - 500;

  const enemies = createEnemies(level_start_x, usableWidth, 6, 4, 4900);
  const clouds = createClouds(15);
  const backgroundObjects = createBackgroundObjects(12);
  const bottles = createBottles(7, level_start_x, usableWidth);
  const coins = [];
  const spacingX = 40;
  const coinsPerRow = 5;
  const rowCount = 8;
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
