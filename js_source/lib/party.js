/**
 * Party class. This represents the player party in the game.
 *
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
Game.Party.prototype.moveForward = function(map) {
    var pos = this.getForward();
    var tileInfo = map.getTile(pos.x, pos.y);
    console.log("Game.Party: Checking forward position", tileInfo);

    if (this.canPass(tileInfo)) {
        this.setPosition(pos.x, pos.y);
        //Trigger tile effects(ie. damage, heal, teleport, script)
    } else {
        console.log("Game.Party: Party can't pass");
    }
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
    if (!tile.floor) return false;

    return !tile.floor.properties.block && (!tile.object || !tile.object.properties.block);
}
