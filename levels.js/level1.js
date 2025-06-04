function createLevel1() {
  // Gegner
  const enemies = [];
  for (let i = 0; i < 8; i++) { //ANZAHL
    const chicken = new Chicken();
    chicken.x = 500 + i * 400;
    enemies.push(chicken);
  }
  const boss = new Endboss();
  boss.x = 3500;
  enemies.push(boss);

  // Clouds
  const clouds = [];
  for (let i = 0; i < 10; i++) {
    const cloud = new Cloud();
    cloud.x = i * 400 + Math.random() * 100;
    clouds.push(cloud);
  }

  // Background 
  const segmentCount = 7; //ANZAHL
  const backgroundObjects = createBackgroundObjects(segmentCount);

  // Bottles
  const bottles = [];
  for (let i = 0; i < 10; i++) { //ANZAHL
    const x = 400 + i * 300;
    bottles.push(new CollectableBottle(x));
  }

  // Coins - Bogenform
  const coins = [];
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

  // Levelende 
  const level_end_x = 3600;

  return new Level(enemies, clouds, backgroundObjects, bottles, coins, level_end_x);
}
