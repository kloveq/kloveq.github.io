class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.width = 288;
        this.height = 512;
        this.bird = null;
        this.bg = null;
        this.brick = null;
        this.base = null;

        // game status
        this.gameOver = false;
        this.gameStatus = 1;

        var self = this;
        this.init = function () {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            document.body.appendChild(this.canvas);

            // create bg
            this.bg = new bg(this);
            this.bg.init();

            // create base
            this.base = new base(this);
            this.base.init();

            // create new bird
            this.bird = new bird(this);
            this.bird.init();

            // create brick
            this.brick = new brick(this);
            this.brick.init();

            // event listener
            this.clickListener();

            this.loop();
        };

        this.clickListener = function(){
            this.canvas.addEventListener('click', function(){
                if(self.gameOver){
                    location.reload();
                }
                self.bird.clickListener();
            })
        }

        this.loop = function() {
            self.update();
            self.draw();
            setTimeout(self.loop, 33);
        };
        this.update = function() {
            this.bg.update();
            this.base.update();
            this.bird.update();
            this.brick.update();
        };
        this.draw = function() {
            this.bg.draw();
            this.base.draw();
            this.brick.draw();
            this.bird.draw();
        };
    }
}

var g = new game();
g.init();