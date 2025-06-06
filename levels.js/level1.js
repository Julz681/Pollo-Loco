window.createLevel1 = function () {
  const level_start_x = 400;
  const level_end_x = 3600;
  const usableWidth = level_end_x - level_start_x;

  // Gegner: 8 Chickens, Boss bei 3500
  const enemies = [];
  for (let i = 0; i < 8; i++) {
    const chicken = new Chicken();
    chicken.x = 500 + i * 400;
    enemies.push(chicken);
  }
  const boss = new Endboss();
  boss.x = 3500;
  enemies.push(boss);

  const clouds = createClouds(10);
  const backgroundObjects = createBackgroundObjects(7);
  const bottles = createBottles(10, 400, 300 * 9); // Positions ca. 400,700,...
  const coins = [];
  // Münzenbogen (wie im Original)
  const bogenAbstand = 600;
  const bogenHoehe = 130;
  for (let b = 0; b < 5; b++) {
    const startX = 600 + b * bogenAbstand;
    for (let i = 0; i < 6; i++) {
      const x = startX + i * 40;
      const y = 320 - Math.sin((i / 5) * Math.PI) * bogenHoehe;
      coins.push(new Coin(x, y));
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
