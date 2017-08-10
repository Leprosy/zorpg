/**
 * Combat queue class. Methods to manage the combat system
 * 
 * each turn, the combatants queue is iterated, until each combatant does an action
 * then, it's reset
 */
Game.Combat = function() {
    this.monsters = [];
    this.queue = [];
    this.index = -1;
}


// Adds a monster to the melee group(3 max)
Game.Combat.prototype.add = function(monster) {
    this.monsters.push(monster);
}

//Returns current combatant
Game.Combat.prototype.get = function() {
    return this.queue[this.index];
}

// Go next in the queue
Game.Combat.prototype.next = function() {
    this.index++;
    console.log("Game.Combat: Advancing queue", this.index);

    if (this.index > this.queue.length) {
        console.log("Game.Combat: End of queue, needs reset");
        this.index = -1;
    }
}

// Reset the combat queue
Game.Combat.prototype.reset = function() {
    console.log("Game.Combat: Reseting queue", this.index);
    this.index = -1;
    this.queue = [];
    var chars = Game.playState.party.characters;

    // Remove dead monsters?

    // Order combat queue by speed(including alive monsters and chars)
    for (i in this.monsters) {
        this.queue.push(this.monsters[i])
    }
    for (i in chars) {
        // if able to fight...
        this.queue.push(chars[i]);
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

    // Start combat turn
    this.index = 0;
}

Game.Combat.prototype.toString = function() {
    return this.queue.join("\n");
}