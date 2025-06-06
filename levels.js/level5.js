window.createLevel5 = function () {
  const level_start_x = 600;
  const level_end_x = 10000;
  const usableWidth = level_end_x - level_start_x - 500;
  const coinsStartX = 800;
  const coinsWidth = 7500;

  const enemies = createEnemies(level_start_x, usableWidth, 15, 12, 9200);
  const clouds = createClouds(18);
  const backgroundObjects = createBackgroundObjects(16);
  const bottles = createBottles(18, level_start_x, usableWidth);
  const coins = createDiagonalCoins(10, 5, coinsStartX, coinsWidth);

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
