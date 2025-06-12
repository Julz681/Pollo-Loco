/**
 * Creates and returns Level 6 configuration.
 * @returns {Level} Configured Level 6 instance.
 */
window.createLevel6 = function () {
  const level_start_x = 600;
  const level_end_x = 12000;
  const usableWidth = level_end_x - level_start_x - 500;
  const coinsStartX = 800;
  const coinsWidth = 10000;

  // Enemies: big chickens, small chickens, and an endboss
  const enemies = createEnemies(level_start_x, usableWidth, 15, 12, 11500);

  // Clouds and background layers
  const clouds = createClouds(20);
  const backgroundObjects = createBackgroundObjects(20);

  // Bottles and coins distributed over the level
  const bottles = createBottles(18, level_start_x, usableWidth);
  const coins = createDiagonalCoins(10, 5, coinsStartX, coinsWidth);

  // Hearts placed at predefined positions
  const hearts = createHearts();

  // Return the complete Level instance
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
