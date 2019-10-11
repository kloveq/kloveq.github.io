var message = function(game){
    this.game = game;
    this.image1 = null;
    this.image2 = null;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.loaded = false;

    var self = this;

    this.init = function(){
        this.loadImage();
    }

    this.loadImage = function(){
        this.image1 = new Image();
        this.image1.onload = function(){
            self.loaded = true;
        }
        this.image1.src = 'images/message.png';
        this.image2 = new Image();
        this.image2.onload = function(){
            self.loaded = true;
        }
        this.image2.src = 'images/gameover.png';
    }

    this.update = function(){
        if(this.game.gameStatus){
            this.width = 184;
            this.height = 267;
            this.x = this.game.width/2 - this.width/2;
            this.y = this.game.height/2 - this.height/2;
        }

        if(this.game.gameOver){
            this.game.gameStatus = 0;
            this.width = 192;
            this.height = 42;
            this.x = this.game.width/2 - this.width/2;
            this.y = this.game.height/2 - this.height/2;
        }
    }

    this.draw = function(){
        if(this.game.gameOver){
            this.drawGameover();
        }

        if(this.game.gameStatus){
            this.drawGreeting();
        }
    }

    this.drawGreeting = function(){
        if(!self.loaded){
            return;
        }
        this.game.context.drawImage(self.image1, self.x, self.y, self.width, self.height);
    }

    this.drawGameover = function(){
        if(!self.loaded){
            return;
        }
        this.game.context.drawImage(self.image2, self.x, self.y, self.width, self.height);
    }
}