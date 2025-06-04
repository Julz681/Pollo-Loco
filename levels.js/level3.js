window.createLevel3 = function () {
  // Gegner
  const enemies = [];

  // Parameter zur Verteilung
  const level_start_x = 600; 
  const level_end_x = 5200;
  const usableWidth = level_end_x - level_start_x - 500;

  // Anzahl der Chickens
  const bigChickenCount = 6;
  const smallChickenCount = 4;
  const bottleCount = 7;

  // Verteiler-Funktion für Positionen
  function distributePositions(count) {
    if (count === 1) return [level_start_x + usableWidth / 2];
    const positions = [];
    const spacing = usableWidth / (count - 1);
    for (let i = 0; i < count; i++) {
      positions.push(level_start_x + i * spacing);
    }
    return positions;
  }

  // Große Chickens
  const bigChickenPositions = distributePositions(bigChickenCount);
  for (let i = 0; i < bigChickenCount; i++) {
    const chicken = new Chicken();
    chicken.x = bigChickenPositions[i];
    enemies.push(chicken);
  }

  // Kleine Chickens
  const smallChickenPositions = distributePositions(smallChickenCount);
  for (let i = 0; i < smallChickenCount; i++) {
    const smallChicken = new SmallChicken();
    smallChicken.x = smallChickenPositions[i];
    enemies.push(smallChicken);
  }

  // Endboss
  const boss = new Endboss();
  boss.x = 4900;
  enemies.push(boss);

  // Clouds
  const clouds = [];
  for (let i = 0; i < 15; i++) {
    const cloud = new Cloud();
    cloud.x = i * 400 + Math.random() * 100;
    clouds.push(cloud);
  }

  // Background
  const segmentCount = 12;
  const backgroundObjects = createBackgroundObjects(segmentCount);

  // Bottles verteilt
  const bottles = [];
  const bottlePositions = distributePositions(bottleCount);
  for (let i = 0; i < bottleCount; i++) {
    bottles.push(new CollectableBottle(bottlePositions[i]));
  }

  // Coins
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
      const x = baseX + i * spacingX;
      coins.push(new Coin(x, y));
    }
  }

  return new Level(
    enemies,
    clouds,
    backgroundObjects,
    bottles,
    coins,
    level_end_x
  );
};
