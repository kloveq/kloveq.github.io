// Phaser3 example game
// main game scene

var DIR_UP    = 1;
var DIR_DOWN  = 2;
var DIR_LEFT  = 4;
var DIR_RIGHT = 8;

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
    	bombsize = 0;
    	boss_speed = 60;
    },

    create: function ()
    {
		// add sky
		this.add.image(385, 300, 'ground').setScale(1.3);

		scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff'});

		// add platforms
		platforms = this.physics.add.staticGroup();
		platforms = buildMap(this, LEVEL1, platforms);
		
		// add player sprite
		player = this.physics.add.sprite(400, 200, 'player_down_1').setScale(0.5);

		player.body.allowGravity = false;
		player.setCollideWorldBounds(true);

		// add enemies
		enemies = this.physics.add.group();
		enemies = createEnemies(this, ENEMY_LEVEL1, enemies);

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
		this.physics.add.overlap(player, enemies, this.playerDies, null, this);

		this.physics.add.overlap(player, items, this.getItems, null, this);
		
		// player input
		cursors = this.input.keyboard.createCursorKeys();
		keys = this.input.keyboard.addKeys({
			up: 'W',
			down: 'S',
			left: 'A',
			right: 'D'
		});
		
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
			this.createBoomBangs(boom);
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
		if(!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown && !keys.up.isDown && !keys.down.isDown && !keys.left.isDown && !keys.right.isDown) {
			player.anims.play('player_stop');
			return;
		}

		if (cursors.left.isDown || keys.left.isDown) { 
			player.setVelocityX(-speed); 
			player.anims.play('player_left', true);
		}
		if (cursors.right.isDown || keys.right.isDown){ 
			player.setVelocityX(speed); 
			player.anims.play('player_right', true);
		}
		if (cursors.up.isDown || keys.up.isDown){ 
			player.setVelocityY(-speed); 
			player.anims.play('player_up', true);
		}
		if (cursors.down.isDown || keys.down.isDown){ 
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
					enemy.setVelocityX(boss_speed);
					break;
				case 2:
					enemy.anims.play('boss_left', true);
					enemy.setVelocityX(-boss_speed);
					break;
				case 3:
					enemy.anims.play('boss_down', true);
					enemy.setVelocityY(boss_speed);
					break;
			}
		}

		if(touch_left) {
			enemy.x ++;
			switch(random) {
				case 1:
					enemy.anims.play('boss_right', true);
					enemy.setVelocityX(boss_speed);
					break;
				case 2:
					enemy.anims.play('boss_up', true);
					enemy.setVelocityY(-boss_speed);
					break;
				case 3:
					enemy.anims.play('boss_down', true);
					enemy.setVelocityY(boss_speed);
					break;
			}
		}
		if(touch_down) {
			enemy.y --;
			switch(random) {
				case 1:
					enemy.anims.play('boss_right', true);
					enemy.setVelocityX(boss_speed);
					break;
				case 2:
					enemy.anims.play('boss_left', true);
					enemy.setVelocityX(-boss_speed);
					break;
				case 3:
					enemy.anims.play('boss_up', true);
					enemy.setVelocityY(-boss_speed);
					break;
			}
		}
		if(touch_right) {
			enemy.x --;
			switch(random) {
				case 1:
					enemy.anims.play('boss_up', true);
					enemy.setVelocityY(-boss_speed);
					break;
				case 2:
					enemy.anims.play('boss_left', true);
					enemy.setVelocityX(boss_speed);
					break;
				case 3:
					enemy.anims.play('boss_down', true);
					enemy.setVelocityY(boss_speed);
					break;
			}
		}
	},

	createBoomBangs(boom)
	{
		// console.log(boom.tile);

		// if(LEVEL1[boom.tile[1]][boom.tile[0]-1]) {
		// 	console.log('left blocked');
		// 	console.log(bombsize);
		// }
		// if(LEVEL1[boom.tile[1]][boom.tile[0]+1]) {
		// 	console.log('right blocked')
		// }
		// if(LEVEL1[boom.tile[1]-1][boom.tile[0]]) {
		// 	console.log('up blocked')
		// }
		// if(LEVEL1[boom.tile[1]+1][boom.tile[0]]) {
		// 	console.log('down blocked')
		// }
			let currentTime = new Date().getTime();
			if(currentTime - boom.createdTime > 3000) {
				if(bombsize) {
					for (var i = 1; i <= bombsize; i++) {
						boomBangs.create(boom.x - i * 45, boom.y, 'boom_left1');
						boomBangs.create(boom.x + i * 45, boom.y, 'boom_right1');
						boomBangs.create(boom.x, boom.y - i * 45, 'boom_up1');
						boomBangs.create(boom.x, boom.y + i * 45, 'boom_down1');
					}
				}

				boom_mid = boomBangs.create(boom.x, boom.y, 'boom_mid');
				boom_left = boomBangs.create(boom.x - 45 - bombsize * 45, boom.y, 'boom_left');
				boom_left.type = 'left';
				boom_down = boomBangs.create(boom.x, boom.y + 45 + bombsize * 45, 'boom_down');
				boom_down.type = 'down';
				boom_right = boomBangs.create(boom.x + 45 + bombsize * 45, boom.y, 'boom_right');
				boom_right.type = 'right';
				boom_up = boomBangs.create(boom.x, boom.y - 45 - bombsize * 45, 'boom_up');
				boom_up.type = 'up';

				boomBangs.children.entries.forEach(boom_bang => {
					boom_bang.body.allowGravity = false;
					boom_bang.created_time = currentTime;
				});

				// play bomb sound
				this.sfxbomb.play();

				boom.destroy();
			}
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
		boss_speed += 60;
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
				if(bombsize > 1) {
					bombsize = 1;
				}
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
			x = Math.round((player.x -22.5)/45);
			y = Math.round((player.y -22.5)/45);
			boom = booms.create(x * 45 + 22.5, y * 45 + 22.5, 'boom').setScale(0.8);
			boom.tile = [x, y];
			boom.play('boom_animation');
	        boom.body.allowGravity = false;
	        boom.createdTime = timestamp;
			lasttime = timestamp;
		}
	},

	enemyPutBoom(enemy, currentTime) 
	{
		x = Math.round((enemy.x -22.5)/45);
		y = Math.round((enemy.y -22.5)/45);
		boom = bombs.create(x * 45 + 22.5, y * 45 + 22.5, 'boom').setScale(0.8);
		boom.play('boom_animation');
        boom.body.allowGravity = false;
        boom.createdTime = currentTime;
	},

    doBack ()
    {
        console.log('gamescene doBack was called!');
		this.scene.start('mainmenu');
    }

});
