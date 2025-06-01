class MovableObject {
        x = 120;
        y = 290;
        img;
        height = 150;
        width = 100;
        imageCache = {};
        currentImage = 0;
        speed = 0.2;
        otherDirection = false;

        loadImage(path){
            this.img = new Image(); 
            this.img.src = path;
        }

        /**
         * 
         * @param {Array} arr 
         */
        loadImages(arr) {
            arr.forEach((path) => {
                let img = new Image();
                img.src = path;
                this.imageCache[path] = img;
        });
    }

        moveRight() {
            console.log('Moving right');
        }


        moveLeft(){
            setInterval(() => {
            this.x -= this.speed;
            }, 1000 / 60);
        }

        playAnimation(images){
            let i = this.currentImage % this.IMAGES_WALKING.length;
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;

        }


}