/**
 * Combat queue class. Methods to manage the combat system
 * 
 * each turn, the combatants queue is iterated, until each combatant does an action
 * then, it's reset
 */
Game.Combat = function() {
    this.init();
}

Game.Combat.prototype.init = function() {
    this.monsters = [];
    this.queue = [];
    this.index = -1;
    this.target = 0;
}

// Current index queue fighter attacks
Game.Combat.prototype.attack = function() {
    var attacker = this.queue[this.index];
    var party = Game.playState.party;

    if (!this.isHuman()) { // it's a monster, attack a character
        // Damage someone on the party
        Game.Log("Monster " + attacker + " attacks")
        console.log("Game.Combat: monster attacks " + attacker);
        party.damageN(1, attacker.hitDie);
    } else { // it's a character, attacks target monster
        Game.Log("Character " + attacker + " attacks")
        console.log("Game.Combat: character attacks " + attacker);
        var damage = Game.Utils.die(attacker.hitDie);
        var target = this.monsters[this.target];
        target.hp -= damage;

        // Killed?
        if (target.hp <= 0) {
            this.monsters.splice(this.target, 1);
        }

        // All killed?
        if (this.monsters.length === 0) {
            this.init();
            Game.playState.gameStatus = Game.PLAYING;
        }
    }
}

// Adds a monster to the melee group(3 max)
Game.Combat.prototype.add = function(monster) {
    if (this.monsters.length < 3 && this.monsters.indexOf(monster) < 0) {
        this.monsters.push(monster);
        return true;
    } else {
        return false;
    }
}

//Returns current combatant
Game.Combat.prototype.get = function() {
    return this.queue[this.index];
}

//True if current fighter is human
Game.Combat.prototype.isHuman = function() {
    return !(this.get() instanceof Game.Monster);
}

//Returns targeted monster
Game.Combat.prototype.getTarget = function() {
    if (this.target < 0 || this.target >= this.monsters.length) {
        this.target = 0;
    }

    if (this.monsters.length > 0) {
        return this.monsters[this.target];
    }

    return false;
}

// Go next in the queue
Game.Combat.prototype.next = function() {
    if (this.index === -1) {
        this.reset();
    }

    this.index++;
    console.log("Game.Combat: Advancing queue", this.index);

    if (this.index >= this.queue.length) {
        console.log("Game.Combat: End of queue, round needs reset");
        this.index = -1;
        this.next();
    } else {
        console.log("Game.Combat: " + this.get() + " turn...");
        Game.Log(this.get() + " turn...")
    }
}

// Reset the combat queue
Game.Combat.prototype.reset = function() {
    console.log("Game.Combat: Starting combat round");
    this.index = -1;
    this.queue = [];
    var chars = Game.playState.party.characters;

    // Order combat queue by speed.
    for (i in this.monsters) {
        this.queue.push(this.monsters[i])
    }
    for (i in chars) {
        // if able to fight...
        if (chars[i].hp > 0) {
            this.queue.push(chars[i]);
        }
    }

    this.queue.sort(function compare(a, b) { // Sorting by speed, desc
        if (a.speed < b.speed) {
            return 1;
        }
        if (a.speed > b.speed) {
            return -1;
        }
        return 0;
    });
}

Game.Combat.prototype.toString = function() {
    return this.queue.join("\n");
}