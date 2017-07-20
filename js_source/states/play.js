// Play loop state
Game.playState = {
    map: null,
    party: null,
    cursors: null,

    preload: function() {
        Engine.load.tilemap("map", "maps/map1.json", null, Phaser.Tilemap.TILED_JSON);
    },

    create: function() {
        console.info(Game.name + " play loop");
        console.info("Game params", Game);

        // On esc, restart current map, lose a life. If game over, go back to menu
        var key = Engine.input.keyboard.addKey(Phaser.Keyboard.ESC);
        key.onDown.addOnce(function() { Engine.state.start("main"); });

        /*
         * Debug code
         */
        /*var I = new Game.Interpreter();
        I.run(); */
        //create map. Dont store on Game in prod!
        this.map = Engine.add.tilemap("map", Game.tileSize, Game.tileSize);
        this.map.addTilesetImage("floor", "floorTileset")
        this.map.addTilesetImage("object", "objectTileset")
        this.map.createLayer("floor");
        this.map.createLayer("object");

        // Party
        this.party = Engine.add.sprite(0, 0, "objectTileset", 10);
        this.party.anchor.setTo(0.5, 0.5);

        window.party = this.party


        this.cursors = Engine.input.keyboard.createCursorKeys();
        //Game.layer.resizeWorld();
    },

    update: function() {
        var angle = 0.1; // Math.PI / 2
        var dist = 5; // Game.tileSize
        // check input
        if (this.cursors.left.isDown) {
            this.party.rotation = (this.party.rotation - angle) % (Math.PI * 2);
        } else if (this.cursors.right.isDown) {
            this.party.rotation = (this.party.rotation + angle) % (Math.PI * 2);
        }

        if (this.cursors.up.isDown) {
            this.party.x = this.party.x + dist * Math.cos(this.party.rotation);
            this.party.y = this.party.y + dist * Math.sin(this.party.rotation);
        } else if (this.cursors.down.isDown) {
            this.party.x = this.party.x - dist * Math.cos(this.party.rotation);
            this.party.y = this.party.y - dist * Math.sin(this.party.rotation);
        }
    },

    render: function() {

    }
}
