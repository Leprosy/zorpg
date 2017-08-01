/**
 * Party class. This represents the player party in the game.
 *
 */
Game.Party = function() {
    // Setup the phaser object and some metadata
    this.obj = Engine.add.sprite(0, 0, "objectTileset", 10);
    this.obj.anchor.setTo(0.5, 0.5);
    this.x = 0;
    this.y = 0;
    this.d_angle = Math.PI / 2
    this.d_dist = Game.tileSize;

    // Party attributes and stats
    this.gold = 2000;
    this.gems = 50;
    this.quests = {}; //"quest0001": "Check out the statue on the lava temple."};
    this.awards = {};
    this.characters = [new Game.Character("Sir Lepro"), new Game.Character("Lady Aindir"), new Game.Character("Edward the cat")];

    Engine.camera.follow(this.obj); // follow the party through the map
    this.setPosition(0, 0);
}

// Party's quest & awards methods. Checks, adds and removes
Game.Party.prototype.hasQuest = function(questId) {
    if (typeof this.quests[questId] !== "undefined") {
        return this.quests[questId];
    } else {
        return false;
    }
}
Game.Party.prototype.hasAward = function(awardId) {
    if (typeof this.awards[awardId] !== "undefined") {
        return this.awards[awardId];
    } else {
        return false;
    }
}
Game.Party.prototype.removeQuest = function(questId) {
    if (typeof this.quests[questId] !== "undefined") {
        delete this.quests[questId];
    } else {
        console.error("Game.Party: Party doesn't have quest.", questId);
    }
}
Game.Party.prototype.giveQuest = function(obj) {
    try {
        this.quests[obj.questId] = obj.desc;
    } catch(e) {
        console.error("Game.Party: Adding invalid quest obj", obj);
    }
}
Game.Party.prototype.giveAward = function(obj) {
    try {
        this.awards[obj.awardId] = obj.desc;
    } catch(e) {
        console.error("Game.Party: Adding invalid award obj", obj);
    }
}

// Sets the party position in the current world map
Game.Party.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;

    // Do the math
    this.obj.x = x * Game.tileSize + Game.tileSize / 2;
    this.obj.y = y * Game.tileSize + Game.tileSize / 2;
}

// Movement methods
Game.Party.prototype.moveForward = function(map) {
    var pos = this.getForward();
    var tileInfo = map.getTile(pos.x, pos.y);
    console.log("Game.Party: Checking forward position", tileInfo);

    if (this.canPass(tileInfo)) {
        this.setPosition(pos.x, pos.y);

        // Check possible damage
        var damage = map.getTileDamage(pos.x, pos.y);
        if (damage > 0) {
            Game.Utils.damage(damage);
        }
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

// Party object debug string form
Game.Party.prototype.toString = function() { // debug
    var txt = "PartyInfo:\nGold: " + this.gold + " Gems: " + this.gems + "\nChars:\n";
    for (i = 0; i < this.characters.length; ++i) {
        txt += this.characters[i] + " | ";
    }
    txt+= "\nQuests:\n";
    for (i in this.quests) {
        txt += this.quests[i] + "(" + i + ")\n";
    }
    txt+= "\nAwards:\n";
    for (i in this.awards) {
        txt += this.awards[i] + "(" + i + ")\n";
    }
    return txt;
}


/*
 * Character class. Represents a character in the party
 */
Game.Character = function(name) {
    this.name = name;
    this.hp = 100;
}

Game.Character.prototype.toString = function() {
    return this.name + " - " + this.hp;
}