function createBackgroundObjects(levelSegments) {
  const backgroundObjects = [];
  const segmentWidth = 719;
  const layerFiles = [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/",
    "img/5_background/layers/2_second_layer/",
    "img/5_background/layers/1_first_layer/",
  ];

  for (let i = 0; i < levelSegments; i++) {
    const x = i * segmentWidth - segmentWidth;

    backgroundObjects.push(new BackgroundObject(layerFiles[0], x));

    for (let j = 1; j < layerFiles.length; j++) {
      const layerNum = (i % 2) + 1;
      const path = layerFiles[j] + layerNum + ".png";
      backgroundObjects.push(new BackgroundObject(path, x));
    }
  }

  return backgroundObjects;
}

class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles;
  coins;
  hearts;
  level_end_x;

  constructor(
    enemies,
    clouds,
    backgroundObjects,
    bottles = [],
    coins = [],
    hearts = [],
    level_end_x = 3680
  ) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles;
    this.coins = coins;
    this.hearts = hearts;
    this.level_end_x = level_end_x;
  }
}
