// Phaser3 example game
// main game scene

var DIR_UP    = 1;
var DIR_DOWN  = 2;
var DIR_LEFT  = 4;
var DIR_RIGHT = 8;


const map = [
	[11, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 12],
	[9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
	[9, 0, 1, 2, 2, 0, 1, 0, 3, 0, 1, 2, 2, 0, 1, 0, 8],
	[9, 0, 2, 2, 4, 2, 0, 3, 0, 3, 2, 2, 5, 2, 2, 0, 8],
	[9, 2, 2, 4, 1, 4, 3, 0, 0, 0, 3, 5, 1, 5, 2, 2, 8],
	[9, 2, 4, 4, 4, 4, 4, 2, 3, 2, 5, 5, 5, 5, 5, 2, 8],
	[9, 2, 1, 4, 1, 4, 1, 2, 3, 2, 1, 5, 1, 5, 1, 2, 8],
	[9, 2, 2, 4, 4, 4, 2, 0, 3, 0, 2, 5, 5, 5, 2, 2, 8],
	[9, 0, 2, 2, 4, 4, 4, 2, 3, 2, 5, 5, 5, 5, 2, 0, 8],
	[9, 0, 1, 2, 2, 4, 2, 0, 3, 0, 2, 5, 2, 2, 1, 0, 8],
	[9, 0, 0, 0, 2, 2, 4, 2, 3, 2, 5, 2, 2, 0, 0, 0, 8],
	[9, 0, 1, 0, 1, 2, 2, 2, 3, 2, 2, 2, 1, 0, 1, 0, 8],
	[9, 0, 0, 0, 0, 0, 2, 2, 3, 2, 2, 0, 0, 0, 0, 0, 8],
	[9, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 8],
	[13, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 14]
];

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
    	speed = 80;
    	maxBoom = 1;
    },

    create: function ()
    {
		// add sky
		this.add.image(385, 300, 'ground').setScale(1.3);

		scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff'});

		// add platforms
		platforms = this.physics.add.staticGroup();

		map.forEach((row, rowIndex) => {
			row.forEach((index, colIndex) => {
				switch(index) {
					case 1:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'item_wood').setScale(0.5).refreshBody();
						break;
					case 2:
						item = platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'item_grass').setScale(0.9).refreshBody();
						item.type = 2;
						break;
					case 3:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'item_stone').setScale(0.9).refreshBody();
						break;
					case 6:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'bottom_stone').setScale(0.9);
						break;
					case 7:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'top_stone').setScale(0.9);
						break;
					case 8:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'right_stone').setScale(0.9);
						break;
					case 9:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'left_stone').setScale(0.9);
						break;
					case 11:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'top_left').setScale(0.9);
						break;
					case 12:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'top_right').setScale(0.9);
						break;
					case 13:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'bottom_left').setScale(0.9);
						break;
					case 14:
						platforms.create((colIndex + 0.5) * size, (rowIndex + 0.5) * size, 'bottom_right').setScale(0.9);
						break;

				}
			});
		});

		
		// add player sprite
		player = this.physics.add.sprite(400, 200, 'player_down_1').setScale(0.5);

		player.body.allowGravity = false;
		player.setCollideWorldBounds(true);

		// add enemies
		enemies = this.physics.add.group();
		boss1 = enemies.create(13 * size + 22.5, 13 * size + 22.5, 'boss_down').setScale(0.6);
		boss1.body.allowGravity = false;
		boss1.lasttime = 0;
		boss1.setVelocityY(BOSS_SPEED);
		boss2 = enemies.create(1 * size + 22.5, 13 * size + 22.5, 'boss_down').setScale(0.6);
		boss2.body.allowGravity = false;
		boss2.lasttime = 0;
		boss2.setVelocityY(BOSS_SPEED);
		boss3 = enemies.create(1 * size + 22.5, 1 * size + 22.5, 'boss_down').setScale(0.6);
		boss3.body.allowGravity = false;
		boss3.setVelocityY(BOSS_SPEED);
		boss3.lasttime = 0;

		// add bombs
		booms = this.physics.add.group();
		bombs = this.physics.add.group();
		boomBangs = this.physics.add.group();
		bombBangs = this.physics.add.group();

		// add items
		items = this.physics.add.group();

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

		this.physics.add.overlap(boomBangs, platforms, this.boombangItem, null, this);
		this.physics.add.overlap(boomBangs, enemies, this.boombangEnemy, null, this);
		this.physics.add.overlap(player, bombBangs, this.playerDies, null, this);

		this.physics.add.overlap(player, items, this.getItems, null, this);
		
		// player input
		cursors = this.input.keyboard.createCursorKeys();
		
		// collider
		this.physics.add.collider(player, platforms);
		this.physics.add.collider(booms, platforms);
		this.physics.add.collider(enemies, platforms);

		// quit to menu button
		this.btnquit = this.addButton(720, 40, 'sprites', this.doBack, this, 'btn_close_hl', 'btn_close', 'btn_close_hl', 'btn_close');
    },

    update: function (time, delta)
    {
		// reset velocity
		//this.dude.setVelocityX(0);
		//this.dude.setVelocityY(0);

		player.setVelocity(0);

		// keyboard input

		this.playerMove();

		if (cursors.space.isDown) {
			this.putBoom();
		}

		// booms check status
		booms.children.entries.forEach(boom => {
			let currentTime = new Date().getTime();
			if(currentTime - boom.createdTime > 3000) {
				if(bombsize) {
					for (var i = 1; i <= bombsize; i++) {
						boomBangs.create(boom.x - i * 45, boom.y, 'boom_mid');
						boomBangs.create(boom.x + i * 45, boom.y, 'boom_mid');
						boomBangs.create(boom.x, boom.y - i * 45, 'boom_mid');
						boomBangs.create(boom.x, boom.y + i * 45, 'boom_mid');
					}
				}

				boom_mid = boomBangs.create(boom.x, boom.y, 'boom_mid');
				boom_left = boomBangs.create(boom.x - 45 - bombsize * 45, boom.y, 'boom_left');
				boom_down = boomBangs.create(boom.x, boom.y + 45 + bombsize * 45, 'boom_down');
				boom_right = boomBangs.create(boom.x + 45 + bombsize * 45, boom.y, 'boom_right');
				boom_up = boomBangs.create(boom.x, boom.y - 45 - bombsize * 45, 'boom_up');

				boomBangs.children.entries.forEach(boom_bang => {
					boom_bang.body.allowGravity = false;
					boom_bang.created_time = currentTime;
				});

				// play bomb sound
				this.sfxbomb.play();

				boom.destroy();
			}
		});

		// bombs check status
		bombs.children.entries.forEach(boom => {
			let currentTime = new Date().getTime();
			if(currentTime - boom.createdTime > 3000) {
				
				boom_mid = bombBangs.create(boom.x, boom.y, 'boom_mid');
				boom_left = bombBangs.create(boom.x - 45, boom.y, 'boom_left');
				boom_down = bombBangs.create(boom.x, boom.y + 45, 'boom_down');
				boom_right = bombBangs.create(boom.x + 45, boom.y, 'boom_right');
				boom_up = bombBangs.create(boom.x, boom.y - 45, 'boom_up');

				bombBangs.children.entries.forEach(boom_bang => {
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

		// bombBangs check status
		bombBangs.children.entries.forEach(boom_bang => {
			let currentTime = new Date().getTime();
			if(currentTime - boom_bang.created_time > 200) {
				boom_bang.destroy();
			}
		});

		// enemy move
		enemies.children.entries.forEach(enemy => {
			if(!enemy.body.touching.none) {
				this.enemyMove(enemy);
			}
			let currentTime = new Date().getTime();
			if(currentTime - enemy.lasttime > 3000) {
				this.enemyPutBoom(enemy, currentTime);
				enemy.lasttime = currentTime;
			}
		});

    },
	
	playerMove()
	{
		if(!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
			player.anims.play('player_stop');
			return;
		}

		if (cursors.left.isDown) { 
			player.setVelocityX(-speed); 
			player.anims.play('player_left', true);
		}
		if (cursors.right.isDown){ 
			player.setVelocityX(speed); 
			player.anims.play('player_right', true);
		}
		if (cursors.up.isDown){ 
			player.setVelocityY(-speed); 
			player.anims.play('player_up', true);
		}
		if (cursors.down.isDown){ 
			player.setVelocityY(speed); 
			player.anims.play('player_down', true);
		}

	},

	enemyMove(enemy)
	{
		let touch_left = enemy.body.touching.left;
		let touch_right = enemy.body.touching.right;
		let touch_up = enemy.body.touching.up;
		let touch_down = enemy.body.touching.down;

		enemy.setVelocity(0);

		let random = Phaser.Math.Between(1, 3);
		if(touch_up) {
			enemy.y ++;
			switch(random) {
				case 1:
					enemy.anims.play('boss_right', true);
					enemy.setVelocityX(BOSS_SPEED);
					break;
				case 2:
					enemy.anims.play('boss_left', true);
					enemy.setVelocityX(-BOSS_SPEED);
					break;
				case 3:
					enemy.anims.play('boss_down', true);
					enemy.setVelocityY(BOSS_SPEED);
					break;
			}
		}

		if(touch_left) {
			enemy.x ++;
			switch(random) {
				case 1:
					enemy.anims.play('boss_right', true);
					enemy.setVelocityX(BOSS_SPEED);
					break;
				case 2:
					enemy.anims.play('boss_up', true);
					enemy.setVelocityY(-BOSS_SPEED);
					break;
				case 3:
					enemy.anims.play('boss_down', true);
					enemy.setVelocityY(BOSS_SPEED);
					break;
			}
		}
		if(touch_down) {
			enemy.y --;
			switch(random) {
				case 1:
					enemy.anims.play('boss_right', true);
					enemy.setVelocityX(BOSS_SPEED);
					break;
				case 2:
					enemy.anims.play('boss_left', true);
					enemy.setVelocityX(-BOSS_SPEED);
					break;
				case 3:
					enemy.anims.play('boss_up', true);
					enemy.setVelocityY(-BOSS_SPEED);
					break;
			}
		}
		if(touch_right) {
			enemy.x --;
			switch(random) {
				case 1:
					enemy.anims.play('boss_up', true);
					enemy.setVelocityY(-BOSS_SPEED);
					break;
				case 2:
					enemy.anims.play('boss_left', true);
					enemy.setVelocityX(BOSS_SPEED);
					break;
				case 3:
					enemy.anims.play('boss_down', true);
					enemy.setVelocityY(BOSS_SPEED);
					break;
			}
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
	
	boombangItem (boom_bang, obj)
	{
		if(obj.type === 2) {
			obj.destroy();
			let random = Phaser.Math.Between(1, 6);
			let item;
			switch(random) {
				case 1:
					item = items.create(obj.x, obj.y, 'item_shoe');
					item.type = 1;
					break;
				case 2:
					item = items.create(obj.x, obj.y, 'item_bomb');
					item.type = 2;
					break;
				case 3:
					item = items.create(obj.x, obj.y, 'item_bombsize');
					item.type = 3;
					break;
				default:
					return;
			}
			item.body.allowGravity = false;
		}
	},

	boombangEnemy(boom_bang, enemy)
	{
		enemy.destroy();
		if(enemies.countActive(true) === 0) {
			this.playerWin();
		}
	},

	getItems(player, item)
	{
		item.destroy();
		this.sfxcoin.play();
		switch(item.type) {
			case 1:
				speed += 10;
				break;
			case 2:
				maxBoom ++;
				break;
			case 3:
				bombsize ++;
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
		this.physics.pause();
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
		if(timestamp - lasttime > 500 && booms.countActive(true) < maxBoom) {
			console.log("A boom here");
			boom = booms.create(player.x, player.y, 'boom').setScale(0.9);
			boom.setBounce(0.4);
	        boom.setCollideWorldBounds(true);
	        boom.body.allowGravity = false;
	        boom.createdTime = timestamp;
			console.log(boom);
			lasttime = timestamp;
		}
	},

	enemyPutBoom(enemy, currentTime) 
	{
		boom = bombs.create(enemy.x, enemy.y, 'boom').setScale(0.9);
		boom.setBounce(0.4);
        boom.setCollideWorldBounds(true);
        boom.body.allowGravity = false;
        boom.createdTime = currentTime;
	},

    doBack ()
    {
        console.log('gamescene doBack was called!');
		this.scene.start('mainmenu');
    }

});
