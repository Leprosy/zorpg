/**
 * Map class. Methods to interact with the tile based game maps.
 *
 * Tile properties:
 *
 * block: the tile blocks the player
 * damage: the tile damages the player(using a die string)
 */
Game.Map = function() {
    this.group = Engine.add.group();
    this.group.z = 0;
    this.obj = null;
    this.script = {};
    this.properties = {};

    // Load default first map
    this.load("map1");
}

// Load map
Game.Map.prototype.load = function(key) {
    // Remove old map
    this.group.removeAll();

    // Create new one
    this.obj = Engine.add.tilemap(key, Game.tileSize, Game.tileSize);
    this.obj.addTilesetImage("floor", "floorTileset");
    this.obj.addTilesetImage("object", "objectTileset");

    var floor = this.obj.createLayer("floor");
    var object = this.obj.createLayer("object");
    floor.resizeWorld();
    this.group.add(floor);
    this.group.add(object);

    this.script = JSON.parse(this.obj.properties.script);
    this.properties = this.obj.properties;
}

// Get tile info from a x-y position
Game.Map.prototype.getTile = function(x, y) {
    return {
        x: x, y: y,
        floor: this.obj.getTile(x, y, "floor"),
        object: this.obj.getTile(x, y, "object")
    };
}

// Get the damage tile inflicts in party(object + floor)
Game.Map.prototype.getTileDamage = function(x, y) {
    var dices = [];
    var floor  = this.obj.getTile(x, y, "floor"),
        object = this.obj.getTile(x, y, "object");

    if (floor && floor.properties.damage) {
        dices.push(floor.properties.damage);
    }
    if (object && object.properties.damage) {
        dices.push(object.properties.damage);
    }

    return dices;
}

// Get tile script, if any
Game.Map.prototype.getScript = function(x, y) {
    if (typeof this.script[x + "x" + y] !== "undefined") {
        return this.script[x + "x" + y]; 
    } else {
        return false;
    }
}
