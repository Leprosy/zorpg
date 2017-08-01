/**
 * Utils & Helpers
 */
Game.Utils = {};

// Parses die notation for random
Game.Utils.die = function(str) {
    try {
        //xdy+z => x dices of y faces, ie (random(y) * x) + z
        var plus = str.split("+");
        var die = plus[0];
        plus = 1 * plus[1] || 0;

        die = die.split("d");
        var factor = 1 * die[0];
        var faces = 1 * die[1];

        return plus + (Math.round(Math.random() * faces) * factor);
    } catch(e) {
        console.error("Game.Utils.die: Bad die string", str);
        return false;
    }
}

// Damage animation
Game.Utils.damage = function(damage) {
    Engine.camera.shake(damage / 1000, 300, true);
    Engine.camera.flash(0xff0000, 100, true)
    console.log("Game.Utils.damage: Party gets damage for " + damage)
}