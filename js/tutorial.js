// Phaser3 example game
// tutorial scene

var TutorScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function TutorScene ()
    {
        Phaser.Scene.call(this, { key: 'tutorscene' });
    },

    preload: function ()
    {
    },

    create: function ()
    {
		// add logo
		//this.sys.config.backgroundColor = '#f3cca3';
		
        this.add.image(380, 340, 'backgroundHelp');

		// back Button
		this.btnback = this.addButton(600, 600, 'sprites', this.doBack, this, 'btn_back_hl', 'btn_back', 'btn_back_hl', 'btn_back');

		console.log('tutorial is ready');
        console.log(gamestate);
    },

    doBack: function ()
    {
        console.log('doBack was called!');
        gamestate = GAME_STATE.MENU;
		this.scene.start('mainmenu');
    }

});
