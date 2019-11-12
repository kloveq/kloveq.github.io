// Phaser3 example game
// main game scene

var DIR_UP    = 1;
var DIR_DOWN  = 2;
var DIR_LEFT  = 4;
var DIR_RIGHT = 8;

var maxBomb = 1;
var speed = 100;

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gamescene' });
    },

    preload: function ()
    {
    	gamestate = GAME_STATE.RUNNING;
    },

    create: function ()
    {
		// add sky
		this.add.image(400, 300, 'sky');

		// add player sprite
		player = this.physics.add.sprite(400, 200, 'bomber').setScale(0.6);

		player.setCollideWorldBounds(true);
		player.setBounceY(0.1);

		scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff'});

		// add platforms
		platforms = this.physics.add.staticGroup();

		platforms.create(400, 568, 'ground').setScale(2).refreshBody();
		platforms.create(100, 200, 'ground');
		platforms.create(620, 300, 'ground');
		platforms.create(180, 400, 'ground');

		
		// add bombs
		bombs = this.physics.add.group();
		booms = this.physics.add.group();
		boomBangs = this.physics.add.group();

		// add items
		items = this.physics.add.group();

		// add random coins and bombs
		gameitems = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: {
				x: 12,
				y: 0,
				stepX: 70
			}
		});

		gameitems.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
		});

		gameitems.children.iterate(function (child) {
			child.setCollideWorldBounds(true);
		});

		// coin particles
		var sparks = this.add.particles('sprites');
		this.coinspark = sparks.createEmitter({
			frame: [ 'sparkle1', 'sparkle2' ],
			quantity: 15,
			scale: { start: 1.0, end: 0 },
			on: false,
			speed: 200,
			lifespan: 500
		});
		
		// bomb explosion particles (small)
		var expl1 = this.add.particles('sprites');
		this.bombexpl1 = expl1.createEmitter({
			frame: [ 'bombexpl1' ],
			frequency: 100,
			quantity: 10,
			scale: { start: 1.0, end: 0 },
			speed: { min: -1000, max: 1000 },
			lifespan: 800,
			on: false
		});
		
		// bomb explosion particles (big)
		var expl2 = this.add.particles('sprites');
		this.bombexpl2 = expl2.createEmitter({
			frame: [ 'bombexpl2' ],
			quantity: 3,
			scale: { start: 2.0, end: 0 },
			frequency: 500,
			on: false,
			speed: { min: -200, max: 200 },
			lifespan: 1000
		});

		// sound effects
		this.sfxcoin = this.sound.add('coin');
		this.sfxbomb = this.sound.add('bomb');

		// set up arcade physics, using `physics` requires "physics:{default: 'arcade'" when starting "new Phaser.Game(.."
		this.physics.add.overlap(player, gameitems, this.doOverlapItem, null, this);
		//this.physics.add.overlap(player, bombs, this.bombsOverlap, null, this);
		this.physics.add.overlap(gameitems, bombs, this.bombsOverlapItem, null, this);

		this.physics.add.overlap(boomBangs, gameitems, this.boombangItem, null, this);

		this.physics.add.overlap(player, items, this.getItems, null, this);
		
		// player input
		cursors = this.input.keyboard.createCursorKeys();
		
		// collider
		this.physics.add.collider(player, platforms);
		this.physics.add.collider(gameitems, platforms);
		this.physics.add.collider(bombs, platforms);
		this.physics.add.collider(booms, platforms);

		// create bomber animation
		this.anims.create({
			key: 'turn',
			frames: [{key: 'bomber'}]
		});

		this.anims.create({
			key: 'left',
			frames: [{key: 'bomber_left'}]
		});

		this.anims.create({
			key: 'right',
			frames: [{key: 'bomber_right'}]
		});

		// quit to menu button
		this.btnquit = this.addButton(760, 40, 'sprites', this.doBack, this, 'btn_close_hl', 'btn_close', 'btn_close_hl', 'btn_close');
    },

    update: function (time, delta)
    {
		// reset velocity
		//this.dude.setVelocityX(0);
		//this.dude.setVelocityY(0);

		// keyboard input

		if (cursors.left.isDown) { 
			player.setVelocityX(-speed); 
			player.anims.play('left');
		}
		else if (cursors.right.isDown){ 
			player.setVelocityX(speed); 
			player.anims.play('right');
		}
		else { 
			player.setVelocityX(0); 
			player.anims.play('turn');
		}

		if (cursors.up.isDown && player.body.touching.down ||
			cursors.left.isDown && cursors.up.isDown && player.body.touching.left ||
			cursors.right.isDown && cursors.up.isDown && player.body.touching.right)
		{ 
			player.setVelocityY(-330); 
		}

		if (cursors.space.isDown) {
			this.putBoom();
		}

		if (cursors.down.isDown) {
			this.fireBomb();
		}

		// bombs movement
		bombs.children.entries.forEach(bomb => {
			if(bomb.x <= 0 || bomb.x >= 800) {
				bomb.speedX *= -1;
			}
			if(bomb.y <= 0 || bomb.y >= 600) {
				bomb.speedY *= -1;
			}
		});

		// booms check status
		booms.children.entries.forEach(boom => {
			let currentTime = new Date().getTime();
			if(currentTime - boom.createdTime > 3000) {
				boom_mid = boomBangs.create(boom.x, boom.y, 'boom_mid').setScale(0.5);
				boom_left = boomBangs.create(boom.x - 22.5, boom.y, 'boom_left').setScale(0.5);
				boom_down = boomBangs.create(boom.x, boom.y + 22.5, 'boom_down').setScale(0.5);
				boom_right = boomBangs.create(boom.x + 22.5, boom.y, 'boom_right').setScale(0.5);
				boom_up = boomBangs.create(boom.x, boom.y - 22.5, 'boom_up').setScale(0.5);

				boomBangs.children.entries.forEach(boom_bang => {
					boom_bang.body.allowGravity = false;
					boom_bang.created_time = currentTime;
				});

				// play bomb sound
				this.sfxbomb.play();

				boom.destroy();
			}
		});

		// boom bang check status
		boomBangs.children.entries.forEach(boom_bang => {
			let currentTime = new Date().getTime();
			if(currentTime - boom_bang.created_time > 200) {
				boom_bang.destroy();
			}
		});
		
    },
	
    doOverlapItem: function (dud, obj) {
		console.log('doOverlapItem -- hit!');

		if(!cursors.down.isDown) {
			return;
		} else {
			
			// play coin sound
			this.sfxcoin.play();

			// get score
			score += 10;
			scoreText.setText('Score: ' + score);

			// set emitter to coin position and emit particles
			this.coinspark.setPosition(obj.x, obj.y);
			this.coinspark.explode();	
			
			// Completely destroy and remove object from memory
			obj.destroy();

			// check coins
			if(gameitems.countActive(true) === 0) {
				this.playerWin();
			};

			// Hide the sprite and disable the body,
			//   don't destroy sprite and potentially re-use memory at later time
			//   when adding new sprites to gameitems
			//gameitems.killAndHide(obj);
			//obj.body.enable = false;
		}
		
	},

	bombsOverlap(player, bomb)
	{
		console.log('doOverlapBomb -- hit!');
		// play bomb sound
		this.sfxbomb.play();

		// set emitters for bomb explosion
		this.bombexpl1.setPosition(bomb.x, bomb.y);
		this.bombexpl1.explode();

		this.bombexpl2.setPosition(bomb.x, bomb.y);
		this.bombexpl2.explode();

		// Completely destroy and remove object from memory
		bomb.destroy();

		// check coins
		if(bombs.countActive(true) === 0) {
			this.playerWin();
		};
	},
	
	bombsOverlapItem(item, bomb)
	{
		console.log('doOverlapBomb -- hit!');
		// play coin sound
		this.sfxbomb.play();

		// get score
		score += 10;
		scoreText.setText('Score: ' + score);

		// set emitters for bomb explosion
		this.bombexpl1.setPosition(bomb.x, bomb.y);
		this.bombexpl1.explode();

		this.bombexpl2.setPosition(bomb.x, bomb.y);
		this.bombexpl2.explode();

		// Completely destroy and remove object from memory
		bomb.destroy();
		item.destroy();

		// check coins
		if(gameitems.countActive(true) === 0) {
			this.playerWin();
		};
	},

	boombangItem (boom_bang, obj)
	{
		obj.destroy();
		let random = Phaser.Math.Between(1, 3);
		let item;
		console.log(random);
		switch(random) {
			case 1:
				item = items.create(obj.x, obj.y, 'item_shoe').setScale(0.6);
				item.type = 1;
				break;
			case 2:
				item = items.create(obj.x, obj.y, 'item_bomb').setScale(0.6);
				item.type = 2;
				break;
			case 3:
				item = items.create(obj.x, obj.y, 'item_bombsize').setScale(0.6);
				item.type = 3;
				break;
		}
		item.body.allowGravity = false;
	},

	getItems(player, item)
	{
		item.destroy();
		switch(item.type) {
			case 1:
				speed += 30;
				break;
			case 2:
				maxBomb ++;
				break;
		}
	},
	
    playerDies () {

		// make player invisible
		// this.dude.visible = false;
		// this.dude.body.enable = false;
		
		// add game over text
		var txt = this.add.bitmapText(400, 300, 'fontwhite', 'Game over!');
		txt.setOrigin(0.5).setCenterAlign();

		// set gameover text as transparant, upside down and larger
		txt.setAlpha(0.0);
		txt.setAngle(180);
		txt.setScale(4.0, 4.0);
		
		// add twirl/zoom animation to gameover text
		var tw = this.tweens.add(
			{
				targets: txt,
				scaleX: 1.0,
				scaleY: 1.0,
				alpha: 1.0,
				angle: 0,
				ease: 'Power3',
				duration: 1000, // duration of animation; higher=slower
				delay: 500      // wait 500 ms before starting
			}
		);
	},

	playerWin() {

		// make player invisible
		// this.dude.visible = false;
		// this.dude.body.enable = false;
		
		// add game over text
		var txt = this.add.bitmapText(400, 300, 'fontwhite', 'Congratulations!');
		txt.setOrigin(0.5).setCenterAlign();

		// set gameover text as transparant, upside down and larger
		txt.setAlpha(0.0);
		txt.setAngle(180);
		txt.setScale(4.0, 4.0);
		
		// add twirl/zoom animation to gameover text
		var tw = this.tweens.add(
			{
				targets: txt,
				scaleX: 1.0,
				scaleY: 1.0,
				alpha: 1.0,
				angle: 0,
				ease: 'Power3',
				duration: 1000, // duration of animation; higher=slower
				delay: 500      // wait 500 ms before starting
			}
		);
	},

	putBoom() 
	{
		timestamp = new Date().getTime();
		if(timestamp - lasttime > 500 && booms.countActive(true) < maxBomb) {
			console.log("A boom here");
			boom = booms.create(player.x, player.y, 'boom').setScale(0.5);
			boom.setBounce(0.4);
	        boom.setCollideWorldBounds(true);
	        boom.createdTime = timestamp;
			console.log(boom);
			lasttime = timestamp;
		}
	},

	fireBomb() 
	{
		timestamp = new Date().getTime();
		if(timestamp - lasttime > 1000 && bombs.countActive(true) < 3) {
			console.log("A bomb here");
			bomb = bombs.create(player.x, player.y, 'bomb');
			bomb.setBounce(1);
	        bomb.setCollideWorldBounds(true);
	        bomb.setVelocity(Phaser.Math.Between(-200, 200), 200);
	        bomb.body.allowGravity = false;
			console.log(bomb);
			lasttime = timestamp;
		}
	},

    doBack ()
    {
        console.log('gamescene doBack was called!');
		this.scene.start('mainmenu');
    }

});
