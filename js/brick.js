var brick = function (game) {
    this.game = game;
    this.image1 = null;
    this.image2 = null;
    this.loaded = false;
    this.x = 288;
    this.y1 = 0;
    this.y2 = 0;
    this.width = 26;
    this.height1 = 160;
    this.height2 = 160;

    var self = this;

    this.init = function () {
        this.loadImage();
    };

    this.loadImage = function () {
        this.image1 = new Image();
        this.image1.onload = function () {
            self.loaded = true;
        }
        this.image1.src = 'images/pipe-red.png';

        this.image2 = new Image();
        this.image2.onload = function () {
            self.loaded = true;
        }
        this.image2.src = 'images/pipe-green.png';
    }

    this.update = function () {
        if(this.game.gameOver){
            return;
        }
        this.x -= 2;
        if(this.x == -30){
            this.x = 288;
            this.height1 = Math.random() * 200;
            this.height2 = 320 - this.height1;
        }
        this.y1 = 450 - this.height1;
    };

    this.draw = function () {
        if(self.loaded == false){
            return;
        }
        self.game.context.drawImage(this.image1, this.x, this.y1, this.width, this.height1);
        self.game.context.drawImage(this.image2, this.x, this.y2, this.width, this.height2);
    };
}