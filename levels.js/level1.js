function createLevel1() {
  // Gegner
  const enemies = [];
  for (let i = 0; i < 8; i++) {
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
  const backgroundObjects = [
    new BackgroundObject("img/5_background/layers/air.png", -719),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", -719),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", -719),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", -719),

    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 0),

    new BackgroundObject("img/5_background/layers/air.png", 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719),

    new BackgroundObject("img/5_background/layers/air.png", 1438),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 1438),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 1438),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 1438),

    new BackgroundObject("img/5_background/layers/air.png", 2157),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 2157),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 2157),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 2157),

    new BackgroundObject("img/5_background/layers/air.png", 2876),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 2876),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 2876),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 2876),

    new BackgroundObject("img/5_background/layers/air.png", 3595),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 3595),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 3595),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 3595),
  ];

  // Bottles
  const bottles = [];
  for (let i = 0; i < 10; i++) {
    const x = 400 + i * 300;
    bottles.push(new CollectableBottle(x));
  }

  // Coins - Bogenform, leicht flacher für bessere Erreichbarkeit
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

  return new Level(enemies, clouds, backgroundObjects, bottles, coins);
}
