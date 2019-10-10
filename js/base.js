var base = function (game) {
    this.game = game;
    this.image = null;
    this.loaded = false;
    this.x = 0;

    var self = this;

    this.init = function () {
        this.loadImage();
    };

    this.loadImage = function () {
        this.image = new Image();
        this.image.onload = function () {
            self.loaded = true;
        }
        this.image.src = 'images/base.png';
    }

    this.update = function () {
        if(this.game.gameOver){
            return;
        }
        this.x -= 5;
        if(this.x == -300){
            this.x = 0;
        }
    };

    this.draw = function () {
        if(self.loaded == false){
            return;
        }
        self.game.context.drawImage(self.image, this.x, 450);
        self.game.context.drawImage(self.image, game.width + this.x, 450);
    };
}