/**
 * Positioned objects in the map(Monsters, Party, etc)
 */
Game.MapObject = function() {
    // Setup the phaser object and some metadata
    this.obj = Engine.add.sprite(0, 0, "objectTileset", 10);
    this.obj.anchor.setTo(0.5, 0.5);
    this.x = 0;
    this.y = 0;
    this.speed = 1;
    this.obj.z = 100;
    this.d_angle = Math.PI / 2
    this.d_dist = Game.tileSize;
}
//Movement methods
Game.MapObject.prototype.moveForward = function() {
    var pos = this.getForward();
    this.doMove(pos);
}
Game.MapObject.prototype.moveBackward = function() {
    var pos = this.getBack();
    this.doMove(pos);
}
Game.MapObject.prototype.doMove = function(pos) {
    var map = Game.playState.map;
    var tileInfo = map.getTile(pos.x, pos.y);
    console.log("Game.MapObject: Checking forward position", tileInfo);

    if (this.canPass(tileInfo)) {
        this.setPosition(pos.x, pos.y);
    } else {
        console.log("Game.MapObject: Can't pass");
    }
}
Game.MapObject.prototype.getForward = function() {
    var x = this.obj.x + this.d_dist * Math.cos(this.obj.rotation);
    var y = this.obj.y + this.d_dist * Math.sin(this.obj.rotation);
    return {
        x: Math.round((x - Game.tileSize / 2) / Game.tileSize),
        y: Math.round((y - Game.tileSize / 2) / Game.tileSize)
    };
}
Game.MapObject.prototype.getBack = function() {
    var x = this.obj.x - this.d_dist * Math.cos(this.obj.rotation);
    var y = this.obj.y - this.d_dist * Math.sin(this.obj.rotation);
    return {
        x: Math.round((x - Game.tileSize / 2) / Game.tileSize),
        y: Math.round((y - Game.tileSize / 2) / Game.tileSize)
    };
}
Game.MapObject.prototype.rotateLeft = function() {
    this.obj.rotation = (this.obj.rotation - this.d_angle) % (Math.PI * 2);
}
Game.MapObject.prototype.rotateRight = function() {
    this.obj.rotation = (this.obj.rotation + this.d_angle) % (Math.PI * 2);
}
// Checks if the tile is passable/exists(needs to be extended to include Party/Monsters exclusive rules
Game.MapObject.prototype.canPass = function(tile) { // Meant to be used with Game.Map.getTile() method
    if (!tile.floor) return false;
    return !tile.floor.properties.block && (!tile.object || !tile.object.properties.block);
}
// Change object position in the current world map
Game.MapObject.prototype.setPosition = function(x, y) {
    console.log("Game.MapObject setPosition of", this, "to", x, y)

    this.x = x;
    this.y = y;

    // Do the math
    this.obj.x = x * Game.tileSize + Game.tileSize / 2;
    this.obj.y = y * Game.tileSize + Game.tileSize / 2;
}








/**
 * Monster class. Baddies >D
 */
Game.Monster = function() {
    Game.MapObject.call(this);

    this.obj.tint = Math.random() * 0xffffff;

    // Monster attributes
    this.name = "Bad demon";
    this.hp = 100;
    this.xp = 20;
    this.hitDie = "1d6";
    this.gold = 10;
    this.isFighting = false;

    this.setPosition(10, 10);
}
Game.Monster.prototype = Object.create(Game.MapObject.prototype);
Game.Monster.prototype.constructor = Game.Monster;

// Basic seek algorithm
Game.Monster.prototype.seekParty = function() {
    var party = Game.playState.party;

    console.log("Game.Monster: checking", "monster", this.x, this.y, "party", party.x, party.y)

    // If not near, forget it
    if (Math.abs(party.x - this.x) < 3 && Math.abs(party.y - this.y) < 3) {
        // If angle is horizontal, try to match vertical coordinate first, and viceversa
        var first = "x", second = "y";

        if (party.obj.angle === 0 || party.obj.angle === -180) {
            first = "y"; second = "x"
        }

        // Try to match first coordinate, then the second one
        if (party[first] > this[first]) {
            this[first]++;
        } else if (party[first] < this[first]) {
            this[first]--;
        } else {
            if (party[second] > this[second]) {
                this[second]++;
            } else if (party[second] < this[second]){
                this[second]--;
            }
        }

        this.setPosition(this.x, this.y);

        // TAG...if monster reachs party, push to the queue.
        if (this.x === party.x && this.y === party.y && !this.isFighting) {
            console.log("Game.Monster: Monster added to the queue", this);
            this.isFighting = true;
            Game.playState.combat.add(this);
            Game.playState.gameStatus = Game.FIGHTING;
        }
    }
}

Game.Monster.prototype.toString = function() {
    return this.name + "(hp:" + this.hp + "-spd:" + this.speed + ")";
}








/**
 * Party class. This represents the player party in the game.
 *
 */
Game.Party = function() {
    Game.MapObject.call(this);

    // Party attributes and stats
    this.gold = 2000;
    this.gems = 50;
    this.quests = {};
    this.awards = {};

    // debug start party
    this.characters = [new Game.Character("Sir Lepro"),
                       new Game.Character("Lady Aindir"),
                       new Game.Character("Edward the cat")];
    this.characters[0].speed = 12;
    this.characters[1].speed = 10;
    this.characters[2].speed = 20;

    Engine.camera.follow(this.obj); // follow the party through the map
}
Game.Party.prototype = Object.create(Game.MapObject.prototype);
Game.Party.prototype.constructor = Game.Party;

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


// Damage a random number of party members, for a die of damage
Game.Party.prototype.damageN = function(number, dieString) {
    var damage = Game.Utils.die(dieString);
    var charIndex = Game.Utils.die("1d" + (this.characters.length - 1));

    for (i = 0; i < number; ++i) {
        this.damageChar(this.characters[charIndex], damage);
    }
}
// Damage all
Game.Party.prototype.damageAll = function(dieString) {
    var damage = Game.Utils.die(dieString);

    for (i = 0; i < this.characters.length; ++i) {
        this.damageChar(this.characters[i], damage);
    }
}
Game.Party.prototype.damageChar = function(char, damage) {
    Game.Log(char + " received " + damage + " damage!");
    console.log("Game.Party: Damaging " + char + " for " + damage);
    char.hp -= damage;
    Game.Utils.damage(damage);
}

// Set position extension for Party - calculates tile damage
Game.Party.prototype.setPostiion = (function(setPosition) {
    Game.Party.prototype.setPosition = function (x, y) {
        setPosition.call(this, x, y); // Run parent method

        // Extending code - check tile damage for party
        console.log("Game.Party setPosition")
        var map = Game.playState.map;
        var damageDices = map.getTileDamage(x, y);

        for (i in damageDices) {
            this.damageAll(damageDices[i]);
        }
    };
}(Game.Party.prototype.setPosition));

// Party object debug string form
Game.Party.prototype.toString = function() { // debug
    var txt = "[PartyInfo] Gold: " + this.gold + " Gems: " + this.gems + "\n[CHARS]";
    for (i = 0; i < this.characters.length; ++i) {
        txt += this.characters[i] + " | ";
    }
    txt+= "\n[QUESTS]\n";
    for (i in this.quests) {
        txt += this.quests[i] + "(" + i + ")\n";
    }
    txt+= "\n[AwARDS]\n";
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
    this.hitDie = "1d8";
}

Game.Character.prototype.toString = function() {
    return this.name + "(hp:" + this.hp + "-spd:" + this.speed + ")";
}