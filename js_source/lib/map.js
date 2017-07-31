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
    var layer = this.obj.createLayer("floor");
    this.obj.createLayer("object");

    layer.resizeWorld();
    this.script = JSON.parse(this.obj.properties.script);
}

Game.Map.prototype.getTile = function(x, y) {
    return {
        x: x, y: y,
        floor: this.obj.getTile(x, y, "floor"),
        object: this.obj.getTile(x, y, "object")
    };
}
Game.Map.prototype.getScript = function(x, y) {
    if (typeof this.script[x + "x" + y] !== "undefined") {
        return this.script[x + "x" + y]; 
    } else {
        return false;
    }
}
