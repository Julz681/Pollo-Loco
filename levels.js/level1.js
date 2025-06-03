const level1 = new Level(

    (() => {
        const enemies = [];
        for (let i = 0; i < 8; i++) {
            const chicken = new Chicken();
            chicken.x = 500 + i * 400;
            enemies.push(chicken);
        }

        const boss = new Endboss();
        boss.x = 3500;
        enemies.push(boss);

        return enemies;
    })(),

    [
        new Cloud()
    ],


    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 0),

        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 1438),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 1438),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 1438),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 1438),

        new BackgroundObject('img/5_background/layers/air.png', 2157),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 2157),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 2157),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 2157),

        new BackgroundObject('img/5_background/layers/air.png', 2876),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 2876),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 2876),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 2876),

        new BackgroundObject('img/5_background/layers/air.png', 3595),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 3595),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 3595),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 3595)
    ],


    (() => {
        const bottles = [];
        for (let i = 0; i < 10; i++) {
            const x = 400 + i * 300;
            bottles.push(new CollectableBottle(x));
        }
        return bottles;
    })()
);
