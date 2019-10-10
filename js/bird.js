class bird {
    constructor(game) {
        this.game = game;
        this.images = [];
        this.loaded1 = false;
        this.loaded2 = false;
        this.loaded3 = false;
        this.currentFrame = 0;
        this.currentImage = 0;
        this.width = 34;
        this.x = 100;
        this.y = 100;
        this.speedY = 0;
        this.speedY2 = 1;
    
        var self = this;

        this.init = function() {
            this.loadImages();
        };

        this.loadImages = function(){
            var img1 = new Image();
            var img2 = new Image();
            var img3 = new Image();

            img1.onload = function(){
                self.loaded1 = true;
            }
            img2.onload = function(){
                self.loaded2 = true;
            }
            img3.onload = function(){
                self.loaded3 = true;
            }

            // load all images
            img1.src = 'images/bird0.png';
            img2.src = 'images/bird1.png';
            img3.src = 'images/bird2.png';

            this.images.push(img1);
            this.images.push(img2);
            this.images.push(img3);
        };

        this.update = function() {
            self.currentFrame++;
            this.speedY += this.speedY2;
            this.y += this.speedY;

            // check game over
            if(this.y > 430){
                this.y = 430;
                this.game.gameOver = true;
            }

            // check hit
            this.checkHit();

            if(self.currentFrame == 5){
                self.currentFrame = 0;
                self.changeImage();
            }
        };

        this.checkHit = function(){
            if(
                (this.x - self.game.brick.width <= self.game.brick.x && self.game.brick.x <= this.x + this.width )
                &&
                (this.y < self.game.brick.y2 + self.game.brick.height2 || this.y > self.game.brick.y1)
            ) {
                this.game.gameOver = true;
            }
        }

        this.clickListener = function(){
            if(this.game.gameOver){
                return;
            }
            this.speedY = -10;
        }

        this.changeImage = function(){
            if(this.game.gameOver){
                return;
            }
            if(this.currentImage == 2){
                this.currentImage = 0;
            } else {
                this.currentImage++;
            }
        };

        this.draw = function() {
            if(self.loaded1 && self.loaded2 && self.loaded3){
                self.game.context.drawImage(self.images[self.currentImage], this.x, self.y);
            }
        };
    }
}
