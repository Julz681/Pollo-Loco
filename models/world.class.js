class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = -100;
    statusBar = new StatusBar();
    throwableObject = [];

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();

    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
        this.checkCollisions();
        this.checkThrowObjects();
        }, 200);
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let offsetX = this.character.otherDirection ? -100 : 100;
            let bottle = new throwableObject(this.character.x + offsetX, this.character.y + 100);
            bottle.otherDirection = this.character.otherDirection;
            bottle.world = this;
            this.throwableObject.push(bottle);
            }
    }


    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }

            this.throwableObject.forEach((bottle) => {
                if (bottle.isColliding(enemy) && !enemy.isDead && !bottle.hasHit) {
                    bottle.hasHit = true;
                    bottle.splash();
                    if (enemy instanceof Endboss) {
                        enemy.hit(); 
                    } else {
                        enemy.die(); 
                    }
                }
            });
        });
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.throwableObject);

        this.ctx.translate(-this.camera_x, 0);
        

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });

    }

    addObjectToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.flipImage(movableObject);
        }
        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);

        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }

     flipImage(movableObject){
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    flipImageBack(movableObject){
        movableObject.x = movableObject.x * -1;
        this.ctx.restore();
    }

}