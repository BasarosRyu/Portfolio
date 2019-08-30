var Jumper = function() {};
Jumper.Play = function() {};
Jumper.Play.prototype = {

    preload: function() {
        this.load.image( 'hero', 'doodler.png' );
        this.load.image( 'pixel', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/836/pixel_1.png' );
    },

    create: function() {
        this.stage.backgroundColor = '#6bf';
        this.started = false;

        this.physics.startSystem( Phaser.Physics.ARCADE );
        this.cameraXMin = 9999;
        this.platformXMin = 900;
        this.count = 0;
        this.text = game.add.text(0, this.game.height -30, " Score : 0");
        this.text.fixedToCamera = true;

        // Pour center le jeu
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.maxWidth = this.game.width;
        this.scale.maxHeight = this.game.height;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;


        this.platformsCreate();
        this.groundCreate();
        this.heroCreate();
        this.cursor = this.input.keyboard.createCursorKeys();


    },

    update: function() {
        // permet de suivre la caméra..
        this.world.setBounds( this.hero.xChange, 0, this.world.width + this.hero.xChange, this.game.height );
        this.cameraXMin = Math.min(this.cameraXMin, this.hero.xChange, this.hero.x, 80);
        this.camera.x = this.cameraXMin;

        this.physics.arcade.collide(this.hero, this.grounds);
        game.physics.arcade.collide(this.hero, this.platforms, this.restart);
        this.heroMove();
        this.groundCreate();

        this.platforms.forEachAlive(function(elem) {
            if(this.platformXMin < elem.x) {
                this.platformXMin = elem.x
            }
            if(elem.x < this.camera.x - 80) {
                elem.kill();
                this.platformsCreateOne(this.platformXMin + 200, this.rnd.integerInRange(0, this.world.height - 86), 50);
            }
        }, this);
    },

    shutdown: function() {
        // reset everything, or the world will be messed up
        this.world.setBounds( 0, 0, this.game.width, this.game.height );
        this.cursor = null;
        this.hero.destroy();
        this.hero = null;
        this.platforms.destroy();
        this.platforms = null;
        this.grounds.destroy();
        this.grounds  = null;
    },

    // fonctions pour créer les platforms.
    platformsCreate: function() {
        this.platforms = this.add.group();
        this.platforms.enableBody = true;
        this.platforms.createMultiple(8, 'pixel' );
        // ordre des params : positionx, position y, largeur)

        for( var i = 0; i < 8; i++ ) {
            this.platformsCreateOne(this.rnd.integerInRange(0, this.world.width) + 160, this.rnd.integerInRange(0, this.world.height - 86), 50);
        }
    },

    platformsCreateOne: function( x, y, width ) {
        var platform = this.platforms.getFirstDead();
        platform.reset( x, y );
        platform.scale.x = width;
        platform.scale.y = 16;
        platform.body.immovable = true;
        return platform;
    },


    // fonctions pour créer le sol et le plafond. Recopier sur le modèle des platforms
    groundCreate: function() {
        this.grounds = this.add.group();
        this.grounds.enableBody = true;
        this.grounds.createMultiple(2, 'pixel' );

        // on créé le sol et le plafond
        this.groundCreateOne( -16, this.world.height - 86, this.world.width + 16 );
        this.groundCreateOne( -16, this.world.height - 316, this.world.width + 16 );
    },

    groundCreateOne: function( x, y, width ) {
        var ground = this.grounds.getFirstDead();
        ground.reset( x, y );
        ground.scale.x = width;
        ground.scale.y = 10;
        ground.body.immovable = true;
        return ground;
    },

    heroCreate: function() {
        this.hero = game.add.sprite( 80, this.world.height - 106, 'hero' );
        this.hero.anchor.set( 0.5 );

        this.physics.arcade.enable( this.hero );
        this.hero.body.gravity.y = 600;

        // on défini le point de départ du perso.
        this.hero.xOrig = this.hero.x;
        this.hero.xChange = 0;
    },


    heroMove: function() {
        if( this.started == false) {
            if( this.cursor.up.isDown || this.cursor.down.isDown || this.cursor.left.isDown || this.cursor.right.isDown) {
                this.started = true;
            }
        }
        else if (this.started == true) {
            if(this.cursor.left.isDown) {
                this.hero.rotation += 1;
            }
            if(this.cursor.right.isDown) {
                this.hero.rotation -= 1;
            }

            // descendre ou monter selon la touche. Oui, on peut voler
            if( this.cursor.up.isDown) {
                this.hero.body.velocity.y = -300;
                this.hero.body.velocity.x = 500;
            }
            else if(this.cursor.down.isDown) {
                this.hero.body.velocity.y = 300;
                this.hero.body.velocity.x = 500;
            }

            // le perso se déplacement toujours vers la droite pour avancer
            else {
                this.hero.body.velocity.x = 500;
            }
      }

      // compter le nombre de distance parcouru
      this.hero.xChange = Math.max( this.hero.xChange, Math.abs( this.hero.x - this.hero.xOrig ));
      this.text.setText("Score : " + Math.floor(this.hero.xChange));
  },

    restart: function() {
		game.state.start( 'Play' );
	}
}

var game = new Phaser.Game( 900, 300, Phaser.CANVAS, '' );
game.state.add( 'Play', Jumper.Play );
game.state.start( 'Play' );
