// Phaser3 example game
// preloader and loading bar

// frameRate: so frame trong 1 s


var Preloader = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function Preloader ()
	{
		// note: the pack:{files[]} acts like a pre-preloader
		// this eliminates the need for an extra "boot" scene just to preload the loadingbar images
		Phaser.Scene.call(this, {
			key: 'preloader',
			pack: {
				files: [
					{ type: 'image', key: 'loadingbar_bg', url: 'img/loadingbar_bg.png' },
					{ type: 'image', key: 'loadingbar_fill', url: 'img/loadingbar_fill.png' }
				]
			}
		});
	},
	
	setPreloadSprite: function (sprite)
	{
		this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };

		//sprite.crop(this.preloadSprite.rect);
		sprite.visible = true;

		// set callback for loading progress updates
		this.load.on('progress', this.onProgress, this );
		this.load.on('fileprogress', this.onFileProgress, this );
	},
	
	onProgress: function (value) {

		if (this.preloadSprite)
		{
			// calculate width based on value=0.0 .. 1.0
			var w = Math.floor(this.preloadSprite.width * value);
			console.log('onProgress: value=' + value + " w=" + w);
			
			// sprite.frame.width cannot be zero
			//w = (w <= 0 ? 1 : w);
			
			// set width of sprite			
			this.preloadSprite.sprite.frame.width    = (w <= 0 ? 1 : w);
			this.preloadSprite.sprite.frame.cutWidth = w;

			// update screen
			this.preloadSprite.sprite.frame.updateUVs();
		}
	},
	
	onFileProgress: function (file) {
		console.log('onFileProgress: file.key=' + file.key);
	},

	preload: function ()
	{
		// setup the loading bar
		// note: images are available during preload because of the pack-property in the constructor
		this.loadingbar_bg   = this.add.sprite(400, 300, "loadingbar_bg");
		this.loadingbar_fill = this.add.sprite(400, 300, "loadingbar_fill");
		this.setPreloadSprite(this.loadingbar_fill);

		// now load images, audio etc.
		// sprites, note: see free sprite atlas creation tool here https://www.leshylabs.com/apps/sstool/
		this.load.atlas('sprites', 'img/spritearray.png', 'img/spritearray.json');

		// image
		this.load.image('boom1', 'img/images/boom1.png');
		this.load.image('boom2', 'img/images/boom2.png');
		this.load.image('boom3', 'img/images/boom3.png');
		this.load.image('boom4', 'img/images/boom4.png');
		this.load.image('boom5', 'img/images/boom5.png');
		this.load.image('boom6', 'img/images/boom6.png');
		this.load.image('boom7', 'img/images/boom7.png');
		this.load.image('boom', 'img/images/boom8.png');
		this.load.image('boom_mid', 'img/images/bombbang_mid_2.png');
		this.load.image('boom_left', 'img/images/bombbang_left_2.png');
		this.load.image('boom_down', 'img/images/bombbang_down_2.png');
		this.load.image('boom_left1', 'img/images/bombbang_left_1.png');
		this.load.image('boom_down1', 'img/images/bombbang_down_1.png');
		this.load.image('boom_right', 'img/images/bombbang_right_2.png');
		this.load.image('boom_up', 'img/images/bombbang_up_2.png');
		this.load.image('boom_right1', 'img/images/bombbang_right_1.png');
		this.load.image('boom_up1', 'img/images/bombbang_up_1.png');

		// player
		this.load.image('player_left_1', 'img/images/player_left_1.png');
		this.load.image('player_left_2', 'img/images/player_left_2.png');
		this.load.image('player_left_3', 'img/images/player_left_3.png');
		this.load.image('player_left_4', 'img/images/player_left_4.png');
		this.load.image('player_left_5', 'img/images/player_left_5.png');
		this.load.image('player_right_1', 'img/images/player_right_1.png');
		this.load.image('player_right_2', 'img/images/player_right_2.png');
		this.load.image('player_right_3', 'img/images/player_right_3.png');
		this.load.image('player_right_4', 'img/images/player_right_4.png');
		this.load.image('player_right_5', 'img/images/player_right_5.png');
		this.load.image('player_down_1', 'img/images/player_down_1.png');
		this.load.image('player_down_2', 'img/images/player_down_2.png');
		this.load.image('player_down_3', 'img/images/player_down_3.png');
		this.load.image('player_down_4', 'img/images/player_down_4.png');
		this.load.image('player_down_5', 'img/images/player_down_5.png');
		this.load.image('player_up_1', 'img/images/player_up_1.png');
		this.load.image('player_up_2', 'img/images/player_up_2.png');
		this.load.image('player_up_3', 'img/images/player_up_3.png');
		this.load.image('player_up_4', 'img/images/player_up_4.png');
		this.load.image('player_up_5', 'img/images/player_up_5.png');

		// enemies
		this.load.image('boss_down', 'img/images/boss_down.png');
		this.load.image('boss_down_1', 'img/images/boss_down_1.png');
		this.load.image('boss_up', 'img/images/boss_up.png');
		this.load.image('boss_up_1', 'img/images/boss_up_1.png');
		this.load.image('boss_right', 'img/images/boss_right.png');
		this.load.image('boss_right_1', 'img/images/boss_right_1.png');
		this.load.image('boss_left', 'img/images/boss_left.png');
		this.load.image('boss_left_1', 'img/images/boss_left_1.png');

		// item
		this.load.image('item_shoe', 'img/images/item_shoe.png');
		this.load.image('item_bomb', 'img/images/item_bomb.png');
		this.load.image('item_bombsize', 'img/images/item_bombsize.png');
		this.load.image('item_stone', 'img/images/stone.png');
		this.load.image('item_wood', 'img/images/wood.png');
		this.load.image('item_grass', 'img/images/grass.png');
		this.load.image('ground', 'img/images/background.jpg');
		this.load.image('left_stone', 'img/images/vienTrai.png');
		this.load.image('right_stone', 'img/images/vienPhai.png');
		this.load.image('top_stone', 'img/images/vienTren.png');
		this.load.image('bottom_stone', 'img/images/vienDuoi.png');
		this.load.image('bottom_left', 'img/images/gocDuoiTrai.png');
		this.load.image('bottom_right', 'img/images/gocDuoiPhai.png');
		this.load.image('top_left', 'img/images/gocTrenTrai.png');
		this.load.image('top_right', 'img/images/gocTrenPhai.png');
		this.load.image('backgroundHelp', 'img/images/backgroundHelp.png');

		// font
		this.load.bitmapFont('fontwhite', 'img/fontwhite.png', 'img/fontwhite.xml');
		
		// sound effects
		//this.load.audio('bg', [this.p('audio/bg.mp3'),this.p('audio/bg.ogg')]);
		this.load.audio('coin', ['snd/coin.mp3', 'snd/coin.ogg']);
		this.load.audio('bomb', ['snd/expl.mp3', 'snd/expl.ogg']);
		this.load.audio('btn',  ['snd/btn.mp3', 'snd/btn.ogg']);
		
		// !! TESTING !! load the same image 500 times just to slow down the load and test the loading bar
		//for (var i = 0; i < 500; i++) {
		//	this.load.image('testloading'+i, 'img/spritearray.png');
		//};
		// !! TESTING !!
	},

	create: function ()
	{
		// also create animations
		this.anims.create({
				key: 'cointurn',
				frames: [
					{ key: 'sprites', frame: 'coin1' },
					{ key: 'sprites', frame: 'coin2' },
					{ key: 'sprites', frame: 'coin3' },
					{ key: 'sprites', frame: 'coin4' },
					{ key: 'sprites', frame: 'coin5' },
					{ key: 'sprites', frame: 'coin6' },
					{ key: 'sprites', frame: 'coin7' },
					{ key: 'sprites', frame: 'coin8' }
				],
				frameRate: 15,
				repeat: -1
			});

		this.anims.create({
			key: 'player_left',
			frames: [
				{key: 'player_left_1'},
				{key: 'player_left_2'},
				{key: 'player_left_3'},
				{key: 'player_left_4'},
				{key: 'player_left_5'}
			],
			frameRate: 10,
			repeat: -1
		});
			
		this.anims.create({
			key: 'player_right',
			frames: [
				{key: 'player_right_1'},
				{key: 'player_right_2'},
				{key: 'player_right_3'},
				{key: 'player_right_4'},
				{key: 'player_right_5'}
			],
			frameRate: 10,
			repeat: -1
		});
			
		this.anims.create({
			key: 'player_up',
			frames: [
				{key: 'player_up_1'},
				{key: 'player_up_2'},
				{key: 'player_up_3'},
				{key: 'player_up_4'},
				{key: 'player_up_5'}
			],
			frameRate: 10,
			repeat: -1
		});
			
		this.anims.create({
			key: 'player_down',
			frames: [
				{key: 'player_down_1'},
				{key: 'player_down_2'},
				{key: 'player_down_3'},
				{key: 'player_down_4'},
				{key: 'player_down_5'}
			],
			frameRate: 10,
			repeat: -1
		});
			
		this.anims.create({
			key: 'player_stop',
			frames: [
				{key: 'player_down_1'}
			]
		});

		this.anims.create({
			key: 'boss_left',
			frames: [
				{key: 'boss_left'},
				{key: 'boss_left_1'}
			],
			frameRate: 2,
			repeat: -1
		});
			
		this.anims.create({
			key: 'boss_right',
			frames: [
				{key: 'boss_right'},
				{key: 'boss_right_1'}
			],
			frameRate: 2,
			repeat: -1
		});
			
		this.anims.create({
			key: 'boss_down',
			frames: [
				{key: 'boss_down'},
				{key: 'boss_down_1'}
			],
			frameRate: 2,
			repeat: -1
		});
			
		this.anims.create({
			key: 'boss_up',
			frames: [
				{key: 'boss_up'},
				{key: 'boss_up_1'}
			],
			frameRate: 2,
			repeat: -1
		});

		this.anims.create({
			key: 'boom_animation',
			frames: [
				{key: 'boom1'},
				{key: 'boom2'},
				{key: 'boom3'},
				{key: 'boom4'},
				{key: 'boom5'},
				{key: 'boom6'},
				{key: 'boom7'}
			],
			frameRate: 5,
			repeat: -1
		});
			
		console.log('Preloader scene is ready, now start the actual game and never return to this scene');

		// dispose loader bar images
		this.loadingbar_bg.destroy();
		this.loadingbar_fill.destroy();
		this.preloadSprite = null;

		// start actual game
		this.scene.start('mainmenu');
	}
});
