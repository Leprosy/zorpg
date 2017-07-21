/**
 *  Play loop state
 */
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

        // Input
        Engine.input.keyboard.onDownCallback = function(ev) { _this._inputHandler(ev) };

        //Game.layer.resizeWorld();
    },
    update: function() {
        document.getElementById("debug").value = this.party.x + " - " + this.party.y;
    },



    _inputHandler: function(ev) {
        console.log("keypressed", ev)

        switch(ev.code) {
            // Party movement
            case "ArrowUp":
                var pos = this.party.getForward();
                var tileInfo = this.map.getTile(pos.x, pos.y);
                console.log("checking", tileInfo);

                if (this.party.canPass(tileInfo)) {
                    this.party.setPosition(pos.x, pos.y);
                    //Trigger tile effects(ie. damage, heal, teleport, script)
                } else {
                    console.log("can't pass");
                }

                break;
            case "ArrowDown":
                this.party.getBack();
                //Copy logic from forward case
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
Game.Party.prototype.getForward = function() {
    var x = this.obj.x + this.d_dist * Math.cos(this.obj.rotation);
    var y = this.obj.y + this.d_dist * Math.sin(this.obj.rotation);
    return {
        x: Math.round((x - Game.tileSize / 2) / Game.tileSize),
        y: Math.round((y - Game.tileSize / 2) / Game.tileSize)
    };
}
Game.Party.prototype.getBack = function() {
    var x = this.obj.x - this.d_dist * Math.cos(this.obj.rotation);
    var y = this.obj.y - this.d_dist * Math.sin(this.obj.rotation);
    return {
        x: Math.round((x - Game.tileSize / 2) / Game.tileSize),
        y: Math.round((y - Game.tileSize / 2) / Game.tileSize)
    };
}
Game.Party.prototype.rotateLeft = function() {
    this.obj.rotation = (this.obj.rotation - this.d_angle) % (Math.PI * 2);
}
Game.Party.prototype.rotateRight = function() {
    this.obj.rotation = (this.obj.rotation + this.d_angle) % (Math.PI * 2);
}
Game.Party.prototype.canPass = function(tile) { // Meant to be used with Game.Map.getTile() method
    return !tile.floor.properties.block && (!tile.object || !tile.object.properties.block);
}




/**
 * Map class. Methods to interact with the tile based game maps.
 * 
 * Tile properties:
 * 
 * block: the tile blocks the player
 * damage: the tile damages the player(using a die string)
 */
Game.Map = function() {
    this.obj = Engine.add.tilemap("map", Game.tileSize, Game.tileSize);

    this.obj.addTilesetImage("floor", "floorTileset")
    this.obj.addTilesetImage("object", "objectTileset")
    this.obj.createLayer("floor");
    this.obj.createLayer("object");

    this.script = JSON.parse(this.obj.properties.script);
}

Game.Map.prototype.getTile = function(x, y) {
    return {
        x: x, y: y,
        floor: this.obj.getTile(x, y, "floor"),
        object: this.obj.getTile(x, y, "object")
    };
}
