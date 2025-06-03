const level1 = new Level(
  // 🐔 GEGNER: Chickens + Endboss
  (() => {
    const enemies = [];
    for (let i = 0; i < 8; i++) {
      // 🐔 Anzahl Chickens: 8
      const chicken = new Chicken();
      chicken.x = 500 + i * 400;
      enemies.push(chicken);
    }

    const boss = new Endboss();
    boss.x = 3500; // 🐓 Endboss-Platzierung
    enemies.push(boss);

    return enemies;
  })(),

  // ☁️ CLOUDS über gesamte Levelbreite
  (() => {
    const clouds = [];
    for (let i = 0; i < 10; i++) {
      // ☁️ Anzahl Wolken
      const cloud = new Cloud();
      cloud.x = i * 400 + Math.random() * 100; // Gleichmäßig + Zufall
      clouds.push(cloud);
    }
    return clouds;
  })(),

  // 🏜️ HINTERGRUND
  [
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
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 3595), // 🏁 Levelende (x = ~3680)
  ],

  // 🧃 BOTTLES auf dem Boden
  (() => {
    const bottles = [];
    for (let i = 0; i < 10; i++) {
      // 🧃 Anzahl Flaschen: 10
      const x = 400 + i * 300;
      bottles.push(new CollectableBottle(x));
    }
    return bottles;
  })(),

  // 💰 COINS in Bögen über dem Boden
  (() => {
    const coins = [];
    const bogenAbstand = 600;
    const bogenHöhe = 200;

    for (let b = 0; b < 5; b++) {
      // 💰 Anzahl Bögen: 5
      const startX = 600 + b * bogenAbstand;
      for (let i = 0; i < 6; i++) {
        // 💰 Coins pro Bogen: 6
        const x = startX + i * 40;
        const y = 300 - Math.sin((i / 5) * Math.PI) * bogenHöhe;
        coins.push(new Coin(x, y));
      }
    }

    return coins;
  })()
);
