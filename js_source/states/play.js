// Play loop state
Game.playState = {
    map: null,
    party: null,
    cursors: null,

    preload: function() {
        Engine.load.tilemap("map", "maps/map1.json", null, Phaser.Tilemap.TILED_JSON);
    },

    create: function() {
        console.info(Game.name + " play state", Game);
        var _this = this;

        // ESC: go back to menu
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
        /**
         * End
         */

        // Party
        this.party = new Game.Party();

        // Input
        Engine.input.keyboard.onDownCallback = function(ev) {
            _this._inputHandler(ev);
        };
        //this.cursors = Engine.input.keyboard.createCursorKeys();
        //Game.layer.resizeWorld();
    },

    update: function() {
        // check input
        

        document.getElementById("debug").value = this.party.x + " - " + this.party.y;
    },

    render: function() {

    },

    _inputHandler: function(ev) {
        console.log("keypressed", ev)

        switch(ev.code) {
            case "ArrowUp":
                this.party.moveForward();
                break;
            case "ArrowDown":
                this.party.moveBack();
                break;
            case "ArrowLeft":
                this.party.rotateLeft();
                break;
            case "ArrowRight":
                this.party.rotateRight();
                break;
        }
    }
}





Game.Party = function() {
    this.obj = Engine.add.sprite(0, 0, "objectTileset", 10);
    this.obj.anchor.setTo(0.5, 0.5);

    this.x = 0;
    this.y = 0;

    this.d_angle = 0.1; // Math.PI / 2
    this.d_dist = 5; // Game.tileSize
}

Game.Party.prototype.moveForward = function() {
    this.obj.x = this.obj.x + this.d_dist * Math.cos(this.obj.rotation);
    this.obj.y = this.obj.y + this.d_dist * Math.sin(this.obj.rotation);
    this._calculatePos();
}
Game.Party.prototype.moveBack = function() {
    this.obj.x = this.obj.x - this.d_dist * Math.cos(this.obj.rotation);
    this.obj.y = this.obj.y - this.d_dist * Math.sin(this.obj.rotation);
    this._calculatePos();
}
Game.Party.prototype.rotateLeft = function() {
    this.obj.rotation = (this.obj.rotation - this.d_angle) % (Math.PI * 2);
}
Game.Party.prototype.rotateRight = function() {
    this.obj.rotation = (this.obj.rotation + this.d_angle) % (Math.PI * 2);
}
Game.Party.prototype._calculatePos = function() {
    this.x = Math.round(this.obj.x / Game.tileSize);
    this.y = Math.round(this.obj.y / Game.tileSize);
}