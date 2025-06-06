window.createLevel4 = function () {
  const level_start_x = 600;
  const level_end_x = 7200;
  const usableWidth = level_end_x - level_start_x - 500;
  const coinsStartX = 800;
  const coinsWidth = 5600;

  const enemies = createEnemies(level_start_x, usableWidth, 10, 8, 6800);
  const clouds = createClouds(15);
  const backgroundObjects = createBackgroundObjects(12);
  const bottles = createBottles(12, level_start_x, usableWidth);
  const coins = createDiagonalCoins(9, 5, coinsStartX, coinsWidth);

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
