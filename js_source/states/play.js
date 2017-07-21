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

        // Create basic entities
        this.map = new Game.Map();
        this.party = new Game.Party();
        //this.party.setPosition(5, 5);

        // Input
        Engine.input.keyboard.onDownCallback = function(ev) { _this._inputHandler(ev) };

        //Game.layer.resizeWorld();
    },

    update: function() {
        document.getElementById("debug").value = this.party.x + " - " + this.party.y;
    },

    render: function() {

    },



    _inputHandler: function(ev) {
        console.log("keypressed", ev)

        switch(ev.code) {
            // Party movement
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

            // Fire map tile action
            case "Space":
                console.log("Action");
                break;

            // Exit
            case "Escape":
                Engine.state.start("main");
                break;
        }
    }
}




/**
 * Party class. This represents the player party in the game.
 */
Game.Party = function() {
    this.obj = Engine.add.sprite(0, 0, "objectTileset", 10);
    this.obj.anchor.setTo(0.5, 0.5);
    this.x = 0;
    this.y = 0;
    this.d_angle = Math.PI / 2
    this.d_dist = Game.tileSize;

    this.setPosition(0, 0);
}

Game.Party.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;

    // Do the math
    this.obj.x = x * Game.tileSize + Game.tileSize / 2;
    this.obj.y = y * Game.tileSize + Game.tileSize / 2;
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
    this.x = Math.round((this.obj.x - Game.tileSize / 2) / Game.tileSize);
    this.y = Math.round((this.obj.y - Game.tileSize / 2) / Game.tileSize);
}




/**
 * Map class. Methods to interact with the tile based game maps.
 */
Game.Map = function() {
    this.obj = Engine.add.tilemap("map", Game.tileSize, Game.tileSize);

    this.obj.addTilesetImage("floor", "floorTileset")
    this.obj.addTilesetImage("object", "objectTileset")
    this.obj.createLayer("floor");
    this.obj.createLayer("object");
}

Game.Map.prototype.getTile = function(x, y) {
    return "x" + x + "-y" + y;
}